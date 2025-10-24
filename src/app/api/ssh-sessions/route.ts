import {
  getActiveSshSessions,
  getSshSessionHistory,
} from "@/features/ssh-sessions/ssh-session-actions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (type === "active") {
      const sessions = await getActiveSshSessions();
      return NextResponse.json({ sessions });
    }

    if (type === "history") {
      const assetId = searchParams.get("assetId");
      const analystName = searchParams.get("analystName");
      const limit = searchParams.get("limit");

      const sessions = await getSshSessionHistory({
        assetId: assetId || undefined,
        analystName: analystName || undefined,
        limit: limit ? parseInt(limit) : undefined,
      });

      return NextResponse.json({ sessions });
    }

    return NextResponse.json(
      { error: "Invalid type parameter. Use 'active' or 'history'" },
      { status: 400 }
    );
  } catch (error) {
    console.error("SSH sessions API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
