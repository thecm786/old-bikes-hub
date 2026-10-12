export const MAX_IMAGES = 8;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

// Removes EXIF/IPTC metadata from JPEGs without decoding or recompressing them.
// The visual pixels stay byte-for-byte intact; only camera/GPS metadata is removed.
export async function removeUploadMetadata(file: File): Promise<File> {
  if (file.type !== "image/jpeg") return file;

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) return file;

  const parts: Uint8Array[] = [bytes.slice(0, 2)];
  let cursor = 2;

  while (cursor + 3 < bytes.length && bytes[cursor] === 0xff) {
    const markerStart = cursor;
    while (bytes[cursor] === 0xff) cursor += 1;
    const marker = bytes[cursor++];

    // Image data follows the Start Of Scan marker. Copy it unchanged.
    if (marker === 0xda) {
      parts.push(bytes.slice(markerStart));
      cursor = bytes.length;
      break;
    }

    // Standalone JPEG markers do not have a segment length.
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd9)) {
      parts.push(bytes.slice(markerStart, cursor));
      continue;
    }

    const length = (bytes[cursor] << 8) | bytes[cursor + 1];
    const end = cursor + length;
    if (length < 2 || end > bytes.length) return file;

    // APP1 is EXIF and APP13 is IPTC/Photoshop metadata.
    if (marker !== 0xe1 && marker !== 0xed) {
      parts.push(bytes.slice(markerStart, end));
    }
    cursor = end;
  }

  if (cursor < bytes.length) parts.push(bytes.slice(cursor));
  const cleaned = new Blob(parts as unknown as BlobPart[], { type: file.type });
  return new File([cleaned], file.name, { type: file.type, lastModified: file.lastModified });
}

export function validateImageFiles(files: File[], existingCount = 0) {
  if (existingCount + files.length > MAX_IMAGES) throw new Error(`Upload at most ${MAX_IMAGES} photos.`);
  for (const file of files) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      throw new Error("Choose JPG, PNG or WebP photos.");
    }
    if (!file.size || file.size > MAX_IMAGE_BYTES) throw new Error("Each photo must be between 1 byte and 5 MB.");
  }
}

export async function uploadCloudinaryImage(file: File): Promise<string> {
  validateImageFiles([file]);
  const uploadFile = await removeUploadMetadata(file);
  const form = new FormData();
  form.append("file", uploadFile);
  form.append("upload_preset", "old-bikes-hub");
  const response = await fetch("https://api.cloudinary.com/v1_1/w4eee6vd/image/upload", {
    method: "POST", body: form,
  });
  const data: { secure_url?: unknown } = await response.json();
  if (!response.ok || typeof data.secure_url !== "string" ||
      !data.secure_url.startsWith("https://res.cloudinary.com/w4eee6vd/image/upload/")) {
    throw new Error("Photo upload failed. Please try again.");
  }
  return data.secure_url;
}
