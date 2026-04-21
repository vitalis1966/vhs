const MIME_LABELS: Record<string, string> = {
  "application/pdf": "PDF Document",
  "application/msword": "Microsoft Word Document",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "Microsoft Word Document",
  "application/vnd.ms-excel": "Microsoft Excel Spreadsheet",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "Microsoft Excel Spreadsheet",
  "application/vnd.ms-powerpoint": "Microsoft PowerPoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "Microsoft PowerPoint",
  "text/plain": "Text File",
  "text/csv": "CSV File",
  "application/json": "JSON File",
  "application/zip": "ZIP Archive",
  "application/x-zip-compressed": "ZIP Archive",
  "application/x-rar-compressed": "RAR Archive",
  "image/jpeg": "JPEG Image",
  "image/png": "PNG Image",
  "image/gif": "GIF Image",
  "image/webp": "WebP Image",
  "image/svg+xml": "SVG Image",
  "video/mp4": "MP4 Video",
  "video/quicktime": "QuickTime Video",
  "audio/mpeg": "MP3 Audio",
  "audio/wav": "WAV Audio",
};

export function mimeLabel(mime: string | null | undefined): string {
  if (!mime) return "Unknown";
  if (MIME_LABELS[mime]) return MIME_LABELS[mime];
  // Fallbacks
  if (mime.startsWith("image/")) return "Image";
  if (mime.startsWith("video/")) return "Video";
  if (mime.startsWith("audio/")) return "Audio";
  if (mime.startsWith("text/")) return "Text File";
  return mime;
}
