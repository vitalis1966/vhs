import { Node, mergeAttributes } from "@tiptap/core";
import { TAG_LABELS } from "./templateTags";

// Inline atom node that represents {{tag_key}} placeholders.
// - In the editor: rendered as a styled pill via a NodeView so it shows the
//   friendly label and is treated as a single uneditable unit.
// - On serialization (renderHTML / getHTML): outputs a <span data-tag="…">{{tag_key}}</span>
//   so the raw HTML retains the canonical placeholder text. This lets the
//   substitute() helper find and replace placeholders without needing to know
//   anything about the editor markup.
export const TagPill = Node.create({
  name: "tagPill",
  group: "inline",
  inline: true,
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      tag: { default: "" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-tag]",
        getAttrs: (el) => {
          const tag = (el as HTMLElement).getAttribute("data-tag") || "";
          return tag ? { tag } : false;
        },
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const tag = String(node.attrs.tag || "");
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "data-tag": tag,
        class:
          "inline-flex items-center rounded-md bg-accent/15 text-accent border border-accent/30 px-1.5 py-0.5 text-xs font-medium align-baseline",
      }),
      `{{${tag}}}`,
    ];
  },

  renderText({ node }) {
    return `{{${node.attrs.tag}}}`;
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement("span");
      const tag = String(node.attrs.tag || "");
      const label = TAG_LABELS[tag] ?? tag;
      dom.setAttribute("data-tag", tag);
      dom.contentEditable = "false";
      dom.className =
        "inline-flex items-center rounded-md bg-accent/15 text-accent border border-accent/30 px-1.5 py-0.5 text-xs font-medium align-baseline cursor-default select-none mx-0.5";
      dom.textContent = label;
      return { dom };
    };
  },
});

export default TagPill;
