import { prisma } from "@/lib/client";
import { AssetType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  await prisma.asset.create({
    data: {
      ...body,
      type: AssetType.HOST,
      identifier: body.metadata.IP,
    },
  });
  return NextResponse.json({ message: "Asset created successfully" });
};
