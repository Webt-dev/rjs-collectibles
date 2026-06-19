import React, { useState } from "react";

export default function ProductImage({
  product,
  className = "",
  wrapperClassName = "",
}) {
  const [failed, setFailed] = useState(false);

  const imageUrl =
    product?.image ||
    product?.thumb ||
    product?.featuredImage ||
    product?.images?.[0] ||
    product?.imageGallery?.[0] ||
    "";

  if (!imageUrl || failed) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 ${wrapperClassName}`}
      >
        <span className="text-[10px] uppercase tracking-widest text-zinc-400">
          No Shopify image
        </span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={product?.name || product?.title || "Shopify product"}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      draggable="false"
    />
  );
}