import clsx from "clsx";

type Props = {
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const Button = ({ className, disabled, onClick, children }: Props) => {
  return (
    <button
      className={clsx(
        "text-white bg-gradient-to-r  focus:ring-4 focus:outline-none focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-transform",
        {
          "from-purple-600 to-pink-600 hover:scale-105": !disabled,
          "cursor-not-allowed text-gray-500 from-purple-400 to-pink-400 ":
            !!disabled,
        },
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
