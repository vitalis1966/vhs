import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useCallback, useEffect } from "react";
import { s as supabase } from "./client-B5yO-kwf.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-B9jBE8y5.js";
import { b as buttonVariants, B as Button } from "./button-DnzOxZqg.js";
import { L as Label, I as Input } from "./label-H2YDHQ-y.js";
import { T as Textarea } from "./textarea-B6XBNdk0.js";
import { ChevronRight, ChevronLeft, CheckCircle, Calendar as Calendar$1, Loader2, AlertTriangle } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { c as cn } from "./utils-H80jjgLf.js";
import { u as useToast } from "./use-toast-B2rUv-Rg.js";
function Calendar({ className, classNames, showOutsideDays = true, ...props }) {
  return /* @__PURE__ */ jsx(
    DayPicker,
    {
      showOutsideDays,
      className: cn("p-3", className),
      classNames: {
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(buttonVariants({ variant: "ghost" }), "h-9 w-9 p-0 font-normal aria-selected:opacity-100"),
        day_range_end: "day-range-end",
        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames
      },
      components: {
        IconLeft: ({ ..._props }) => /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" }),
        IconRight: ({ ..._props }) => /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
      },
      ...props
    }
  );
}
Calendar.displayName = "Calendar";
function BookingWidget({ sessionId, bookedBy }) {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(void 0);
  const [daySlots, setDaySlots] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [booked, setBooked] = useState(null);
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  const endOfYear = new Date(today.getFullYear(), 11, 31);
  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };
  const fetchSlotsForDate = useCallback(async (date) => {
    setLoading(true);
    setDaySlots(null);
    setSelectedTime(null);
    try {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      const dateStr = `${y}-${m}-${d}`;
      const { data, error: fnError } = await supabase.functions.invoke("get-booking-slots", {
        body: { date: dateStr }
      });
      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);
      const days = data || [];
      setDaySlots(days.length > 0 ? days[0] : { date: dateStr, dayLabel: date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }), slots: [] });
    } catch (err) {
      toast({ title: "Error", description: err.message || "Failed to load slots.", variant: "destructive" });
      setDaySlots(null);
    }
    setLoading(false);
  }, [toast]);
  useEffect(() => {
    if (selectedDate) {
      fetchSlotsForDate(selectedDate);
    }
  }, [selectedDate, fetchSlotsForDate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTime || !daySlots) return;
    setSubmitting(true);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("create-booking", {
        body: {
          name,
          email,
          organization,
          date: daySlots.date,
          time: selectedTime,
          note
        }
      });
      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);
      setBooked({ date: daySlots.dayLabel, time: selectedTime });
      if (sessionId) {
        await supabase.from("assessment_sessions").update({ meeting_booked: true, meeting_booked_by: bookedBy || "client" }).eq("id", sessionId);
      }
      toast({ title: "Call Booked", description: `Your discovery call is confirmed for ${daySlots.dayLabel} at ${formatTime(selectedTime)}.` });
    } catch (err) {
      toast({ title: "Booking Failed", description: err.message || "Could not complete booking. Please try again.", variant: "destructive" });
    }
    setSubmitting(false);
  };
  const formatTime = (t) => {
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
  };
  if (booked) {
    return /* @__PURE__ */ jsx(Card, { className: "border border-border/40 shadow-soft", children: /* @__PURE__ */ jsxs(CardContent, { className: "py-10 text-center space-y-4", children: [
      /* @__PURE__ */ jsx(CheckCircle, { className: "h-10 w-10 text-accent mx-auto" }),
      /* @__PURE__ */ jsx("h4", { className: "font-display text-lg font-bold text-foreground", children: "Discovery Call Confirmed" }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
        booked.date,
        " at ",
        formatTime(booked.time),
        " (MT)"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "You'll receive a confirmation email with meeting details shortly." })
    ] }) });
  }
  const availableSlots = daySlots?.slots.filter((s) => s.available) || [];
  return /* @__PURE__ */ jsxs(Card, { className: "border border-border/40 shadow-soft overflow-hidden", children: [
    /* @__PURE__ */ jsx(CardHeader, { className: "border-b border-border/40 bg-secondary/10", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("span", { className: "text-accent", children: /* @__PURE__ */ jsx(Calendar$1, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsx(CardTitle, { className: "font-display text-lg font-bold text-foreground", children: "Book a Discovery Call" })
    ] }) }),
    /* @__PURE__ */ jsxs(CardContent, { className: "p-6 space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3", children: "Select a Date" }),
        /* @__PURE__ */ jsx(
          Calendar,
          {
            mode: "single",
            numberOfMonths: 2,
            selected: selectedDate,
            onSelect: setSelectedDate,
            disabled: (date) => {
              const d = new Date(date);
              d.setHours(0, 0, 0, 0);
              return d < today || d > endOfYear || isWeekend(d);
            },
            fromDate: today,
            toDate: endOfYear,
            className: cn("rounded-md border pointer-events-auto w-full")
          }
        )
      ] }),
      selectedDate && /* @__PURE__ */ jsx("div", { children: loading ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-3 py-6", children: [
        /* @__PURE__ */ jsx(Loader2, { className: "h-5 w-5 animate-spin text-accent" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Loading available times…" })
      ] }) : daySlots ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3", children: [
          "Available Times — ",
          daySlots.dayLabel
        ] }),
        availableSlots.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-4 space-y-2", children: [
          /* @__PURE__ */ jsx(AlertTriangle, { className: "h-6 w-6 text-muted-foreground mx-auto" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "No available slots on this day." })
        ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2", children: daySlots.slots.map((slot) => /* @__PURE__ */ jsx(
          Button,
          {
            variant: selectedTime === slot.time ? "default" : "outline",
            size: "sm",
            disabled: !slot.available,
            className: `text-xs ${!slot.available ? "line-through opacity-40 cursor-not-allowed" : ""}`,
            onClick: () => setSelectedTime(slot.time),
            children: formatTime(slot.time)
          },
          slot.time
        )) })
      ] }) : null }),
      selectedTime && daySlots && /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 border-t border-border/40 pt-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx(Label, { className: "text-xs font-medium text-muted-foreground", children: "Full Name *" }),
            /* @__PURE__ */ jsx(Input, { value: name, onChange: (e) => setName(e.target.value), required: true, placeholder: "Dr. Jane Smith" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx(Label, { className: "text-xs font-medium text-muted-foreground", children: "Email *" }),
            /* @__PURE__ */ jsx(Input, { type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, placeholder: "jane@clinic.com" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx(Label, { className: "text-xs font-medium text-muted-foreground", children: "Organization" }),
          /* @__PURE__ */ jsx(Input, { value: organization, onChange: (e) => setOrganization(e.target.value), placeholder: "Clinic or practice name" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx(Label, { className: "text-xs font-medium text-muted-foreground", children: "Note (optional)" }),
          /* @__PURE__ */ jsx(Textarea, { value: note, onChange: (e) => setNote(e.target.value), rows: 2, placeholder: "Anything we should know before the call?" })
        ] }),
        /* @__PURE__ */ jsxs(Button, { type: "submit", disabled: submitting || !name || !email, className: "w-full", children: [
          submitting ? /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Calendar$1, { className: "mr-2 h-4 w-4" }),
          submitting ? "Booking…" : `Confirm — ${daySlots.dayLabel} at ${formatTime(selectedTime)}`
        ] })
      ] })
    ] })
  ] });
}
export {
  BookingWidget as B
};
