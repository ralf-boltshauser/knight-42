import { prisma } from "@/lib/client";
import { AssetType, EventStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  try {
    console.log("body", body);
    if (Array.isArray(body)) {
      if (body[0].id && body[0].up !== undefined) {
        for (const asset of body) {
          const lastUptimeRecord = await prisma.assetUptime.findFirst({
            where: { assetId: asset.id },
            orderBy: { timestamp: "desc" },
          });

          const res = await prisma.asset.update({
            where: { id: asset.id },
            data: {
              assetUptimes: {
                create: {
                  up: asset.up,
                },
              },
            },
          });

          if (!res) {
            // asset does not exist
            return NextResponse.json(
              {
                message: "Asset does not exist",
              },
              { status: 404 }
            );
          }

          if (lastUptimeRecord && lastUptimeRecord.up !== asset.up) {
            await prisma.event.create({
              data: {
                title:
                  "Asset " + asset.id + " is " + (asset.up ? "up" : "down"),
                status: asset.up ? EventStatus.OKAY : EventStatus.DOWN,
                assetId: asset.id,
              },
            });
          }
        }
      } else {
        // Handle array of assets
        await prisma.asset.createMany({
          data: body.map((asset) => ({
            ...asset,
            type: AssetType.WINDOWS_SERVER,
            identifier: asset.metadata.IP,
          })),
        });
      }
    } else {
      // Handle single asset - create or update based on id
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

  return NextResponse.json({
    message: "Asset operation completed successfully",
  });
};

export const GET = async () => {
  try {
    const assets = await prisma.asset.findMany({
      select: {
        id: true,
        metadata: true,
      },
    });

    return NextResponse.json(assets);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Error fetching assets" },
      { status: 500 }
    );
  }
};
