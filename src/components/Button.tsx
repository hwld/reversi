import { ButtonHTMLAttributes } from "react";

export const Button: React.VFC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={`block min-w-[100px] border-2 border-stone-700 py-1 px-3 text-lg font-bold  text-stone-900   duration-200
                hover:bg-yellow-300 active:bg-yellow-400 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
