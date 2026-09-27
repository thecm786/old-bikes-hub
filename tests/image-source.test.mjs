import assert from "node:assert/strict";
import { test } from "node:test";
import { imageSource, IMAGE_PLACEHOLDER } from "../lib/imageSource.ts";

test("local and supported CDN photos use responsive optimization", () => {
  for (const url of ["/logo.png", "https://res.cloudinary.com/demo/image/upload/photo.jpg", "https://images.unsplash.com/photo-test"]) {
    assert.deepEqual(imageSource(url), { src: url, unoptimized: false });
  }
});
test("legacy hosts and signed Firebase URLs remain directly loadable", () => {
  for (const url of ["https://firebasestorage.googleapis.com/v0/b/shop/o/image.jpg?alt=media&token=example", "https://legacy.example/image.jpg", "http://legacy.example/image.jpg", "blob:preview"]) {
    assert.deepEqual(imageSource(url), { src: url, unoptimized: true });
  }
});
test("missing and invalid images use the shipped placeholder", () => {
  for (const url of [undefined, "", " ", "not-a-url", "javascript:alert(1)"]) {
    assert.equal(imageSource(url).src, IMAGE_PLACEHOLDER);
  }
});
