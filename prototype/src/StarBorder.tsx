import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import "./StarBorder.css";

type StarBorderProps = HTMLAttributes<HTMLElement> & {
  as?: "div" | "button";
  color?: string;
  speed?: string;
  thickness?: number;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  children: ReactNode;
};

export default function StarBorder({
  as: Component = "button",
  className = "",
  color = "white",
  speed = "6s",
  thickness = 1,
  backgroundColor = "#000000",
  textColor = "#ffffff",
  borderColor = "#222222",
  children,
  style,
  ...rest
}: StarBorderProps) {
  return (
    <Component
      className={`star-border-container ${className}`.trim()}
      style={{ padding: `${thickness}px 0`, ...style } as CSSProperties}
      {...rest}
    >
      <div
        className="border-gradient-bottom"
        style={{ background: `radial-gradient(circle, ${color}, transparent 10%)`, animationDuration: speed }}
      />
      <div
        className="border-gradient-top"
        style={{ background: `radial-gradient(circle, ${color}, transparent 10%)`, animationDuration: speed }}
      />
      <div className="inner-content" style={{ background: backgroundColor, color: textColor, borderColor }}>
        {children}
      </div>
    </Component>
  );
}
