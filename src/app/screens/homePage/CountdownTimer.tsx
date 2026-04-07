import React, { useEffect, useState } from "react";
import { Box, Container, Stack } from "@mui/material";
import { useGlobals } from "../../hooks/useGlobals";

// Always returns the last second of the current month
// When a new month starts, this auto-resets to the new month's end
function getMonthEndDate(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(): TimeLeft {
  const diff = getMonthEndDate().getTime() - Date.now();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export default function CountdownTimer() {
  const { goldMode } = useGlobals();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const isExpired =
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  return (
    <div className={`countdown-frame ${goldMode ? "gold" : ""}`}>
      <Container>
        <Stack className={"countdown-main"}>
          <Box className={"countdown-label"}>
            {isExpired ? "Sale has ended" : "⚡ Flash Sale — Ends In"}
          </Box>

          {!isExpired && (
            <Stack className={"countdown-blocks"}>
              <Box className={"countdown-block"}>
                <Box className={"countdown-num"}>{pad(timeLeft.days)}</Box>
                <Box className={"countdown-unit"}>Days</Box>
              </Box>
              <Box className={"countdown-sep"}>:</Box>
              <Box className={"countdown-block"}>
                <Box className={"countdown-num"}>{pad(timeLeft.hours)}</Box>
                <Box className={"countdown-unit"}>Hours</Box>
              </Box>
              <Box className={"countdown-sep"}>:</Box>
              <Box className={"countdown-block"}>
                <Box className={"countdown-num"}>{pad(timeLeft.minutes)}</Box>
                <Box className={"countdown-unit"}>Mins</Box>
              </Box>
              <Box className={"countdown-sep"}>:</Box>
              <Box className={"countdown-block"}>
                <Box className={"countdown-num"}>{pad(timeLeft.seconds)}</Box>
                <Box className={"countdown-unit"}>Secs</Box>
              </Box>
            </Stack>
          )}
        </Stack>
      </Container>
    </div>
  );
}
