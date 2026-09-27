export const MAX_IMAGES = 8;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

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
  const form = new FormData();
  form.append("file", file);
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
