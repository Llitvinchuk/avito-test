import React from "react";
import "./Tag.css";

type TagColor = "green" | "red" | "yellow" | "purple" | "gray";

const Tag: React.FC<{ color?: TagColor; children: React.ReactNode }> = ({
  color = "gray",
  children,
}) => {
  return <span className={`tag tag--${color}`}>{children}</span>;
};

export default Tag;
