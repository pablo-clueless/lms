"use client";

import { BulletList, ListItem, OrderedList } from "@tiptap/extension-list";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import { TableCell, TableKit } from "@tiptap/extension-table";
import Placeholder from "@tiptap/extension-placeholder";
import Superscript from "@tiptap/extension-superscript";
import Blockquote from "@tiptap/extension-blockquote";
import Strikethrough from "@tiptap/extension-strike";
import Highlight from "@tiptap/extension-highlight";
import Paragraph from "@tiptap/extension-paragraph";
import Subscript from "@tiptap/extension-subscript";
import Underline from "@tiptap/extension-underline";
import Document from "@tiptap/extension-document";
import { HugeiconsIcon } from "@hugeicons/react";
import Heading from "@tiptap/extension-heading";
import Italic from "@tiptap/extension-italic";
import { UndoRedo } from "@tiptap/extensions";
import Image from "@tiptap/extension-image";
import Bold from "@tiptap/extension-bold";
import Text from "@tiptap/extension-text";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";

import { EDITOR_BUTTONS } from "@/config/editor";
import { Button } from "../ui/button";
import type { Maybe } from "@/types";
import { cn } from "@/lib";

const TopBar = ({ editor }: { editor: Maybe<Editor> }) => {
  if (!editor) return null;

  return (
    <div className="tiptap-btn-container flex flex-wrap items-center gap-x-2 border-b p-1">
      {EDITOR_BUTTONS(editor).map((button) => (
        <Button
          disabled={button.disabled}
          key={button.label}
          onClick={button.onClick}
          size="icon-xs"
          title={button.label}
          type="button"
        >
          <HugeiconsIcon className="size-4" icon={button.icon} />
        </Button>
      ))}
    </div>
  );
};

const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-background-color"),
        renderHTML: (attributes) => {
          return {
            "data-background-color": attributes.backgroundColor,
            style: `background-color: ${attributes.backgroundColor}`,
          };
        },
      },
    };
  },
});

const extensions = [
  Blockquote,
  Bold,
  BulletList,
  CustomTableCell,
  Document,
  Heading,
  Highlight.configure({
    multicolor: true,
  }),
  Image,
  Italic,
  Link.configure({
    openOnClick: true,
    autolink: true,
    defaultProtocol: "https",
    protocols: ["http", "https"],
    isAllowedUri: (url, ctx) => {
      try {
        const parsedUrl = url.includes(":") ? new URL(url) : new URL(`${ctx.defaultProtocol}://${url}`);
        if (!ctx.defaultValidate(parsedUrl.href)) {
          return false;
        }
        const disallowedProtocols = ["ftp", "file", "mailto", "tel"];
        const protocol = parsedUrl.protocol.replace(":", "");

        if (disallowedProtocols.includes(protocol)) {
          return false;
        }
        const allowedProtocols = ctx.protocols.map((p) => (typeof p === "string" ? p : p.scheme));

        if (!allowedProtocols.includes(protocol)) {
          return false;
        }
        const disallowedDomains = ["example-phishing.com", "malicious-site.net"];
        const domain = parsedUrl.hostname;
        if (disallowedDomains.includes(domain)) {
          return false;
        }
        return true;
      } catch {
        return false;
      }
    },
    shouldAutoLink: (url) => {
      try {
        const parsedUrl = url.includes(":") ? new URL(url) : new URL(`https://${url}`);
        const disallowedDomains = [""];
        const domain = parsedUrl.hostname;
        return !disallowedDomains.includes(domain);
      } catch {
        return false;
      }
    },
  }),
  ListItem,
  OrderedList,
  Paragraph,
  Placeholder.configure({
    placeholder: "Start typing here...",
  }),
  Strikethrough,
  Subscript,
  Superscript,
  TableKit.configure({
    table: { resizable: true },
    tableCell: false,
  }),
  Text,
  Underline,
  UndoRedo,
];

interface Props {
  onValueChange: (value: string) => void;
  value: string;
  className?: string;
  editorClassName?: string;
  initialValue?: string;
  editable?: boolean;
}

export const TextEditor = ({ onValueChange, value, className, editable, editorClassName, initialValue }: Props) => {
  const editor = useEditor({
    extensions,
    content: initialValue || value,
    editable,
    onUpdate: ({ editor }) => {
      onValueChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose-sm prose-p:text-sm w-full prose-li:list-disc prose-li:list-outside focus:outline-none min-h-28 pb-2 px-3",
          editorClassName,
          !editable && "cursor-not-allowed bg-gray-100",
        ),
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor) return;

    const div = document.createElement("div");
    div.innerHTML = value;
    const isSame = editor.getHTML() === div.innerHTML;
    if (isSame) {
      return;
    }

    editor.commands.setContent(value, {});
  }, [value, editor]);

  return (
    <div
      className={cn(
        "focus-within:border-primary-500 flex w-full flex-col gap-2 overflow-hidden rounded-md border border-neutral-400 bg-neutral-100 dark:bg-neutral-800",
        className,
        !editable && "bg-gray-50",
      )}
    >
      {editable && <TopBar editor={editor} />}
      <EditorContent editor={editor} className="editor text-foreground h-full overflow-y-auto text-sm" />
    </div>
  );
};
