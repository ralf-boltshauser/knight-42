import { prisma } from "@/lib/client";
import { AssetType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  // if it is an array create many
  try {
    if (Array.isArray(body)) {
      await prisma.asset.createMany({
        data: body.map((asset) => ({
          ...asset,
          type: AssetType.WINDOWS_SERVER,
          identifier: asset.metadata.IP,
        })),
      });
    } else {
      await prisma.asset.create({
        data: {
          ...body,
          type: AssetType.WINDOWS_SERVER,
          identifier: body.metadata.IP,
        },
      });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ message: e.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Asset created successfully" });
};
