import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import Card from "../components/Card";
import ToggableButton from "../components/ToggableButton";
import Button from "../components/Button";
import { punchIn } from "../utils/punches";

const defaultFormState = {
  sick: false,
  remote: false,
  vacation: false,
};

const PunchIn = () => {
  const [form, setForm] = useState(() => defaultFormState);
  const navigate = useNavigate();

  const handleForm = (key: keyof typeof form) => {
    setForm((prev) => ({ ...defaultFormState, [key]: !prev[key] }));
  };

  const handlePunchIn = () => {
    const goToHome = () => {
      void navigate({ to: "/" });
    };
    void punchIn(form, goToHome);
  };

  return (
    <Card className="flex flex-col gap-4">
      <ToggableButton toggled={form.sick} onClick={() => handleForm("sick")}>
        🤒 Sick
      </ToggableButton>

      <ToggableButton
        toggled={form.remote}
        onClick={() => handleForm("remote")}
      >
        🏡 Remote
      </ToggableButton>

      <ToggableButton
        toggled={form.vacation}
        onClick={() => handleForm("vacation")}
      >
        🌴 Vacation
      </ToggableButton>

      <Button onClick={handlePunchIn}>👊 Punch In</Button>
    </Card>
  );
};

export default PunchIn;
