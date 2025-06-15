import Image from "next/image";
import React from "react";

const Button = ({
  text,
  img,
  className,
  onClick,
  minHeight,
  maxHeight,
  minWidth,
  maxWidth,
  height,
  width,
  disabled = false,
  imgClass,
  loading,
  marginLeft = 0,
  icon,
  iconClass
}) => {
  const buttonStyle = {
    minHeight: minHeight,
    maxHeight: maxHeight,
    minWidth: minWidth,
    maxWidth:maxWidth,
    height: height,
    width: width,
    marginLeft: marginLeft,
  };

  if (loading) {
    disabled = true;
  }

  return (
    <button
      className={className}
      style={buttonStyle}
      onClick={onClick}
      disabled={disabled}
    >
      {loading ? (
        <>
          <span className="rotate-360 me-2">
            <i class="fa-solid fa-spinner"></i>
          </span>
        </>
      ) : (
        <>
          {img && <img src={img} alt="Button Image" className={imgClass} />}
          {icon && <Image src={icon} alt="icon-mm-btn" className={iconClass} />}
          <span>{text}</span>
        </>
      )}
    </button>
  );
};

export default Button;
