import React from "react";
import { cn } from "../lib/utils";

export const Button = ({
  className,
  variant = "primary",
  size = "md",
  isLoading,
  children,
  ...props
}: any) => {
  const variants: any = {
    primary: "orange-gradient-bg text-white orange-glow hover:opacity-90 active:scale-95 shadow-lg shadow-orange-500/20",
    secondary: "bg-white/5 backdrop-blur-lg border border-white/10 text-white hover:bg-white/10",
    outline: "border border-orange-500/30 text-orange-500 hover:bg-orange-500/10 backdrop-blur-md",
    ghost: "text-white/70 hover:text-white hover:bg-white/5",
  };

  const sizes: any = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-2.5",
    lg: "px-8 py-3.5 text-lg font-semibold",
  };

  return (
    <button
      className={cn(
        "relative flex items-center justify-center rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Please wait...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export const Input = ({ label, error, className, ...props }: any) => {
  return (
    <div className="space-y-1.5 w-full">
      <div className="relative group">
        <input
          className={cn(
            "peer w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none transition-all focus:border-orange-500/50 focus:bg-orange-500/5 placeholder-transparent",
            error && "border-red-500/50 focus:border-red-500/50",
            className
          )}
          {...props}
        />
        <label
          className={cn(
            "absolute left-4 -top-2.5 text-xs text-orange-500 bg-black/50 backdrop-blur-sm rounded px-1 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-white/40 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-orange-500 peer-focus:bg-black/50",
            error && "text-red-400"
          )}
        >
          {label}
        </label>
      </div>
      {error && <p className="text-xs text-red-400 ml-1">{error}</p>}
    </div>
  );
};
