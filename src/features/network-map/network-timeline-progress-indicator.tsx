"use client";

import { Progress } from "@/components/ui/progress";
import { getEventStatusColor } from "@/types/event-types";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { TimelineFilter } from "./filter-types";
import { PlaybackType, useNetworkMap } from "./network-map-context";

function NetworkTimelineProgressIndicatorComponent() {
  const {
    datetime,
    events,
    timelineFilter,
    setDatetime,
    setPlaybackType,
    timelineStart,
    timelineEnd,
  } = useNetworkMap();

  if (!timelineStart || !timelineEnd) {
    return (
      <div>
        <h2 className="text-sm font-bold pb-5">Timeline</h2>
        <Progress value={0} max={100} />
      </div>
    );
  }

  const progress = Math.max(
    Math.min(
      ((datetime.getTime() - timelineStart.getTime()) /
        (timelineEnd.getTime() - timelineStart.getTime())) *
        100,
      100
    ),
    0
  );

  const filteredEvents = events.filter((event) => {
    if (timelineFilter === TimelineFilter.FOCUSED) {
      return !!event.status;
    }
    return true;
  });

  // Generate array of dates between start and end
  const getDaysBetweenDates = (startDate: Date, endDate: Date) => {
    const days = [];
    const currentDate = new Date(startDate);
    currentDate.setHours(0, 0, 0, 0);
    const lastDate = new Date(endDate);

    while (currentDate <= lastDate) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return days;
  };

  const dayMarkers = getDaysBetweenDates(timelineStart, timelineEnd);

  return (
    <div className="my-5">
      <div className="flex flex-row gap-2 items-center">
        <h2 className="text-sm font-bold">Timeline</h2>
        <p className="font-medium text-sm text-gray-800">
          {datetime.toLocaleString("de-CH")}
        </p>
      </div>
      <div className="flex flex-row justify-between text-sm text-gray-500 mb-2">
        <p className="hover:text-gray-700 transition-colors">
          {timelineStart.toLocaleString("de-CH")}
        </p>
        {dayMarkers.slice(1).map((day, index) => (
          <p
            key={index}
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            {day.toLocaleDateString("de-CH")}
          </p>
        ))}
        <p className="hover:text-gray-700 transition-colors">
          {timelineEnd.toLocaleString("de-CH")}
        </p>
      </div>
      <div className="relative">
        {dayMarkers.slice(1).map((day, index) => {
          const dayProgress = Math.max(
            Math.min(
              ((day.getTime() - timelineStart.getTime()) /
                (timelineEnd.getTime() - timelineStart.getTime())) *
                100,
              100
            ),
            0
          );
          return (
            <div
              key={index}
              className="absolute w-[1px] h-8 -top-3 bg-black"
              style={{
                left: `${dayProgress}%`,
                transform: "translateX(-50%)",
              }}
            />
          );
        })}
        {filteredEvents.map((event) => {
          const eventProgress = Math.max(
            Math.min(
              ((new Date(event.createdAt).getTime() - timelineStart.getTime()) /
                (timelineEnd.getTime() - timelineStart.getTime())) *
                100,
              100
            ),
            0
          );
          return (
            <div
              key={event.id}
              className={`absolute w-1 z-50 h-4 -top-1 rounded-full bg-${
                getEventStatusColor(event.status) ?? "gray"
              }-500`}
              style={{
                left: `${eventProgress}%`,
                transform: "translateX(-50%)",
              }}
            />
          );
        })}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0}
          dragMomentum={false}
          onDrag={(e, info) => {
            const rect = (
              e.target as HTMLElement
            ).parentElement?.getBoundingClientRect();
            if (!rect) return;
            const percentage = Math.max(
              0,
              Math.min(100, ((info.point.x - rect.left) / rect.width) * 100)
            );
            const newTime = new Date(
              timelineStart.getTime() +
                ((timelineEnd.getTime() - timelineStart.getTime()) *
                  percentage) /
                  100
            );
            setDatetime(newTime);
            setPlaybackType(PlaybackType.PAUSE);
          }}
          onClick={(e) => {
            const rect = (
              e.target as HTMLElement
            ).parentElement?.getBoundingClientRect();
            if (!rect) return;
            const percentage = Math.max(
              0,
              Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)
            );
            const newTime = new Date(
              timelineStart.getTime() +
                ((timelineEnd.getTime() - timelineStart.getTime()) *
                  percentage) /
                  100
            );
            setDatetime(newTime);
            setPlaybackType(PlaybackType.PAUSE);
          }}
        >
          <Progress value={progress} max={100} className="cursor-pointer" />
        </motion.div>
      </div>
    </div>
  );
}

export default dynamic(
  () => Promise.resolve(NetworkTimelineProgressIndicatorComponent),
  { ssr: false }
);
