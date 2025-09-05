import React from "react";
import { Progress } from "../ui/progress";

const DayTracker = ({ startDate, targetDays }) => {
  

  const today = new Date();
  const start = new Date(startDate);
  const diffInTime = today - start;
  const daysElapsed = Math.floor(diffInTime / (1000 * 3600 * 24));

  const progressPercent = Math.min(100, (daysElapsed / targetDays) * 100);

  return (
    <div className="mt-6 w-full max-w-md mx-auto text-center">
      <p className="text-lg font-semibold mb-2">
        Day {daysElapsed} of {targetDays}
      </p>
      <p>Hello?</p>
      <Progress value={progressPercent} className="h-4" />
    </div>
  );
};

export default DayTracker;
