import Image, { type ImageProps } from "next/image";
import { imageSource } from "@/lib/imageSource";

type Props = Omit<ImageProps, "src" | "unoptimized"> & { src?: string };

export default function SiteImage({ src, alt, ...props }: Props) {
  return <Image {...props} {...imageSource(src)} alt={alt} />;
}
