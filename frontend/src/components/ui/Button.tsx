import { ButtonHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    // Organic / Wellness Theme Styles
    const baseStyles =
      "inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95 tracking-wide";

    const variants = {
      // Olive Green Primary
      primary:
        "bg-[#566452] text-white hover:bg-[#455242] shadow-lg shadow-[#566452]/20 focus:ring-[#566452]",
      // Sand/Cream Secondary
      secondary:
        "bg-[#F2EFE9] text-[#566452] hover:bg-[#E6E2D8] focus:ring-[#C0A062]",
      // Gold/Earth Outline
      outline:
        "border-2 border-[#566452] bg-transparent hover:bg-[#566452] text-[#566452] hover:text-white focus:ring-[#566452]",
      // Soft Ghost
      ghost:
        "bg-transparent hover:bg-[#F2EFE9] text-[#566452] focus:ring-[#566452]",
      // Muted Red
      danger:
        "bg-red-700 text-white hover:bg-red-800 shadow-md focus:ring-red-700",
    };

    const sizes = {
      sm: "h-9 px-4 text-xs uppercase tracking-wider",
      md: "h-12 px-8 text-sm uppercase tracking-wider",
      lg: "h-14 px-10 text-base uppercase tracking-wider",
    };

    return (
      <button
        ref={ref}
        className={twMerge(
          clsx(baseStyles, variants[variant], sizes[size], className),
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
