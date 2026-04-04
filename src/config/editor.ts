import type { IconSvgElement } from "@hugeicons/react";
import type { Editor } from "@tiptap/react";
import { useCallback } from "react";
import {
  ColumnInsertIcon,
  ImageAdd02Icon,
  Heading01Icon,
  Heading02Icon,
  Heading03Icon,
  Heading04Icon,
  Heading05Icon,
  Heading06Icon,
  HighlighterIcon,
  LeftToRightBlockQuoteIcon,
  LeftToRightListBulletIcon,
  LeftToRightListNumberIcon,
  Link01Icon,
  Redo03Icon,
  RowInsertIcon,
  TextBoldIcon,
  TextIcon,
  TextItalicIcon,
  TextStrikethroughIcon,
  TextSubscriptIcon,
  TextSuperscriptIcon,
  TextUnderlineIcon,
  Undo03Icon,
  LayoutTable01Icon,
} from "@hugeicons/core-free-icons";

interface ButtonConfig {
  label: string;
  icon: IconSvgElement;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

export const EDITOR_BUTTONS = (editor: Editor): ButtonConfig[] => {
  const setLink = useCallback(() => {
    if (!editor) return;
    const url = editor.getAttributes("link").href;
    if (url === null) {
      return;
    } else if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
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
        if (src) {
          editor.chain().focus().setImage({ src }).run();
        }
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }, [editor]);

  return [
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
      label: "Heading 1",
      icon: Heading01Icon,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      label: "Heading 2",
      icon: Heading02Icon,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: "Heading 3",
      icon: Heading03Icon,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      label: "Heading 4",
      icon: Heading04Icon,
      onClick: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
    },
    {
      label: "Heading 5",
      icon: Heading05Icon,
      onClick: () => editor.chain().focus().toggleHeading({ level: 5 }).run(),
    },
    {
      label: "Heading 6",
      icon: Heading06Icon,
      onClick: () => editor.chain().focus().toggleHeading({ level: 6 }).run(),
    },
    {
      label: "Paragraph",
      icon: TextIcon,
      onClick: () => editor.chain().focus().setParagraph().run(),
    },
    {
      label: "Bold",
      icon: TextBoldIcon,
      onClick: () => editor.chain().focus().toggleBold().run(),
      disabled: !editor.can().chain().focus().toggleBold().run(),
    },
    {
      label: "Italic",
      icon: TextItalicIcon,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      disabled: !editor.can().chain().focus().toggleItalic().run(),
    },
    {
      label: "Underline",
      icon: TextUnderlineIcon,
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      disabled: !editor.can().chain().focus().toggleUnderline().run(),
    },
    {
      label: "Strikethrough",
      icon: TextStrikethroughIcon,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      disabled: !editor.can().chain().focus().toggleStrike().run(),
    },
    {
      label: "Highlight",
      icon: HighlighterIcon,
      onClick: () => editor.chain().focus().toggleHighlight({ color: "#baba06" }).run(),
    },
    {
      label: "Subscript",
      icon: TextSubscriptIcon,
      onClick: () => editor.chain().focus().toggleSubscript().run(),
    },
    {
      label: "Superscript",
      icon: TextSuperscriptIcon,
      onClick: () => editor.chain().focus().toggleSuperscript().run(),
    },
    {
      label: "Image",
      icon: ImageAdd02Icon,
      onClick: setImage,
    },
    {
      label: "Link",
      icon: Link01Icon,
      onClick: () => setLink(),
      disabled: editor.isActive("link"),
    },
    {
      label: "Blockquote",
      icon: LeftToRightBlockQuoteIcon,
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      label: "Bullet List",
      icon: LeftToRightListBulletIcon,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      label: "Ordered List",
      icon: LeftToRightListNumberIcon,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      label: "Table",
      icon: LayoutTable01Icon,
      onClick: () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
    },
    {
      label: "Column Left",
      icon: ColumnInsertIcon,
      onClick: () => editor.chain().focus().addColumnBefore().run(),
    },
    {
      label: "Column Right",
      icon: ColumnInsertIcon,
      onClick: () => editor.chain().focus().addColumnAfter().run(),
    },
    {
      label: "Row Above",
      icon: RowInsertIcon,
      onClick: () => editor.chain().focus().addRowBefore().run(),
    },
    {
      label: "Row Below",
      icon: RowInsertIcon,
      onClick: () => editor.chain().focus().addRowAfter().run(),
    },
    // {
    //   label: "Horizontal Rule",
    //   icon: HorizontalResizeIcon,
    //   onClick: () => editor.chain().focus().setHorizontalRule().run(),
    // },
  ];
};
