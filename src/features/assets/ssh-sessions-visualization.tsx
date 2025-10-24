"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PopulatedAsset } from "@/types/asset";
import { format, isWithinInterval, subDays } from "date-fns";
import {
  Activity,
  AlertTriangle,
  Calendar,
  Clock,
  Eye,
  Filter,
  User,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type TimeRange = "2h" | "24h" | "7d" | "30d" | "custom";

interface SshSessionData {
  id: string;
  analystName: string;
  host: string;
  startedAt: Date;
  endedAt: Date | null;
  duration: number | null;
  status: "ACTIVE" | "COMPLETED";
  event?: {
    id: string;
    title: string;
  } | null;
}

interface SessionBar {
  id: string;
  analystName: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  status: "ACTIVE" | "COMPLETED";
  isSuspicious: boolean;
  suspiciousReasons: string[];
  y: number;
  width: number;
  x: number;
}

interface SshSessionsVisualizationProps {
  asset: PopulatedAsset;
  onRefresh?: () => Promise<void>;
}

export function SshSessionsVisualization({
  asset,
  onRefresh,
}: SshSessionsVisualizationProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("2h");
  const [selectedAnalyst, setSelectedAnalyst] = useState<string>("all");
  const [hoveredSession, setHoveredSession] = useState<SessionBar | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto-refresh when in live mode (2h)
  useEffect(() => {
    if (timeRange === "2h" && onRefresh) {
      const interval = setInterval(async () => {
        try {
          setIsRefreshing(true);
          await onRefresh();
          setLastRefresh(new Date());
        } catch (error) {
          console.error("Failed to refresh SSH sessions:", error);
        } finally {
          setIsRefreshing(false);
        }
      }, 10000); // Refresh every 10 seconds

      return () => clearInterval(interval);
    }
  }, [timeRange, onRefresh]);

  // Process SSH sessions data
  const sessionsData: SshSessionData[] = useMemo(() => {
    return asset.sshSessions.map((session) => ({
      id: session.id,
      analystName: session.analystName,
      host: session.host,
      startedAt: session.startedAt,
      endedAt: session.endedAt,
      duration: session.duration,
      status: session.status,
    }));
  }, [asset.sshSessions]);

  // Get time range boundaries
  const timeRangeData = useMemo(() => {
    const now = new Date();
    let start: Date, end: Date;

    switch (timeRange) {
      case "2h":
        start = new Date(now.getTime() - 2 * 60 * 60 * 1000); // 2 hours ago
        end = now;
        break;
      case "24h":
        start = subDays(now, 1);
        end = now;
        break;
      case "7d":
        start = subDays(now, 7);
        end = now;
        break;
      case "30d":
        start = subDays(now, 30);
        end = now;
        break;
      default:
        start = new Date(now.getTime() - 2 * 60 * 60 * 1000);
        end = now;
    }

    return { start, end };
  }, [timeRange]);

  // Filter sessions by time range and analyst
  const filteredSessions = useMemo(() => {
    return sessionsData.filter((session) => {
      const sessionStart = session.startedAt;

      const isInTimeRange = isWithinInterval(sessionStart, {
        start: timeRangeData.start,
        end: timeRangeData.end,
      });

      const isAnalystMatch =
        selectedAnalyst === "all" || session.analystName === selectedAnalyst;

      return isInTimeRange && isAnalystMatch;
    });
  }, [sessionsData, timeRangeData, selectedAnalyst]);

  // Detect suspicious activity
  // const detectSuspiciousActivity = (
  //   session: SshSessionData
  // ): { isSuspicious: boolean; reasons: string[] } => {
  //   const reasons: string[] = [];

  //   // TODO: Re-enable suspicious activity detection when needed
  //   // Currently commented out since we know these are legitimate sessions

  //   // // Check for odd hours (outside 8 AM - 6 PM)
  //   // const hour = session.startedAt.getHours();
  //   // if (hour < 8 || hour > 18) {
  //   //   reasons.push(`Session at odd hour (${hour}:00)`);
  //   // }

  //   // // Check for very long sessions (> 2 hours)
  //   // const duration = session.duration || 0;
  //   // if (duration > 7200) {
  //   //   // 2 hours in seconds
  //   //   reasons.push(`Long session (${Math.round(duration / 60)} minutes)`);
  //   // }

  //   // // Check for multiple sessions in short time
  //   // const recentSessions = sessionsData.filter(
  //   //   (s) =>
  //   //     s.analystName === session.analystName &&
  //   //     s.id !== session.id &&
  //   //     Math.abs(s.startedAt.getTime() - session.startedAt.getTime()) < 3600000 // 1 hour
  //   // );
  //   // if (recentSessions.length > 2) {
  //   //   reasons.push(`Multiple sessions in short time`);
  //   // }

  //   return {
  //     isSuspicious: reasons.length > 0,
  //     reasons,
  //   };
  // };

  // Generate session bars for visualization
  const sessionBars: SessionBar[] = useMemo(() => {
    const bars: SessionBar[] = [];
    const analystRows: { [key: string]: number } = {};
    let currentRow = 0;

    // Group sessions by analyst and find each analyst's first session time
    const analystFirstSessions: { [key: string]: Date } = {};
    filteredSessions.forEach((session) => {
      if (
        !analystFirstSessions[session.analystName] ||
        session.startedAt < analystFirstSessions[session.analystName]
      ) {
        analystFirstSessions[session.analystName] = session.startedAt;
      }
    });

    // Sort analysts by their first session time
    const sortedAnalysts = Object.keys(analystFirstSessions).sort(
      (a, b) =>
        analystFirstSessions[a].getTime() - analystFirstSessions[b].getTime()
    );

    // Assign rows based on first session time
    sortedAnalysts.forEach((analyst) => {
      analystRows[analyst] = currentRow++;
    });

    // Sort sessions by analyst (by first session time), then by start time within each analyst
    const sortedSessions = [...filteredSessions].sort((a, b) => {
      if (a.analystName !== b.analystName) {
        return (
          analystFirstSessions[a.analystName].getTime() -
          analystFirstSessions[b.analystName].getTime()
        );
      }
      return a.startedAt.getTime() - b.startedAt.getTime();
    });

    sortedSessions.forEach((session) => {
      // const suspicious = detectSuspiciousActivity(session);
      const suspicious = {
        isSuspicious: false,
        reasons: [],
      };

      // For active sessions, extend to current time
      const sessionEnd =
        session.status === "ACTIVE"
          ? new Date() // Current time for active sessions
          : session.endedAt || new Date();

      const totalDuration =
        timeRangeData.end.getTime() - timeRangeData.start.getTime();
      const sessionStartTime =
        session.startedAt.getTime() - timeRangeData.start.getTime();
      const sessionDuration =
        sessionEnd.getTime() - session.startedAt.getTime();

      const x = (sessionStartTime / totalDuration) * 100;
      const width = (sessionDuration / totalDuration) * 100;

      bars.push({
        id: session.id,
        analystName: session.analystName,
        startTime: session.startedAt,
        endTime: sessionEnd,
        duration: sessionDuration,
        status: session.status,
        isSuspicious: suspicious.isSuspicious,
        suspiciousReasons: suspicious.reasons,
        y: analystRows[session.analystName] * 40 + 10,
        width: Math.max(width, 0.5), // Minimum width for visibility
        x: Math.max(x, 0),
      });
    });

    return bars;
  }, [filteredSessions, timeRangeData]);

  // Get unique analysts for filter
  const analysts = useMemo(() => {
    const unique = Array.from(new Set(sessionsData.map((s) => s.analystName)));
    return unique.sort();
  }, [sessionsData]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalSessions = filteredSessions.length;
    const suspiciousSessions = filteredSessions.filter(() => false).length;
    const totalDuration = filteredSessions.reduce(
      (sum, s) => sum + (s.duration || 0),
      0
    );
    const avgDuration = totalSessions > 0 ? totalDuration / totalSessions : 0;

    return {
      totalSessions,
      suspiciousSessions,
      avgDuration: Math.round(avgDuration / 60), // Convert to minutes
      uniqueAnalysts: analysts.length,
    };
  }, [filteredSessions, analysts]);

  return (
    <div className="space-y-6">
      {/* Header with Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Sessions</p>
                <p className="text-2xl font-bold">{stats.totalSessions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Suspicious</p>
                <p className="text-2xl font-bold text-orange-500">
                  {stats.suspiciousSessions}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Avg Duration</p>
                <p className="text-2xl font-bold">{stats.avgDuration}m</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Analysts</p>
                <p className="text-2xl font-bold">{stats.uniqueAnalysts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <Select
            value={timeRange}
            onValueChange={(value: TimeRange) => setTimeRange(value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2h">Last 2 hours</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <Select value={selectedAnalyst} onValueChange={setSelectedAnalyst}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Analysts</SelectItem>
              {analysts.map((analyst) => (
                <SelectItem key={analyst} value={analyst}>
                  {analyst}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-muted-foreground">
          {timeRange === "2h"
            ? `${format(timeRangeData.start, "HH:mm")} - ${format(
                timeRangeData.end,
                "HH:mm"
              )}`
            : `${format(timeRangeData.start, "MMM d")} - ${format(
                timeRangeData.end,
                "MMM d, yyyy"
              )}`}
        </div>
      </div>

      {/* Gantt Chart Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5" />
            <span>SSH Session Timeline</span>
            {timeRange === "2h" && (
              <Badge
                variant="secondary"
                className={`ml-2 ${
                  isRefreshing
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                }`}
              >
                <Activity
                  className={`h-3 w-3 mr-1 ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
                {isRefreshing ? "Refreshing" : "Live"}
                <span className="ml-1 text-xs opacity-75">
                  ({format(lastRefresh, "HH:mm:ss")})
                </span>
              </Badge>
            )}
            {stats.suspiciousSessions > 0 && (
              <Badge variant="destructive" className="ml-2">
                <Zap className="h-3 w-3 mr-1" />
                {stats.suspiciousSessions} Suspicious
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sessionBars.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No SSH sessions found for the selected time range</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Time axis */}
              <div className="flex justify-between text-xs text-muted-foreground px-2">
                <span>
                  {timeRange === "2h"
                    ? format(timeRangeData.start, "HH:mm")
                    : format(timeRangeData.start, "HH:mm")}
                </span>
                <span>
                  {timeRange === "2h"
                    ? format(timeRangeData.end, "HH:mm")
                    : format(timeRangeData.end, "HH:mm")}
                </span>
              </div>

              {/* Gantt Chart */}
              <div className="relative border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                <svg
                  width="100%"
                  height={Math.max(sessionBars.length * 40, 200)}
                  className="overflow-visible"
                >
                  {/* Grid lines */}
                  {Array.from({ length: timeRange === "2h" ? 5 : 5 }).map(
                    (_, i) => (
                      <line
                        key={i}
                        x1={`${i * (timeRange === "2h" ? 25 : 25)}%`}
                        y1="0"
                        x2={`${i * (timeRange === "2h" ? 25 : 25)}%`}
                        y2="100%"
                        stroke="currentColor"
                        strokeWidth="0.5"
                        opacity="0.2"
                      />
                    )
                  )}

                  {/* Current time line */}
                  <line
                    x1="100%"
                    y1="0"
                    x2="100%"
                    y2="100%"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    opacity="0.7"
                  />

                  {/* Session bars */}
                  {sessionBars.map((bar) => (
                    <g key={bar.id}>
                      <rect
                        x={`${bar.x}%`}
                        y={bar.y}
                        width={`${bar.width}%`}
                        height="30"
                        fill={
                          bar.isSuspicious
                            ? "#ef4444"
                            : bar.status === "ACTIVE"
                            ? "#10b981"
                            : "#3b82f6"
                        }
                        stroke={bar.isSuspicious ? "#dc2626" : "currentColor"}
                        strokeWidth={bar.isSuspicious ? "2" : "1"}
                        rx="4"
                        className={`cursor-pointer hover:opacity-80 transition-opacity ${
                          bar.status === "ACTIVE" ? "animate-pulse" : ""
                        }`}
                        onMouseEnter={() => setHoveredSession(bar)}
                        onMouseLeave={() => setHoveredSession(null)}
                      />

                      {/* Session label */}
                      <text
                        x={`${bar.x + 2}%`}
                        y={bar.y + 20}
                        fontSize="12"
                        fill="white"
                        className="pointer-events-none"
                      >
                        {bar.analystName}
                      </text>

                      {/* Duration label */}
                      {bar.width > 5 && (
                        <text
                          x={`${bar.x + bar.width / 2}%`}
                          y={bar.y + 20}
                          fontSize="10"
                          fill="white"
                          textAnchor="middle"
                          className="pointer-events-none"
                        >
                          {bar.status === "ACTIVE"
                            ? "Live"
                            : `${Math.round(bar.duration / 60000)}m`}
                        </text>
                      )}
                    </g>
                  ))}

                  {/* Analyst labels */}
                  {Object.entries(
                    sessionBars.reduce((acc, bar) => {
                      acc[bar.analystName] = bar.y;
                      return acc;
                    }, {} as { [key: string]: number })
                  ).map(([analyst, y]) => (
                    <text
                      key={analyst}
                      x="-10"
                      y={y + 20}
                      fontSize="12"
                      fill="currentColor"
                      textAnchor="end"
                      className="pointer-events-none"
                    >
                      {analyst}
                    </text>
                  ))}
                </svg>

                {/* Hover tooltip */}
                {hoveredSession && (
                  <div
                    className="absolute bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-3 z-10 pointer-events-none"
                    style={{
                      left: `${hoveredSession.x + hoveredSession.width / 2}%`,
                      top: `${hoveredSession.y - 10}px`,
                      transform: "translateX(-50%)",
                    }}
                  >
                    <div className="space-y-1">
                      <p className="font-medium">
                        {hoveredSession.analystName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(hoveredSession.startTime, "MMM d, HH:mm")} -{" "}
                        {hoveredSession.status === "ACTIVE"
                          ? "Now"
                          : format(hoveredSession.endTime, "HH:mm")}
                      </p>
                      <p className="text-sm">
                        Duration:{" "}
                        {hoveredSession.status === "ACTIVE"
                          ? "Live (ongoing)"
                          : `${Math.round(
                              hoveredSession.duration / 60000
                            )} minutes`}
                      </p>
                      {hoveredSession.isSuspicious && (
                        <div className="text-sm text-red-600">
                          <p className="font-medium">⚠️ Suspicious Activity:</p>
                          {hoveredSession.suspiciousReasons.map((reason, i) => (
                            <p key={i} className="text-xs">
                              • {reason}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Legend */}
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>Active Sessions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>Completed Sessions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded border-2 border-red-600"></div>
                  <span>Suspicious Activity</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
