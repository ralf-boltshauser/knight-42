import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  let body;
  try {
    body = await req.json();
    return NextResponse.json(body);
  } catch {
    body = await req.text();
    return NextResponse.json({ text: body });
  }
};
