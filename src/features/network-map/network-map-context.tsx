"use client";

import { EventStatus } from "@prisma/client";
import { useQueryState } from "nuqs";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { getNetworkMapEvents } from "./network-actions";

const NetworkMapContext = createContext<NetworkMapContextType | undefined>(
  undefined
);

type NetworkMapContextType = {
  datetime: Date;
  timelineStart: Date;
  timelineEnd: Date;
  playSpeed: number;
  setPlaySpeed: (speed: number) => void;
  events: Awaited<ReturnType<typeof getNetworkMapEvents>>;
  setDatetime: (date: Date) => void;
  isPlaying: boolean;
  togglePlay: () => void;
  dynamicEvents: Awaited<ReturnType<typeof getNetworkMapEvents>>;
  getDynamicEventsByAsset: (
    assetId: string
  ) => Awaited<ReturnType<typeof getNetworkMapEvents>>;
  getCurrentAssetStatus: (assetId: string) => EventStatus;
};

export function NetworkMapProvider({
  events = [],
  children,
}: {
  events: Awaited<ReturnType<typeof getNetworkMapEvents>>;
  children: React.ReactNode;
}) {
  const [datetime, setDatetime] = useQueryState("datetime", {
    parse: (value) => new Date(value),
    defaultValue: new Date("Tue Nov 27 2024 07:20:00"),
  });
  const [playSpeed, setPlaySpeed] = useQueryState("playSpeed", {
    parse: (value) => parseInt(value),
    defaultValue: 5,
  });
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => {
      if (prev) {
        return false;
      }
      return true;
    });
  }, [datetime, events]);

  useHotkeys("space", () => togglePlay());

  const getDynamicEventsByAsset = useCallback(
    (assetId: string) => {
      return events.filter(
        (event) =>
          event.asset?.id === assetId && new Date(event.createdAt) <= datetime
      );
    },
    [events, datetime]
  );

  const dynamicEvents = useMemo(() => {
    return events.filter((event) => new Date(event.createdAt) <= datetime);
  }, [events, datetime]);

  const getCurrentAssetStatus = useCallback(
    (assetId: string) => {
      return (
        getDynamicEventsByAsset(assetId)
          .filter((e) => e.status != null)
          .at(-1)?.status ?? EventStatus.OKAY
      );
    },
    [getDynamicEventsByAsset]
  );

  const timelineStart = useMemo(() => {
    const start = new Date(events.at(0)?.createdAt ?? new Date());
    start.setHours(0, 0, 0, 0);
    return start;
  }, [events]);

  const timelineEnd = useMemo(() => {
    const end = new Date(events.at(-1)?.createdAt ?? new Date());
    end.setHours(23, 59, 59, 999);
    return end;
  }, [events]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isPlaying) {
      intervalId = setInterval(() => {
        setDatetime((prevDate) => {
          const newDate = new Date(prevDate);
          newDate.setMinutes(newDate.getMinutes() + playSpeed);
          if (timelineEnd && newDate > timelineEnd) {
            setIsPlaying(false);
            return timelineEnd;
          }
          return newDate;
        });
      }, 1000); // Update every second
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying, timelineEnd, playSpeed]);

  return (
    <NetworkMapContext.Provider
      value={{
        datetime,
        timelineStart,
        timelineEnd,
        playSpeed,
        setPlaySpeed,
        events,
        setDatetime,
        isPlaying,
        togglePlay,
        getDynamicEventsByAsset: getDynamicEventsByAsset,
        getCurrentAssetStatus,
        dynamicEvents,
      }}
    >
      {children}
    </NetworkMapContext.Provider>
  );
}

export function useNetworkMap() {
  const context = useContext(NetworkMapContext);
  if (context === undefined) {
    throw new Error("useNetworkMap must be used within a NetworkMapProvider");
  }
  return context;
}
