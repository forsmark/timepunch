import clsx from "clsx";
import { useId } from "react";

type Props = {
  value: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  enableSubText?: boolean;
  name?: string;
  state?: "success" | "warning" | "error";
  subText?: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
  className?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
};

const TextField = ({
  value,
  label,
  placeholder,
  disabled,
  name,
  type,
  enableSubText,
  state,
  subText,
  className,
  onBlur,
  onChange,
}: Props) => {
  const id = useId();
  return (
    <div>
      {!!label && (
        <label
          className="block mb-2 text-sm font-medium text-white"
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <input
        id={id}
        name={name}
        className={clsx(
          "border text-sm rounded-lg block w-full p-2.5 bg-slate-700  placeholder-slate-400 text-white focus:ring-pink-500 focus:border-pink-500",
          {
            "text-white": !disabled,
            "cursor-not-allowed text-slate-400": disabled,
            "border-slate-600": !state,
            "mb-7": !subText && enableSubText,
            "border-green-400": state === "success",
            "border-red-400": state === "error",
            "border-orange-400": state === "warning",
          },
          className
        )}
        value={value}
        onChange={onChange}
        type={type ?? "text"}
        autoComplete={name}
        placeholder={placeholder}
        onBlur={onBlur}
      />
      {!!subText && (
        <p
          className={clsx("mt-2 text-sm", {
            "text-white": !state,
            "text-green-400": state === "success",
            "text-red-400": state === "error",
            "text-orange-400": state === "warning",
          })}
        >
          {subText}
        </p>
      )}
    </div>
  );
};

export default TextField;
