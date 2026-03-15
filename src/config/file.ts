export const MIME_TYPES = {
  image: ["image/bmp", "image/gif", "image/jpeg", "image/png", "image/svg+xml", "image/tiff", "image/webp"],
  document: [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
    "text/csv",
  ],
  video: [
    "video/mp4",
    "video/mpeg",
    "video/quicktime",
    "video/x-flv",
    "video/x-matroska",
    "video/x-msvideo",
    "video/webm",
  ],
  audio: ["audio/aac", "audio/flac", "audio/mp4", "audio/mpeg", "audio/ogg", "audio/wav", "audio/webm"],
} as const;

export const EXPECTED_EXTENSIONS = ["ipynb", "csv", "docx", "pdf", "pptx", "txt", "xlsx", "zip"] as const;
