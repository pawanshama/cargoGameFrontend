import React, { useState } from "react";

interface ImgWithFallbackProps {
  src: string;
  fallback: string;
  alt?: string;
  className?: string;
  loading?: "lazy" | "eager";
}

const ImgWithFallback: React.FC<ImgWithFallbackProps> = ({
  src,
  fallback,
  alt = "",
  className = "",
  loading = "lazy",
}) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <img
      src={imgSrc}
      onError={() => setImgSrc(fallback)}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
    />
  );
};

export default ImgWithFallback;
