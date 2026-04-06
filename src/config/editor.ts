import type { IconSvgElement } from "@hugeicons/react";
import type { Editor } from "@tiptap/react";
import { useCallback } from "react";
import {
  Delete03Icon,
  DeleteColumnIcon,
  DeleteRowIcon,
  Heading01Icon,
  Heading02Icon,
  Heading03Icon,
  Heading04Icon,
  Heading05Icon,
  Heading06Icon,
  HighlighterIcon,
  ImageAdd02Icon,
  InsertColumnLeftIcon,
  InsertColumnRightIcon,
  InsertRowDownIcon,
  InsertRowUpIcon,
  LayoutTable01Icon,
  LeftToRightBlockQuoteIcon,
  LeftToRightListBulletIcon,
  LeftToRightListNumberIcon,
  Link01Icon,
  ParagraphIcon,
  Redo03Icon,
  TextAlignCenterIcon,
  TextAlignJustifyCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  TextBoldIcon,
  TextIcon,
  TextItalicIcon,
  TextStrikethroughIcon,
  TextSubscriptIcon,
  TextSuperscriptIcon,
  TextUnderlineIcon,
  Undo03Icon,
} from "@hugeicons/core-free-icons";

interface GroupConfig {
  label: string;
  buttons: ButtonConfig[];
}

interface ButtonConfig {
  label: string;
  icon: IconSvgElement;
  onClick: () => void;
  disabled?: boolean;
  isActive?: boolean;
}

interface ContextAction {
  label: string;
  icon: IconSvgElement;
  onClick: () => void;
  danger?: boolean;
}

export const TABLE_CONTEXT_ACTIONS = (editor: Editor): ContextAction[][] => [
  [
    {
      label: "Insert Column Before",
      icon: InsertColumnLeftIcon,
      onClick: () => editor.chain().focus().addColumnBefore().run(),
    },
    {
      label: "Insert Column After",
      icon: InsertColumnRightIcon,
      onClick: () => editor.chain().focus().addColumnAfter().run(),
    },
    {
      label: "Insert Row Above",
      icon: InsertRowUpIcon,
      onClick: () => editor.chain().focus().addRowBefore().run(),
    },
    {
      label: "Insert Row Below",
      icon: InsertRowDownIcon,
      onClick: () => editor.chain().focus().addRowAfter().run(),
    },
  ],
  [
    {
      label: "Delete Column",
      icon: DeleteColumnIcon,
      onClick: () => editor.chain().focus().deleteColumn().run(),
      danger: true,
    },
    {
      label: "Delete Row",
      icon: DeleteRowIcon,
      onClick: () => editor.chain().focus().deleteRow().run(),
      danger: true,
    },
    {
      label: "Delete Table",
      icon: Delete03Icon,
      onClick: () => editor.chain().focus().deleteTable().run(),
      danger: true,
    },
  ],
];

export const EDITOR_BUTTON_GROUPS = (editor: Editor): GroupConfig[] => {
  const setLink = useCallback(() => {
    if (!editor) return;
    const url = editor.getAttributes("link").href;
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    try {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    } catch (error) {
      console.error({ error });
    }
  }, [editor]);

  const setImage = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const src = ev.target?.result as string;
        if (src) editor.chain().focus().setImage({ src }).run();
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }, [editor]);

  return [
    {
      label: "history",
      buttons: [
        {
          label: "Undo",
          icon: Undo03Icon,
          onClick: () => editor.chain().focus().undo().run(),
          disabled: !editor.can().chain().focus().undo().run(),
        },
        {
          label: "Redo",
          icon: Redo03Icon,
          onClick: () => editor.chain().focus().redo().run(),
          disabled: !editor.can().chain().focus().redo().run(),
        },
        {
          label: "Clear Formatting",
          icon: TextIcon,
          onClick: () => editor.chain().focus().clearContent().run(),
        },
      ],
    },
    {
      label: "headings",
      buttons: [
        {
          label: "Heading 1",
          icon: Heading01Icon,
          onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
          isActive: editor.isActive("heading", { level: 1 }),
        },
        {
          label: "Heading 2",
          icon: Heading02Icon,
          onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
          isActive: editor.isActive("heading", { level: 2 }),
        },
        {
          label: "Heading 3",
          icon: Heading03Icon,
          onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
          isActive: editor.isActive("heading", { level: 3 }),
        },
        {
          label: "Heading 4",
          icon: Heading04Icon,
          onClick: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
          isActive: editor.isActive("heading", { level: 4 }),
        },
        {
          label: "Heading 5",
          icon: Heading05Icon,
          onClick: () => editor.chain().focus().toggleHeading({ level: 5 }).run(),
          isActive: editor.isActive("heading", { level: 5 }),
        },
        {
          label: "Heading 6",
          icon: Heading06Icon,
          onClick: () => editor.chain().focus().toggleHeading({ level: 6 }).run(),
          isActive: editor.isActive("heading", { level: 6 }),
        },
        {
          label: "Paragraph",
          icon: ParagraphIcon,
          onClick: () => editor.chain().focus().setParagraph().run(),
          isActive: editor.isActive("paragraph"),
        },
      ],
    },
    {
      label: "text_style",
      buttons: [
        {
          label: "Bold",
          icon: TextBoldIcon,
          onClick: () => editor.chain().focus().toggleBold().run(),
          isActive: editor.isActive("bold"),
          disabled: !editor.can().chain().focus().toggleBold().run(),
        },
        {
          label: "Italic",
          icon: TextItalicIcon,
          onClick: () => editor.chain().focus().toggleItalic().run(),
          isActive: editor.isActive("italic"),
          disabled: !editor.can().chain().focus().toggleItalic().run(),
        },
        {
          label: "Underline",
          icon: TextUnderlineIcon,
          onClick: () => editor.chain().focus().toggleUnderline().run(),
          isActive: editor.isActive("underline"),
          disabled: !editor.can().chain().focus().toggleUnderline().run(),
        },
        {
          label: "Strikethrough",
          icon: TextStrikethroughIcon,
          onClick: () => editor.chain().focus().toggleStrike().run(),
          isActive: editor.isActive("strike"),
          disabled: !editor.can().chain().focus().toggleStrike().run(),
        },
        {
          label: "Highlight",
          icon: HighlighterIcon,
          onClick: () => editor.chain().focus().toggleHighlight({ color: "#baba06" }).run(),
          isActive: editor.isActive("highlight"),
        },
        {
          label: "Subscript",
          icon: TextSubscriptIcon,
          onClick: () => editor.chain().focus().toggleSubscript().run(),
          isActive: editor.isActive("subscript"),
        },
        {
          label: "Superscript",
          icon: TextSuperscriptIcon,
          onClick: () => editor.chain().focus().toggleSuperscript().run(),
          isActive: editor.isActive("superscript"),
        },
      ],
    },
    {
      label: "insert",
      buttons: [
        {
          label: "Image",
          icon: ImageAdd02Icon,
          onClick: setImage,
          isActive: editor.isActive("image"),
        },
        {
          label: "Link",
          icon: Link01Icon,
          onClick: () => setLink(),
          isActive: editor.isActive("link"),
          disabled: editor.isActive("link"),
        },
      ],
    },
    {
      label: "blocks",
      buttons: [
        {
          label: "Blockquote",
          icon: LeftToRightBlockQuoteIcon,
          onClick: () => editor.chain().focus().toggleBlockquote().run(),
          isActive: editor.isActive("blockquote"),
        },
        {
          label: "Bullet List",
          icon: LeftToRightListBulletIcon,
          onClick: () => editor.chain().focus().toggleBulletList().run(),
          isActive: editor.isActive("bulletList"),
        },
        {
          label: "Ordered List",
          icon: LeftToRightListNumberIcon,
          onClick: () => editor.chain().focus().toggleOrderedList().run(),
          isActive: editor.isActive("orderedList"),
        },
      ],
    },
    {
      label: "table",
      buttons: [
        {
          label: "Table",
          icon: LayoutTable01Icon,
          onClick: () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
        },
        {
          label: "Column Left",
          icon: InsertColumnLeftIcon,
          onClick: () => editor.chain().focus().addColumnBefore().run(),
        },
        {
          label: "Column Right",
          icon: InsertColumnRightIcon,
          onClick: () => editor.chain().focus().addColumnAfter().run(),
        },
        {
          label: "Delete Column",
          icon: DeleteColumnIcon,
          onClick: () => editor.chain().focus().deleteColumn().run(),
        },
        {
          label: "Row Above",
          icon: InsertRowUpIcon,
          onClick: () => editor.chain().focus().addRowBefore().run(),
        },
        {
          label: "Row Below",
          icon: InsertRowDownIcon,
          onClick: () => editor.chain().focus().addRowAfter().run(),
        },
        {
          label: "Delete Below",
          icon: DeleteRowIcon,
          onClick: () => editor.chain().focus().deleteRow().run(),
        },
      ],
    },
    {
      label: "alignment",
      buttons: [
        {
          label: "Text Align Left",
          icon: TextAlignLeftIcon,
          onClick: () => editor.chain().focus().toggleTextAlign("left").run(),
          isActive: editor.isActive({ textAlign: "left" }),
        },
        {
          label: "Text Align Center",
          icon: TextAlignCenterIcon,
          onClick: () => editor.chain().focus().toggleTextAlign("center").run(),
          isActive: editor.isActive({ textAlign: "center" }),
        },
        {
          label: "Text Align Justify",
          icon: TextAlignJustifyCenterIcon,
          onClick: () => editor.chain().focus().toggleTextAlign("justify").run(),
          isActive: editor.isActive({ textAlign: "justify" }),
        },
        {
          label: "Text Align Right",
          icon: TextAlignRightIcon,
          onClick: () => editor.chain().focus().toggleTextAlign("right").run(),
          isActive: editor.isActive({ textAlign: "right" }),
        },
      ],
    },
  ];
};
