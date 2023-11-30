import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

import Button from "../components/Button";
import Card from "../components/Card";
import { punchOut, updatePunchedIn, usePunchStore } from "../utils/punches";

const Home = () => {
  const navigate = useNavigate();
  const { punchedIn } = usePunchStore();

  useEffect(() => {
    void updatePunchedIn();
  }, []);

  const handlePunch = () => {
    const goToPunchOut = () => {
      void navigate({ to: "/punch/out" });
    };

    if (punchedIn) {
      void punchOut(goToPunchOut);
    } else {
      void navigate({ to: "/punch/in" });
    }
  };

  return (
    <Card className="flex flex-col gap-4">
      <Button onClick={handlePunch}>
        {punchedIn ? "👋 Punch Out" : "👊 Punch In"}
      </Button>
      <Button disabled>📊 Statistics</Button>
      <Button disabled>⚙️ Settings</Button>
    </Card>
  );
};

export default Home;
