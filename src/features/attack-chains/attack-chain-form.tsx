"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AttackChainAlert } from "@/types/alert";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createAttackChain, getAlerts } from "./attack-chain-actions";

export default function AttackChainForm() {
  const [name, setName] = useState("ATT&CK Chain");
  const [remainingAlerts, setRemainingAlerts] = useState<AttackChainAlert[]>(
    []
  );
  const [attackChainAlerts, setAttackChainAlerts] = useState<
    AttackChainAlert[]
  >([]);
  const [draggingItem, setDraggingItem] = useState<AttackChainAlert | null>(
    null
  );
  const [sourceList, setSourceList] = useState<
    "remaining" | "attackChain" | null
  >(null);

  const { data: alerts, isSuccess } = useQuery({
    queryKey: ["alerts"],
    queryFn: () => getAlerts(),
  });

  useEffect(() => {
    if (
      isSuccess &&
      remainingAlerts.length === 0 &&
      attackChainAlerts.length === 0
    ) {
      setRemainingAlerts(alerts);
    }
  }, [isSuccess, alerts, remainingAlerts.length, attackChainAlerts.length]);

  const onDragStart = (
    item: AttackChainAlert,
    listType: "remaining" | "attackChain"
  ) => {
    setDraggingItem(item);
    setSourceList(listType);
  };

  const onDragEnd = () => {
    setDraggingItem(null);
    setSourceList(null);
  };

  const onDrop = (destinationList: "remaining" | "attackChain") => {
    if (!draggingItem || !sourceList) return;

    if (sourceList === destinationList) {
      // Reordering within the same list
      if (sourceList === "remaining") {
        const index = remainingAlerts.findIndex(
          (i) => i.id === draggingItem.id
        );
        const newList = [...remainingAlerts];
        newList.splice(index, 1);
        newList.splice(index, 0, draggingItem);
        setRemainingAlerts(newList);
      } else {
        const index = attackChainAlerts.findIndex(
          (i) => i.id === draggingItem.id
        );
        const newList = [...attackChainAlerts];
        newList.splice(index, 1);
        newList.splice(index, 0, draggingItem);
        setAttackChainAlerts(newList);
      }
    } else {
      // Moving between different lists
      if (sourceList === "remaining") {
        setRemainingAlerts((prev) =>
          prev.filter((alert) => alert.id !== draggingItem.id)
        );
        setAttackChainAlerts((prev) => [...prev, draggingItem]);
      } else {
        setAttackChainAlerts((prev) =>
          prev.filter((alert) => alert.id !== draggingItem.id)
        );
        setRemainingAlerts((prev) => [...prev, draggingItem]);
      }
    }

    setDraggingItem(null);
    setSourceList(null);
  };

  const handleCreate = async () => {
    await createAttackChain(
      name,
      attackChainAlerts.map((alert) => alert.id)
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
      </div>

      <div className="flex flex-row gap-8">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => onDrop("remaining")}
          className="flex-grow w-full"
        >
          <h2 className="text-lg font-semibold">Remaining Alerts</h2>
          <div className="flex flex-col gap-2 min-h-[200px] p-4 border rounded w-full max-h-[800px] overflow-y-auto">
            {remainingAlerts.map((alert) => (
              <motion.div
                key={alert.id}
                draggable
                onDragStart={() => onDragStart(alert, "remaining")}
                onDragEnd={onDragEnd}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="p-2 bg-white border rounded shadow cursor-grab"
              >
                {alert.name} -{" "}
                {alert.assets.map((asset) => (
                  <Badge key={asset.id} variant="outline">
                    {asset.name}
                  </Badge>
                ))}
              </motion.div>
            ))}
          </div>
        </div>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => onDrop("attackChain")}
          className="flex-grow w-full"
        >
          <h2 className="text-lg font-semibold">
            Attack Chain Alerts: {attackChainAlerts.length}
          </h2>
          <div className="flex flex-col gap-2 min-h-[200px] p-4 border rounded w-full max-h-[800px] overflow-y-auto">
            {attackChainAlerts
              .toSorted(
                (a, b) => a.startDateTime.getTime() - b.startDateTime.getTime()
              )
              .map((alert) => (
                <motion.div
                  key={alert.id}
                  draggable
                  onDragStart={() => onDragStart(alert, "attackChain")}
                  onDragEnd={onDragEnd}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="p-2 bg-white border rounded shadow cursor-grab"
                >
                  {alert.name}
                </motion.div>
              ))}
          </div>
        </div>
      </div>
      <Button className="w-fit" onClick={handleCreate}>
        Create
      </Button>
    </div>
  );
}
