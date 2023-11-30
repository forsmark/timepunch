import clsx from "clsx";
import { ReactNode } from "react";

type Props = {
  className?: string;
  children: ReactNode;
};

const Card = ({ className, children }: Props) => {
  return (
    <div
      className={clsx(
        "block max-w-sm p-6 border rounded-lg shadow bg-slate-800 border-slate-700",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
