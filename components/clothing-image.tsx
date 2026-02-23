"use client"

import Image, { type ImageProps } from "next/image"

/**
 * Smart image component that handles both local and remote (Cloudinary) images.
 * Local images (starting with /) are served unoptimized.
 * Remote images (Cloudinary) use Next.js image optimization.
 */
export function ClothingImage(props: ImageProps) {
  const isLocal =
    typeof props.src === "string" && props.src.startsWith("/")

  return <Image {...props} unoptimized={isLocal} />
}
