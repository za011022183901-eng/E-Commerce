"use client";

import { useEffect, useState, type ImgHTMLAttributes } from "react";

type ProductImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src?: string | null;
};

const fallbackSrc = "/product-placeholder.svg";

export default function ProductImage({ src, onError, ...props }: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  return (
    <img
      {...props}
      src={!src || failed ? fallbackSrc : src}
      onError={(event) => {
        onError?.(event);
        setFailed(true);
      }}
    />
  );
}
