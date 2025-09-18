// hooks/useCountdown.ts
import { useEffect, useState } from "react";

export function useCountdown(targetDate: string | Date) {
  const countDownDate = new Date(targetDate).getTime();
  const [timeLeft, setTimeLeft] = useState(countDownDate - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(countDownDate - Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [countDownDate]);

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, expired: timeLeft <= 0 };
}
