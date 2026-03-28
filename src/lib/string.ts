import DOMPurify from "isomorphic-dompurify";

interface SanitizeOptions {
  ALLOWED_TAGS?: string[];
  ALLOWED_ATTR?: string[];
  ALLOW_DATA_ATTR?: boolean;
  USE_PROFILES?: {
    html?: boolean;
    svg?: boolean;
    svgFilters?: boolean;
  };
}

const defaultOptions: SanitizeOptions = {
  ALLOWED_TAGS: [
    "p",
    "div",
    "span",
    "br",
    "hr",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "b",
    "strong",
    "i",
    "em",
    "u",
    "strike",
    "sub",
    "sup",
    "ul",
    "ol",
    "li",
    "table",
    "thead",
    "tbody",
    "tr",
    "td",
    "th",
    "blockquote",
    "pre",
    "code",
  ],
  ALLOWED_ATTR: ["id", "class", "style", "align", "dir", "colspan", "rowspan", "aria-label", "role"],
  ALLOW_DATA_ATTR: true,
  USE_PROFILES: {
    html: true,
    svg: false,
    svgFilters: false,
  },
};

export const sanitizeHtml = (html: string | undefined | null, options: SanitizeOptions = defaultOptions) => {
  if (!html) return "";

  try {
    const sanitized = DOMPurify.sanitize(html, {
      ...options,
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: false,
      RETURN_TRUSTED_TYPE: true,
      SANITIZE_DOM: true,
    }).toString();

    const parser = new DOMParser();
    const doc = parser.parseFromString(sanitized, "text/html");

    const removeEmptyElements = (node: Node) => {
      const children = Array.from(node.childNodes);
      children.forEach((child) => {
        if (child.nodeType === Node.ELEMENT_NODE) {
          removeEmptyElements(child);

          const element = child as HTMLElement;
          const tagName = element.tagName.toLowerCase();

          if (
            tagName !== "br" &&
            tagName !== "hr" &&
            !element.textContent?.trim() &&
            !element.querySelector("img, br, hr")
          ) {
            element.remove();
          }
        }
      });
    };

    removeEmptyElements(doc.body);

    const normalizeWhitespace = (node: Node) => {
      const children = Array.from(node.childNodes);

      children.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          child.textContent = child.textContent?.replace(/\s+/g, " ").trim() ?? "";
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          normalizeWhitespace(child);
        }
      });
    };

    normalizeWhitespace(doc.body);

    const links = doc.querySelectorAll("a");
    links.forEach((link) => {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });

    return doc.body.innerHTML;
  } catch (error) {
    console.error("Error sanitizing HTML:", error);
    return "";
  }
};

export const capitalize = (str?: string) => {
  if (!str) return "";
  if (str.length === 1) return str.toUpperCase();
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const fromKebabCase = (str?: string) => {
  if (!str) return "";
  return str.replace(/-/g, " ");
};

export const fromPascalCase = (str?: string) => {
  if (!str) return "";
  return str.replace(/([a-z])([A-Z])/g, "$1 $2");
};

export const fromCamelCase = (str?: string) => {
  if (!str) return "";
  return str.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
};

export const fromSnakeCase = (str?: string) => {
  if (!str) return "";
  return str.replace(/_/g, " ");
};

export const toKebabCase = (str?: string) => {
  if (!str) return "";
  return str.toLowerCase().replace(/ /g, "-");
};

export const toPascalCase = (str?: string) => {
  if (!str) return "";
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/ /g, "")
    .replace(/^./, (str) => str.toUpperCase());
};

export const toCamelCase = (str?: string) => {
  if (!str) return "";
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/ /g, "")
    .replace(/^./, (str) => str.toLowerCase());
};

export const toSnakeCase = (str?: string) => {
  if (!str) return "";
  return str.toLowerCase().replace(/ /g, "_");
};

export const getContrastColor = (color: string) => {
  const hex = color.replace("#", "");
  const r = Number.parseInt(hex.substring(0, 2), 16);
  const g = Number.parseInt(hex.substring(2, 4), 16);
  const b = Number.parseInt(hex.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "black" : "white";
};

export const maskString = (value: string, length = 4, replacer = "*") => {
  if (!value) return "";

  if (length <= 0) return replacer.repeat(value.length);
  if (length >= value.length) return value;

  const visiblePortion = value.slice(-length);
  const maskedPortion = replacer.repeat(value.length - length);

  return maskedPortion + visiblePortion;
};
