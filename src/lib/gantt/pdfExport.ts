import jsPDF from "jspdf";
import type { GanttItem, ZoomLevel } from "./types";
import { VITALIS } from "./types";
import { toDate, addDays, diffDays, toISO, today } from "./dates";
import { computeCriticalPath, computeOverallProgress, isOverdue, varianceDays } from "./critical";

export interface PdfExportOptions {
  paperSize: "A4" | "Letter" | "A3";
  orientation: "landscape" | "portrait";
  zoom: ZoomLevel;
  includeCompleted: boolean;
  includeDependencies: boolean;
  includeCriticalPath: boolean;
  includeBaseline: boolean;
  greyscale: boolean;
  startDate?: string | null;
  endDate?: string | null;
}

export interface PdfExportContext {
  items: GanttItem[];
  members: Record<string, { full_name: string | null; email: string | null }>;
  projectName: string;
  clientName: string;
  projectStart?: string | null;
  projectEnd?: string | null;
  preparedBy: string;
  logoUrl?: string;
}

const PAGE_SIZES: Record<string, [number, number]> = {
  A4: [842, 595], Letter: [792, 612], A3: [1191, 842], // landscape pt
};
const PAGE_SIZES_PORTRAIT: Record<string, [number, number]> = {
  A4: [595, 842], Letter: [612, 792], A3: [842, 1191],
};

const ZOOM_PX: Record<ZoomLevel, number> = { day: 24, week: 8, month: 2.2, quarter: 0.8 };

function greyOf(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const y = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
  const h = y.toString(16).padStart(2, "0");
  return `#${h}${h}${h}`;
}
const C = (opts: PdfExportOptions, hex: string) => (opts.greyscale ? greyOf(hex) : hex);

async function loadImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const fr = new FileReader();
      fr.onload = () => resolve(String(fr.result));
      fr.onerror = () => resolve(null);
      fr.readAsDataURL(blob);
    });
  } catch { return null; }
}

export async function exportGanttPdf(ctx: PdfExportContext, opts: PdfExportOptions) {
  const fmt = opts.orientation === "landscape" ? PAGE_SIZES[opts.paperSize] : PAGE_SIZES_PORTRAIT[opts.paperSize];
  const pdf = new jsPDF({ orientation: opts.orientation, unit: "pt", format: fmt });
  const W = pdf.internal.pageSize.getWidth();
  const H = pdf.internal.pageSize.getHeight();

  const filtered = opts.includeCompleted ? ctx.items : ctx.items.filter((i) => !(i.is_complete || i.progress >= 100 || i.status === "complete"));
  // Date range filter
  const rs = opts.startDate ? toDate(opts.startDate) : null;
  const re = opts.endDate ? toDate(opts.endDate) : null;
  const inRange = (i: GanttItem) => {
    if (!rs && !re) return true;
    const s = toDate(i.start_date), e = toDate(i.end_date) ?? s;
    if (!s) return true;
    if (rs && (e ?? s) < rs) return false;
    if (re && s > re) return false;
    return true;
  };
  const items = filtered.filter(inRange);

  const cp = computeCriticalPath(items);
  const overall = computeOverallProgress(items);
  const overdue = items.filter(isOverdue);

  const logo = ctx.logoUrl ? await loadImage(ctx.logoUrl) : null;

  // ========= COVER PAGE =========
  pdf.setFillColor(VITALIS.cream); pdf.rect(0, 0, W, H, "F");
  pdf.setFillColor(C(opts, VITALIS.green)); pdf.rect(0, 0, W, 6, "F");
  if (logo) {
    try { pdf.addImage(logo, "PNG", W / 2 - 60, 80, 120, 60); } catch {}
  }
  pdf.setTextColor(C(opts, VITALIS.green));
  pdf.setFont("times", "bold"); pdf.setFontSize(28);
  pdf.text("Project Plan", W / 2, 200, { align: "center" });
  pdf.setFont("helvetica", "normal"); pdf.setFontSize(20); pdf.setTextColor(C(opts, VITALIS.green));
  pdf.text(ctx.projectName, W / 2, 240, { align: "center" });
  pdf.setFontSize(13); pdf.setTextColor(C(opts, VITALIS.sage));
  pdf.text(ctx.clientName, W / 2, 265, { align: "center" });

  pdf.setDrawColor(C(opts, VITALIS.gold)); pdf.setLineWidth(2);
  pdf.line(W / 2 - 60, 285, W / 2 + 60, 285);

  const dateRange = `${ctx.projectStart ?? "—"}  →  ${cp.endDate ? toISO(cp.endDate) : ctx.projectEnd ?? "—"}`;
  pdf.setFontSize(11); pdf.setTextColor(C(opts, VITALIS.green));
  pdf.text(`Date range: ${dateRange}`, W / 2, 320, { align: "center" });
  pdf.text(`Exported on: ${toISO(today())}`, W / 2, 340, { align: "center" });
  pdf.text(`Prepared by: ${ctx.preparedBy}`, W / 2, 360, { align: "center" });

  pdf.setFontSize(9); pdf.setTextColor(C(opts, VITALIS.sage));
  pdf.text("Vitalis Health Strategies — Confidential", W / 2, H - 30, { align: "center" });

  // ========= TIMELINE PAGES =========
  const allDates = items.flatMap((i) => [toDate(i.start_date), toDate(i.end_date)]).filter((d): d is Date => !!d);
  if (allDates.length === 0) {
    drawSummary(pdf, ctx, items, overall, overdue, opts);
    finalisePages(pdf, ctx);
    pdf.save(filename(ctx));
    return;
  }

  const minDate = rs ?? allDates.reduce((a, b) => (a < b ? a : b));
  const maxDate = re ?? allDates.reduce((a, b) => (a > b ? a : b));
  const totalDays = diffDays(minDate, maxDate) + 1;

  const margin = 30;
  const headerH = 60;
  const footerH = 30;
  const leftPanelW = Math.min(280, W * 0.35);
  const timelineX = margin + leftPanelW;
  const usableW = W - margin - timelineX;
  const usableH = H - headerH - footerH - margin * 2;
  const rowH = 18;
  const rowsPerPage = Math.floor(usableH / rowH);
  const pxPerDay = ZOOM_PX[opts.zoom];
  const daysPerTimelinePage = Math.max(7, Math.floor(usableW / pxPerDay));
  const timelinePages = Math.max(1, Math.ceil(totalDays / daysPerTimelinePage));
  const itemPages = Math.max(1, Math.ceil(items.length / rowsPerPage));

  for (let tp = 0; tp < timelinePages; tp++) {
    const segStart = addDays(minDate, tp * daysPerTimelinePage);
    const segDays = Math.min(daysPerTimelinePage, totalDays - tp * daysPerTimelinePage);
    const segEnd = addDays(segStart, segDays - 1);

    for (let ip = 0; ip < itemPages; ip++) {
      pdf.addPage();
      drawHeader(pdf, ctx, opts, segStart, segEnd);

      // Left panel header
      pdf.setFillColor(C(opts, VITALIS.green)); pdf.rect(margin, headerH, leftPanelW, 22, "F");
      pdf.setTextColor(255, 255, 255); pdf.setFontSize(9); pdf.setFont("helvetica", "bold");
      pdf.text("Item", margin + 6, headerH + 15);
      pdf.text("Assignee", margin + leftPanelW - 95, headerH + 15);
      pdf.text("Prog", margin + leftPanelW - 25, headerH + 15);

      // Timeline scale
      pdf.setFillColor(C(opts, VITALIS.green)); pdf.rect(timelineX, headerH, usableW, 22, "F");
      drawTimelineScale(pdf, opts, timelineX, headerH, usableW, segStart, segDays, pxPerDay);

      const sliceStart = ip * rowsPerPage;
      const slice = items.slice(sliceStart, sliceStart + rowsPerPage);

      // Today line
      const td = today();
      if (td >= segStart && td <= segEnd) {
        const x = timelineX + diffDays(segStart, td) * pxPerDay;
        pdf.setDrawColor(255, 140, 0); pdf.setLineWidth(1);
        pdf.line(x, headerH + 22, x, H - footerH - margin);
      }

      // Rows
      slice.forEach((it, idx) => {
        const y = headerH + 22 + idx * rowH;
        const zebra = idx % 2 === 1;
        if (zebra) { pdf.setFillColor(247, 244, 237); pdf.rect(margin, y, leftPanelW + usableW, rowH, "F"); }
        pdf.setTextColor(C(opts, VITALIS.green));
        pdf.setFontSize(9);
        pdf.setFont("helvetica", it.type === "section" ? "bold" : "normal");
        const indent = it.type === "section" ? 0 : it.type === "sub_item" ? 16 : 8;
        const title = trim(pdf, it.title, leftPanelW - 110 - indent);
        const titlePrefix = (it.progress >= 100 || it.is_complete) ? "\u2713 " : "";
        pdf.text(titlePrefix + title, margin + 6 + indent, y + 12);
        // strikethrough done
        if ((it.progress >= 100 || it.is_complete) && it.type !== "section") {
          const tw = pdf.getTextWidth(titlePrefix + title);
          pdf.setDrawColor(120, 120, 120); pdf.setLineWidth(0.6);
          pdf.line(margin + 6 + indent, y + 10, margin + 6 + indent + tw, y + 10);
        }
        // Assignee
        const a = it.assignee_id ? ctx.members[it.assignee_id] : null;
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8); pdf.setTextColor(100, 100, 100);
        pdf.text(trim(pdf, a?.full_name || a?.email || "", 80), margin + leftPanelW - 95, y + 12);
        pdf.text(`${it.progress}%`, margin + leftPanelW - 25, y + 12);

        // Critical path label
        if (opts.includeCriticalPath && cp.ids.has(it.id)) {
          pdf.setFillColor(C(opts, "#FEE2E2")); pdf.rect(margin + 2, y + 2, 4, rowH - 4, "F");
        }

        // Timeline bar
        const s = toDate(it.start_date), e = toDate(it.end_date) ?? s;
        if (s && e) {
          const visStart = s < segStart ? segStart : s;
          const visEnd = e > segEnd ? segEnd : e;
          if (visStart <= visEnd && visEnd >= segStart && visStart <= segEnd) {
            const bx = timelineX + diffDays(segStart, visStart) * pxPerDay;
            const bw = Math.max(2, (diffDays(visStart, visEnd) + 1) * pxPerDay);
            const by = y + 4;
            const bh = rowH - 8;
            // Baseline ghost
            if (opts.includeBaseline) {
              const bs = toDate(it.baseline_start), be = toDate(it.baseline_end) ?? bs;
              if (bs && be) {
                const vs = bs < segStart ? segStart : bs;
                const ve = be > segEnd ? segEnd : be;
                if (vs <= ve) {
                  const bxg = timelineX + diffDays(segStart, vs) * pxPerDay;
                  const bwg = Math.max(2, (diffDays(vs, ve) + 1) * pxPerDay);
                  pdf.setDrawColor(180, 180, 180); pdf.setLineWidth(0.5);
                  pdf.setFillColor(230, 230, 230);
                  pdf.rect(bxg, by + bh - 3, bwg, 3, "FD");
                }
              }
            }
            if (it.type === "milestone") {
              // diamond
              const cx = bx, cy = by + bh / 2; const sz = 5;
              pdf.setFillColor(C(opts, it.colour || VITALIS.gold));
              pdf.triangle(cx, cy - sz, cx + sz, cy, cx, cy + sz, "F");
              pdf.triangle(cx, cy - sz, cx - sz, cy, cx, cy + sz, "F");
            } else if (it.type === "section") {
              pdf.setFillColor(C(opts, it.colour || VITALIS.sage));
              pdf.rect(bx, by + bh / 2 - 1, bw, 2, "F");
            } else {
              const fill = it.colour || VITALIS.sage;
              pdf.setFillColor(C(opts, fill));
              pdf.rect(bx, by, bw, bh, "F");
              // progress overlay
              if (it.progress > 0) {
                pdf.setFillColor(C(opts, VITALIS.green));
                pdf.rect(bx, by, (bw * Math.min(100, it.progress)) / 100, bh, "F");
              }
              // critical border
              if (opts.includeCriticalPath && cp.ids.has(it.id)) {
                pdf.setDrawColor(192, 57, 43); pdf.setLineWidth(1);
                pdf.rect(bx, by, bw, bh, "S");
              }
            }
          }
        }
      });

      // Dependencies arrows (simple, within visible window)
      if (opts.includeDependencies) drawDeps(pdf, opts, items, slice, timelineX, headerH + 22, segStart, segDays, pxPerDay, rowH, segEnd);

      drawFooter(pdf, ctx);
    }
  }

  // ========= SUMMARY PAGE =========
  pdf.addPage();
  drawHeader(pdf, ctx, opts);
  drawSummary(pdf, ctx, items, overall, overdue, opts);
  drawFooter(pdf, ctx);

  finalisePages(pdf, ctx);
  pdf.save(filename(ctx));
}

function filename(ctx: PdfExportContext) {
  const safe = (s: string) => s.replace(/[^a-z0-9-]+/gi, "-").replace(/^-|-$/g, "");
  return `${safe(ctx.clientName)}-${safe(ctx.projectName)}-gantt.pdf`;
}

function trim(pdf: jsPDF, s: string, maxW: number): string {
  if (pdf.getTextWidth(s) <= maxW) return s;
  let lo = 0, hi = s.length;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (pdf.getTextWidth(s.slice(0, mid) + "…") <= maxW) lo = mid; else hi = mid - 1;
  }
  return s.slice(0, lo) + "…";
}

function drawHeader(pdf: jsPDF, ctx: PdfExportContext, opts: PdfExportOptions, segStart?: Date, segEnd?: Date) {
  const W = pdf.internal.pageSize.getWidth();
  pdf.setFillColor(C(opts, VITALIS.green)); pdf.rect(0, 0, W, 4, "F");
  pdf.setTextColor(C(opts, VITALIS.green)); pdf.setFont("helvetica", "bold"); pdf.setFontSize(11);
  pdf.text(`${ctx.projectName}`, 30, 28);
  pdf.setFont("helvetica", "normal"); pdf.setFontSize(9); pdf.setTextColor(C(opts, VITALIS.sage));
  pdf.text(ctx.clientName, 30, 44);
  if (segStart && segEnd) {
    pdf.text(`${toISO(segStart)} → ${toISO(segEnd)}`, W - 30, 28, { align: "right" });
  }
}

function drawFooter(pdf: jsPDF, ctx: PdfExportContext) {
  const W = pdf.internal.pageSize.getWidth();
  const H = pdf.internal.pageSize.getHeight();
  pdf.setDrawColor(200, 200, 200); pdf.setLineWidth(0.5);
  pdf.line(30, H - 28, W - 30, H - 28);
  pdf.setFontSize(8); pdf.setTextColor(120, 120, 120);
  pdf.text(`Vitalis Health Strategies | ${ctx.clientName} | ${ctx.projectName} | Confidential`, 30, H - 14);
}

function finalisePages(pdf: jsPDF, ctx: PdfExportContext) {
  const n = pdf.getNumberOfPages();
  for (let i = 1; i <= n; i++) {
    pdf.setPage(i);
    const W = pdf.internal.pageSize.getWidth();
    const H = pdf.internal.pageSize.getHeight();
    pdf.setFontSize(8); pdf.setTextColor(120, 120, 120);
    pdf.text(`Page ${i} of ${n}`, W - 30, H - 14, { align: "right" });
  }
}

function drawTimelineScale(pdf: jsPDF, opts: PdfExportOptions, x: number, y: number, w: number, segStart: Date, segDays: number, pxPerDay: number) {
  pdf.setTextColor(255, 255, 255); pdf.setFontSize(7); pdf.setFont("helvetica", "bold");
  const step = opts.zoom === "day" ? 1 : opts.zoom === "week" ? 7 : opts.zoom === "month" ? 30 : 90;
  for (let d = 0; d < segDays; d += step) {
    const date = addDays(segStart, d);
    const cx = x + d * pxPerDay;
    let label = "";
    if (opts.zoom === "day") label = `${date.getDate()}`;
    else if (opts.zoom === "week") label = `${date.getMonth() + 1}/${date.getDate()}`;
    else if (opts.zoom === "month") label = date.toLocaleDateString(undefined, { month: "short" });
    else label = `Q${Math.floor(date.getMonth() / 3) + 1}'${String(date.getFullYear()).slice(2)}`;
    pdf.text(label, cx + 2, y + 15);
    pdf.setDrawColor(255, 255, 255, 0.2);
    pdf.setLineWidth(0.3);
    pdf.line(cx, y, cx, y + 22);
  }
}

function drawDeps(pdf: jsPDF, opts: PdfExportOptions, allItems: GanttItem[], visible: GanttItem[], tx: number, ty: number, segStart: Date, segDays: number, pxPerDay: number, rowH: number, segEnd: Date) {
  const indexOf = new Map(visible.map((i, idx) => [i.id, idx]));
  pdf.setDrawColor(C(opts, VITALIS.sage)); pdf.setLineWidth(0.4);
  for (let i = 0; i < visible.length; i++) {
    const it = visible[i];
    for (const dep of it.dependencies ?? []) {
      const from = allItems.find((x) => x.id === dep.from); if (!from) continue;
      const fromIdx = indexOf.get(from.id); if (fromIdx === undefined) continue;
      const fromEnd = toDate(from.end_date) ?? toDate(from.start_date); if (!fromEnd) continue;
      const toStart = toDate(it.start_date); if (!toStart) continue;
      if (fromEnd < segStart || toStart > segEnd) continue;
      const x1 = tx + diffDays(segStart, fromEnd) * pxPerDay + 2;
      const y1 = ty + fromIdx * rowH + rowH / 2;
      const x2 = tx + diffDays(segStart, toStart) * pxPerDay;
      const y2 = ty + i * rowH + rowH / 2;
      pdf.line(x1, y1, x1 + 4, y1);
      pdf.line(x1 + 4, y1, x1 + 4, y2);
      pdf.line(x1 + 4, y2, x2, y2);
    }
  }
}

function drawSummary(pdf: jsPDF, ctx: PdfExportContext, items: GanttItem[], overall: number, overdue: GanttItem[], opts: PdfExportOptions) {
  const W = pdf.internal.pageSize.getWidth();
  const sections = items.filter((i) => i.type === "section").length;
  const milestones = items.filter((i) => i.type === "milestone").length;
  const tasks = items.length - sections - milestones;
  const ends = items.map((i) => toDate(i.end_date) ?? toDate(i.start_date)).filter((d): d is Date => !!d);
  const starts = items.map((i) => toDate(i.start_date)).filter((d): d is Date => !!d);
  const projEnd = ends.length ? ends.reduce((a, b) => (a > b ? a : b)) : null;
  const projStart = starts.length ? starts.reduce((a, b) => (a < b ? a : b)) : null;
  const days = projEnd ? diffDays(today(), projEnd) : null;

  let y = 80;
  pdf.setTextColor(C(opts, VITALIS.green)); pdf.setFont("helvetica", "bold"); pdf.setFontSize(18);
  pdf.text("Project Summary", 30, y); y += 24;
  pdf.setDrawColor(C(opts, VITALIS.gold)); pdf.setLineWidth(1.5);
  pdf.line(30, y - 16, 100, y - 16);

  pdf.setFont("helvetica", "normal"); pdf.setFontSize(10);
  const lines = [
    [`Total items`, String(items.length)],
    [`Sections / Tasks / Milestones`, `${sections} / ${tasks} / ${milestones}`],
    [`Overall progress`, `${overall}%`],
    [`Project start`, projStart ? toISO(projStart) : "—"],
    [`Projected end`, projEnd ? toISO(projEnd) : "—"],
    [`Days remaining`, days === null ? "—" : days < 0 ? `${Math.abs(days)} overdue` : `${days}`],
    [`Overdue items`, String(overdue.length)],
  ];
  for (const [k, v] of lines) {
    pdf.setTextColor(C(opts, VITALIS.sage)); pdf.text(k, 30, y);
    pdf.setTextColor(C(opts, VITALIS.green)); pdf.setFont("helvetica", "bold"); pdf.text(v, 250, y);
    pdf.setFont("helvetica", "normal"); y += 18;
  }
  if (overdue.length) {
    y += 8;
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(11); pdf.setTextColor(C(opts, "#C0392B"));
    pdf.text("Overdue items", 30, y); y += 16;
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(9); pdf.setTextColor(C(opts, VITALIS.green));
    for (const o of overdue.slice(0, 20)) { pdf.text(`• ${o.title} (${o.end_date ?? "—"})`, 36, y); y += 13; }
  }

  // Team members
  const byA = new Map<string, GanttItem[]>();
  for (const i of items) {
    if (!i.assignee_id) continue;
    if (!byA.has(i.assignee_id)) byA.set(i.assignee_id, []);
    byA.get(i.assignee_id)!.push(i);
  }
  if (byA.size) {
    y += 14;
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(11); pdf.setTextColor(C(opts, VITALIS.green));
    pdf.text("Team members & assignments", 30, y); y += 14;
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(9);
    for (const [aid, arr] of byA) {
      const m = ctx.members[aid];
      const name = m?.full_name || m?.email || "Unknown";
      pdf.setFont("helvetica", "bold"); pdf.text(name, 36, y);
      pdf.setFont("helvetica", "normal"); pdf.text(`${arr.length} item(s)`, 220, y);
      y += 13;
      if (y > pdf.internal.pageSize.getHeight() - 60) { pdf.addPage(); drawHeader(pdf, ctx, opts); drawFooter(pdf, ctx); y = 80; }
    }
  }
}
