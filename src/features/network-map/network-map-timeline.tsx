"use client";
import { AnimatePresence, motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getEventStatusColor } from "@/types/event-types";
import { PauseIcon, PlayIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PlaybackType, useNetworkMap } from "./network-map-context";

export default function NetworkMapTimeline() {
  const {
    datetime,
    setDatetime,
    playbackType,
    togglePlay,
    dynamicEvents,
    playSpeed,
    setPlaySpeed,
  } = useNetworkMap();
  const [datetimeInput, setDatetimeInput] = useState(
    datetime.toLocaleString("de-CH")
  );

  useEffect(() => {
    setDatetimeInput(datetime.toLocaleString("de-CH"));
  }, [datetime]);

  return (
    <div className="w-full mx-5 max-h-[90dvh]">
      <div className="flex flex-row justify-between items-center my-5">
        <Input
          type="text"
          value={datetimeInput}
          onChange={(e) => setDatetimeInput(e.target.value)}
          onBlur={() => {
            console.log("Setting datetime to:", datetimeInput);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [day, month, year, _, hours, minutes, seconds] = datetimeInput
              .split(/[., :]/)
              .map(Number);
            const newDate = new Date(
              year,
              month - 1,
              day,
              hours,
              minutes,
              seconds
            );
            if (!isNaN(newDate.getTime())) {
              setDatetime(newDate);
              setDatetimeInput(newDate.toLocaleString("de-CH"));
            } else {
              setDatetimeInput(datetime.toLocaleString("de-CH"));
            }
          }}
          className="border rounded px-2 py-1 w-fit"
        />
        <div className="flex flex-row gap-2">
          <Select
            onValueChange={(value) => setPlaySpeed(parseInt(value))}
            value={playSpeed.toString()}
          >
            <SelectTrigger>
              <SelectValue placeholder="Play speed" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5x</SelectItem>
              <SelectItem value="10">10x</SelectItem>
              <SelectItem value="15">15x</SelectItem>
              <SelectItem value="30">30x</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={togglePlay}>
            {playbackType !== PlaybackType.PAUSE ? (
              playbackType == PlaybackType.PLAY ? (
                <PauseIcon />
              ) : (
                <div className="relative">
                  <PauseIcon />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                </div>
              )
            ) : (
              <PlayIcon />
            )}
          </Button>
        </div>
      </div>
      <ScrollArea className="h-full">
        <div className="flex flex-col gap-2 ">
          <AnimatePresence mode="popLayout">
            {dynamicEvents
              .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
              .map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  layoutId={event.id}
                  className={`w-full p-4 rounded-lg shadow-md border border-gray-200 bg-${getEventStatusColor(
                    event.status
                  )}-200 hover:shadow-lg transition-shadow`}
                >
                  <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-col gap-1">
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      <p className="text-sm text-gray-500">
                        {event.createdAt.toLocaleString("de-CH")}
                      </p>
                    </div>
                    <div className="flex flex-row gap-2">
                      {event.asset && (
                        <Link href={`/assets/${event.asset.id}`}>
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                          >
                            {event.asset.name}
                          </Badge>
                        </Link>
                      )}
                      {event.ioc && (
                        <Link href={`/iocs/${event.ioc.id}`}>
                          <Badge
                            variant="secondary"
                            className="bg-purple-100 text-purple-800 hover:bg-purple-200"
                          >
                            {event.ioc.value}
                          </Badge>
                        </Link>
                      )}
                      {event.responseAction && (
                        <Link
                          href={`/response-actions/${event.responseAction.id}`}
                        >
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800 hover:bg-green-200"
                          >
                            {event.responseAction.name}
                          </Badge>
                        </Link>
                      )}
                      {event.alert && (
                        <Link href={`/alerts/${event.alert.id}`}>
                          <Badge
                            variant="secondary"
                            className="bg-red-100 text-red-800 hover:bg-red-200"
                          >
                            {event.alert.name}
                          </Badge>
                        </Link>
                      )}
                      {event.responsible && (
                        <Link href={`/users/${event.responsible.id}`}>
                          <Badge
                            variant="secondary"
                            className="bg-gray-100 text-gray-800 hover:bg-gray-200"
                          >
                            {event.responsible.name}
                          </Badge>
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}
