"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { exportComponentAsPNG } from "react-component-export-image";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PopulatedAttackChain } from "@/types/attack-chain";
import { Alert, Asset } from "@prisma/client";
import Link from "next/link";
import { useRef } from "react";
import { addAlertToAttackChain } from "../attack-chain-actions";

export default function AttackChainAlerts({
  attackChain,
  alerts,
}: {
  attackChain: PopulatedAttackChain;
  alerts: (Alert & { assets: Asset[] })[];
}) {
  const componentRef = useRef<HTMLDivElement>(null);

  const availableAlerts = alerts?.filter(
    (alert) => !attackChain.alerts.find((a) => a.id === alert.id)
  );
  return (
    <div className="">
      <div className="flex flex-col gap-8" ref={componentRef}>
        {attackChain.alerts && attackChain.alerts.length > 0 ? (
          attackChain.alerts
            .toSorted(
              (a, b) => a.startDateTime.getTime() - b.startDateTime.getTime()
            )
            .map((alert, index) => (
              <div key={alert.id} className="flex flex-col gap-2">
                <div className="bg-white p-4 rounded-lg shadow-md border">
                  <Link
                    href={`/alerts/${alert.id}`}
                    className="flex items-center gap-3"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-semibold">
                      {index + 1}
                    </div>
                    <h3 className="font-semibold text-lg">{alert.name}</h3>
                  </Link>
                  <div
                    className="text-gray-600 mt-1 prose max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: alert.description,
                    }}
                  />

                  <div className="mt-3">
                    <h4 className="font-medium text-sm text-gray-700">
                      Affected Assets:
                    </h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {alert.assets.map((asset) => (
                        <Link
                          key={asset.id}
                          href={`/assets/${asset.id}`}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                        >
                          <span className="font-medium">
                            {asset.identifier}
                          </span>
                          - {asset.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3">
                    <h4 className="font-medium text-sm text-gray-700">
                      Related IOCs:
                    </h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {alert.relatedIOCs.map((ioc) => (
                        <span
                          key={ioc.id}
                          className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-sm"
                        >
                          {ioc.type.name}: {ioc.value}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <p>No alerts found</p>
        )}
      </div>
      {availableAlerts && availableAlerts.length > 0 && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Add Alert to Chain</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={addAlertToAttackChain}>
              <input
                type="hidden"
                name="attackChainId"
                value={attackChain.id}
              />
              <div className="flex gap-2">
                <Select name="alertId">
                  <SelectTrigger>
                    <SelectValue placeholder="Select an alert" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableAlerts?.map((alert) => (
                      <SelectItem key={alert.id} value={alert.id}>
                        {alert.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="submit">Add Alert</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Button
        onClick={() => exportComponentAsPNG(componentRef)}
        className="mt-5"
      >
        Export as Image
      </Button>
    </div>
  );
}
