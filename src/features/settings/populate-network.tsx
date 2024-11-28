"use client";

import { Button } from "@/components/ui/button";
import { JsonInput } from "@mantine/core";
import { NetworkColor } from "@prisma/client";
import { useState } from "react";
import { populateNetwork } from "./settings-actions";

export default function PopulateNetwork() {
  const [network, setNetwork] = useState<string>(
    JSON.stringify([
      {
        name: "",
        ipRange: "",
        fieldFrom: "",
        fieldTo: "",
        fieldLegend: "",
        networkColor: NetworkColor.GRAY,
        parentNetworkId: null,
        assets: [],
        subNetworks: [],
      },
    ])
  );

  return (
    <div className="w-full">
      <h2 className="text-lg font-bold">Populate Network</h2>
      <JsonInput
        label="Network"
        className="w-full"
        value={network}
        onChange={(e) => setNetwork(e)}
        placeholder="Paste your network here"
        validationError="Invalid JSON"
        autosize
        minRows={4}
        formatOnBlur
        classNames={{ input: "w-full" }} // Apply Tailwind's w-full class to the input element
      />
      <Button
        onClick={() =>
          populateNetwork({ populatedNetworks: JSON.parse(network) })
        }
      >
        Populate
      </Button>
    </div>
  );
}
