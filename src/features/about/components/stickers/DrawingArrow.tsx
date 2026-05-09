interface DrawingArrowProps {
  width?: number;
  height?: number;
  className?: string;
}

export function DrawingArrow({
  width = 180,
  height = 90,
  className,
}: DrawingArrowProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 180 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>Arrow drawing for about page</title>
      <path
        d="M150 62C118 70 84 68 54 48C40 39 30 28 22 18"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 18L58 18"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M24 18L40 56"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}
