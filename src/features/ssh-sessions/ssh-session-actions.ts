"use server";

import { prisma } from "@/lib/client";
import { SshSessionStatus } from "@prisma/client";

export interface SshEventRequest {
  event: "ssh_start" | "ssh_stop";
  analystName: string;
  host: string;
  timestamp: string;
}

export interface SshEventResponse {
  success: boolean;
  sessionId?: string;
  assetId?: string;
  assetName?: string;
  error?: string;
}

export interface ActiveSession {
  id: string;
  analystName: string;
  asset: {
    id: string;
    name: string;
    identifier: string;
  } | null;
  startedAt: Date;
  duration: number;
}

/**
 * Find an asset by matching hostname/IP in metadata
 */
async function findAssetByHost(host: string) {
  // Try exact hostname match
  let asset = await prisma.asset.findFirst({
    where: {
      metadata: {
        path: ["hostname"],
        equals: host,
      },
    },
  });

  if (asset) return asset;

  // Try IP match (note: IP in caps as specified)
  asset = await prisma.asset.findFirst({
    where: {
      metadata: {
        path: ["IP"],
        equals: host,
      },
    },
  });

  if (asset) return asset;

  // Try FQDN match
  asset = await prisma.asset.findFirst({
    where: {
      metadata: {
        path: ["fqdn"],
        equals: host,
      },
    },
  });

  if (asset) return asset;

  // Try aliases match
  asset = await prisma.asset.findFirst({
    where: {
      metadata: {
        path: ["aliases"],
        array_contains: host,
      },
    },
  });

  return asset;
}

/**
 * Handle SSH start event
 */
export async function handleSshStartEvent(
  data: SshEventRequest
): Promise<SshEventResponse> {
  try {
    // Find the asset by host
    const asset = await findAssetByHost(data.host);

    // Close any existing active sessions for this analyst
    const existingSessions = await prisma.sshSession.findMany({
      where: {
        analystName: data.analystName,
        status: SshSessionStatus.ACTIVE,
      },
      include: {
        event: true,
      },
    });

    // Close each existing session
    for (const existingSession of existingSessions) {
      const endTime = new Date(data.timestamp);
      const duration = Math.floor(
        (endTime.getTime() - existingSession.startedAt.getTime()) / 1000
      );

      // Update the existing session to completed
      await prisma.sshSession.update({
        where: { id: existingSession.id },
        data: {
          status: SshSessionStatus.COMPLETED,
          endedAt: endTime,
          duration: duration,
        },
      });

      // Update the associated event
      if (existingSession.event) {
        await prisma.event.update({
          where: { id: existingSession.event.id },
          data: {
            title: `SSH Session Completed - ${data.analystName} (${duration}s)`,
          },
        });
      }
    }

    // Create event for timeline
    const event = await prisma.event.create({
      data: {
        title: `SSH Session Started - ${data.analystName}`,
        assetId: asset?.id,
      },
    });

    // Create new session linked to event
    const session = await prisma.sshSession.create({
      data: {
        analystName: data.analystName,
        host: data.host,
        assetId: asset?.id,
        eventId: event.id,
        status: SshSessionStatus.ACTIVE,
        startedAt: new Date(data.timestamp),
      },
    });

    return {
      success: true,
      sessionId: session.id,
      assetId: asset?.id,
      assetName: asset?.name,
    };
  } catch (error) {
    console.error("Error handling SSH start event:", error);
    return {
      success: false,
      error: "Failed to create SSH session",
    };
  }
}

/**
 * Handle SSH stop event
 */
export async function handleSshStopEvent(
  data: SshEventRequest
): Promise<SshEventResponse> {
  try {
    const stopTime = new Date(data.timestamp);

    // Find the most recent active session for this analyst/host combination
    const session = await prisma.sshSession.findFirst({
      where: {
        analystName: data.analystName,
        host: data.host,
        status: SshSessionStatus.ACTIVE,
      },
      orderBy: {
        startedAt: "desc",
      },
      include: {
        event: true,
      },
    });

    if (!session) {
      return {
        success: false,
        error: "No active session found",
      };
    }

    // Calculate duration
    const duration = Math.floor(
      (stopTime.getTime() - session.startedAt.getTime()) / 1000
    );

    // Update session
    await prisma.sshSession.update({
      where: {
        id: session.id,
      },
      data: {
        endedAt: stopTime,
        duration,
        status: SshSessionStatus.COMPLETED,
      },
    });

    // Update the associated event
    if (session.event) {
      await prisma.event.update({
        where: {
          id: session.event.id,
        },
        data: {
          title: `SSH Session Completed - ${data.analystName} (${duration}s)`,
        },
      });
    }

    return {
      success: true,
      sessionId: session.id,
    };
  } catch (error) {
    console.error("Error handling SSH stop event:", error);
    return {
      success: false,
      error: "Failed to update SSH session",
    };
  }
}

/**
 * Get all active SSH sessions
 */
export async function getActiveSshSessions(): Promise<ActiveSession[]> {
  try {
    const sessions = await prisma.sshSession.findMany({
      where: {
        status: SshSessionStatus.ACTIVE,
      },
      include: {
        asset: {
          select: {
            id: true,
            name: true,
            identifier: true,
          },
        },
      },
      orderBy: {
        startedAt: "desc",
      },
    });

    return sessions.map((session) => ({
      id: session.id,
      analystName: session.analystName,
      asset: session.asset,
      startedAt: session.startedAt,
      duration: Math.floor((Date.now() - session.startedAt.getTime()) / 1000),
    }));
  } catch (error) {
    console.error("Error fetching active SSH sessions:", error);
    return [];
  }
}

/**
 * Get SSH session history with optional filtering
 */
export async function getSshSessionHistory(options: {
  assetId?: string;
  analystName?: string;
  limit?: number;
}) {
  try {
    const sessions = await prisma.sshSession.findMany({
      where: {
        ...(options.assetId && { assetId: options.assetId }),
        ...(options.analystName && { analystName: options.analystName }),
      },
      include: {
        asset: {
          select: {
            id: true,
            name: true,
            identifier: true,
          },
        },
      },
      orderBy: {
        startedAt: "desc",
      },
      take: options.limit || 50,
    });

    return sessions;
  } catch (error) {
    console.error("Error fetching SSH session history:", error);
    return [];
  }
}
