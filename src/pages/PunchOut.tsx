import { useEffect, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

import Card from "../components/Card";
import { updatePunchedIn, usePunchStore } from "../utils/punches";
import Button from "../components/Button";

const PunchOut = () => {
  const { latestPunchInTime, latestPunchOutTime } = usePunchStore();

  useEffect(() => {
    void updatePunchedIn();
  }, []);

  const timeWorked = useMemo(() => {
    if (!latestPunchInTime || !latestPunchOutTime) return null;

    dayjs.extend(duration);
    dayjs.extend(relativeTime);

    const lastPunchIn = dayjs(latestPunchInTime);
    const lastPunchOut = dayjs(latestPunchOutTime);

    const differenceInMs = lastPunchOut.diff(lastPunchIn);

    return dayjs.duration(differenceInMs, "milliseconds").humanize();
  }, [latestPunchInTime, latestPunchOutTime]);

  return (
    <Card className="flex flex-col items-center gap-4">
      <h3>You worked {timeWorked} today.</h3>
      <Link to={"/"}>
        <Button>Go Back</Button>
      </Link>
    </Card>
  );
};

export default PunchOut;
