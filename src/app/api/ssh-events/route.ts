import {
  handleSshStartEvent,
  handleSshStopEvent,
  SshEventRequest,
} from "@/features/ssh-sessions/ssh-session-actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Check for API token in Authorization header
    const authHeader = request.headers.get("authorization");
    const apiToken = process.env.SSH_API_TOKEN;

    if (!apiToken) {
      return NextResponse.json(
        { success: false, error: "API token not configured" },
        { status: 500 }
      );
    }

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Missing or invalid authorization header" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    if (token !== apiToken) {
      return NextResponse.json(
        { success: false, error: "Invalid API token" },
        { status: 401 }
      );
    }

    // Parse request body
    const body: SshEventRequest = await request.json();

    // Validate required fields
    if (!body.event || !body.analystName || !body.host || !body.timestamp) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate event type
    if (!["ssh_start", "ssh_stop"].includes(body.event)) {
      return NextResponse.json(
        { success: false, error: "Invalid event type" },
        { status: 400 }
      );
    }

    // Handle the event
    let result;
    if (body.event === "ssh_start") {
      result = await handleSshStartEvent(body);
    } else {
      result = await handleSshStopEvent(body);
    }

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("SSH API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
