"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Network, NetworkColor } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import FieldSelector from "./field-selector";
import { createNetwork, getNetworks, updateNetwork } from "./network-actions";

export default function CreateNetworkFormDialog({
  network,
  children,
}: {
  network?: Network;
  children?: React.ReactNode;
}) {
  const [fieldFrom, setFieldFrom] = useState(network?.fieldFrom || "");
  const [fieldTo, setFieldTo] = useState(network?.fieldTo || "");
  const [fieldLegend, setFieldLegend] = useState(network?.fieldLegend || "");
  const [networkColor, setNetworkColor] = useState(
    network?.networkColor || NetworkColor.GRAY
  );
  const [displayField, setDisplayField] = useState(true);
  const [selectedParentNetworkId, setSelectedParentNetworkId] = useState<
    string | undefined
  >(network?.parentNetworkId || undefined);

  const { data: networks } = useQuery({
    queryKey: ["networks"],
    queryFn: () => getNetworks(),
  });

  const [name, setName] = useState(network?.name || "");
  const [ipRange, setIpRange] = useState(network?.ipRange || "");

  const handleCreateNetwork = () => {
    toast.info("Creating network...");
    if (network) {
      updateNetwork({
        id: network.id,
        name,
        ipRange,
        fieldFrom,
        fieldTo,
        fieldLegend,
        networkColor: network.networkColor,
        parentNetworkId: selectedParentNetworkId,
      });
    } else if (name && ipRange && fieldFrom && fieldTo && fieldLegend) {
      createNetwork({
        name,
        ipRange,
        fieldFrom,
        fieldTo,
        fieldLegend,
        networkColor,
        parentNetworkId: selectedParentNetworkId,
      });
    }

    setFieldFrom("");
    setFieldTo("");
    setFieldLegend("");
    setSelectedParentNetworkId(undefined);
    setDisplayField(true);
    setName("");
    setIpRange("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children ? children : <Button>Create Network</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-[80vw] max-h-[80vh] h-full w-full flex flex-col justify-between items-start gap-4 overflow-y-auto">
        <div className="w-full">
          <DialogHeader>
            <DialogTitle>Create Network</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2 w-full">
            <h2>Name</h2>
            <Input value={name} onChange={(e) => setName(e.target.value)} />

            <h2>IP Range</h2>
            <Input
              value={ipRange}
              onChange={(e) => setIpRange(e.target.value)}
            />

            <h2>Network Color</h2>
            <Select
              value={networkColor}
              onValueChange={(value) => setNetworkColor(value as NetworkColor)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Network Color" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(NetworkColor).map((color) => (
                  <SelectItem
                    key={color}
                    value={color}
                    className={`text-${color.toLowerCase()}-500`}
                  >
                    {color}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <h2>Select Field</h2>
            <Button
              className="w-fit"
              variant="outline"
              onClick={() => setDisplayField(!displayField)}
            >
              From: <strong>{fieldFrom}</strong>, To: <strong>{fieldTo}</strong>
              , Legend: <strong>{fieldLegend}</strong>
            </Button>
            {displayField && (
              <FieldSelector
                color={networkColor}
                fieldFrom={fieldFrom}
                fieldTo={fieldTo}
                fieldLegend={fieldLegend}
                onFieldFromChange={setFieldFrom}
                onFieldToChange={setFieldTo}
                onFieldLegendChange={setFieldLegend}
              />
            )}
            <h2>Parent Network</h2>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Parent Network" />
              </SelectTrigger>
              <SelectContent>
                {networks?.map((network) => (
                  <SelectItem key={network.id} value={network.id}>
                    {network.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleCreateNetwork}>
              {network ? "Update" : "Create"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
