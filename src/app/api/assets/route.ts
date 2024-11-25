import { prisma } from "@/lib/client";
import { AssetType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  // if it is an array create many
  if (Array.isArray(body)) {
    await prisma.asset.createMany({
      data: body.map((asset) => ({
        ...asset,
        type: AssetType.HOST,
        identifier: asset.metadata.IP,
      })),
    });
  } else {
    await prisma.asset.create({
      data: {
        ...body,
        type: AssetType.HOST,
        identifier: body.metadata.IP,
      },
    });
  }

  return NextResponse.json({ message: "Asset created successfully" });
};
