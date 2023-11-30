import React from "react";
import clsx from "clsx";

import Button from "./Button";

type Props = {
  toggled: boolean;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
};

const ToggableButton = ({ children, toggled, disabled, onClick }: Props) => {
  return (
    <Button
      className={clsx({
        "opacity-100 grayscale-0": toggled,
        "grayscale opacity-80": !toggled,
      })}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
};

export default ToggableButton;
