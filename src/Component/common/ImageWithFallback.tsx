import React from "react";

interface ImgWithFallbackProps {
  src: string;
  fallback: string;
  alt: string;
  [key: string]: any;
}

const ImgWithFallback: React.FC<ImgWithFallbackProps> = ({
  src,
  fallback,
  alt,
  ...delegated
}) => {
  return (
    <picture>
      <source srcSet={src} type="image/webp" />
      <img src={fallback} alt={alt} {...delegated} />
    </picture>
  );
};

export default ImgWithFallback;
