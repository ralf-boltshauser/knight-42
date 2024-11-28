"use client";

import { JsonInput } from "@mantine/core";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { AssetCriticality, AssetType, AssetVisibility } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { toast } from "sonner";
import IdentifierSelectorDialog from "../network-map/identifier-selector";
import { getNetworks } from "../network-map/network-actions";
import { getTeamMembers } from "../team/team-actions";
import { createAsset, updateAsset } from "./asset-actions";
import { AssetSchema } from "./asset-schema";

export function AssetForm({
  defaultValues,
}: {
  defaultValues?: z.infer<typeof AssetSchema>;
}) {
  const form = useForm<z.infer<typeof AssetSchema>>({
    mode: "onChange",
    resolver: zodResolver(AssetSchema),
    defaultValues: defaultValues
      ? {
          ...defaultValues,
          metadata: JSON.stringify(defaultValues.metadata),
        }
      : {
          name: "",
          identifier: "",
          visibility: "NONE",
          type: "WINDOWS_WORKSTATION",
          criticality: "LOW",
          assignedTeamMemberId: null,
          networkId: null,
          metadata: JSON.stringify({ IP: "", OS: "" }),
        },
  });

  const { data: teamMembers } = useQuery({
    queryKey: ["teamMembers"],
    queryFn: () => getTeamMembers(),
  });

  const { data: networks } = useQuery({
    queryKey: ["networks"],
    queryFn: () => getNetworks(),
  });

  // when ip is set check all network ip ranges if it belongs to any of them and set the network id accordingly
  // useEffect(() => {
  //   console.log(form.getValues("metadata"));
  //   console.log(
  //     form.getValues("metadata").IP,
  //     form.getValues("metadata").IP?.split(".").length
  //   );
  //   const metadata = JSON.parse(form.getValues("metadata"));
  //   console.log(metadata);
  //   if (
  //     metadata &&
  //     metadata.IP &&
  //     metadata.IP.split(".").length == 4 &&
  //     !form.getValues("networkId")
  //   ) {
  //     console.log("net", networks);

  //     const network = networks?.find((network) =>
  //       (() => {
  //         const assetIp = metadata.IP;
  //         const networkRange = network.ipRange;
  //         // Convert IP and range to first 3 octets for /24 comparison
  //         const assetPrefix = assetIp.split(".").slice(0, 3).join(".");
  //         const networkPrefix = networkRange.split(".").slice(0, 3).join(".");
  //         return assetPrefix === networkPrefix;
  //       })()
  //     );
  //     console.log("found network", network);
  //     form.setValue("networkId", network?.id || null);
  //   }
  // }, [form, networks, form.watch("metadata")]);

  // if network changes overwrite ip
  useEffect(() => {
    const metadata = JSON.parse(form.getValues("metadata"));
    const network = networks?.find(
      (network) => network.id === form.getValues("networkId")
    );
    console.log("network", network);
    console.log(metadata);
    const newMeta = JSON.stringify({
      ...metadata,
      IP: network?.ipRange.split("/")[0],
    });
    console.log(newMeta);
    form.setValue("metadata", newMeta);
  }, [form, form.watch("networkId"), networks]);

  async function onSubmit(values: z.infer<typeof AssetSchema>) {
    try {
      values.metadata = JSON.parse(values.metadata);
      if (defaultValues) {
        await updateAsset(values);
        toast.success("Asset updated successfully");
      } else {
        toast.success("Asset created successfully");
        await createAsset(values);
        form.reset();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Workstation 1" {...field} />
              </FormControl>
              <FormDescription>This is the name of the asset.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Identifier */}
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Identifier</FormLabel>
              <FormControl>
                <IdentifierSelectorDialog
                  identifier={field.value || undefined}
                  setIdentifier={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Visibility */}
        <FormField
          control={form.control}
          name="visibility"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Visibility</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(AssetVisibility).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Criticality */}
        <FormField
          control={form.control}
          name="criticality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Criticality</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select criticality" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(AssetCriticality).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Type */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(AssetType).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Network */}
        <FormField
          control={form.control}
          name="networkId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Network</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a network" />
                  </SelectTrigger>
                  <SelectContent>
                    {networks?.map((network) => (
                      <SelectItem key={network.id} value={network.id}>
                        {network.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-2">
          <Label>Host IP</Label>
          <Input
            placeholder="Set ip"
            value={JSON.parse(form.getValues("metadata"))?.IP || ""}
            onChange={(e) => {
              form.setValue(
                "metadata",
                JSON.stringify({
                  ...JSON.parse(form.getValues("metadata")),
                  IP: e.target.value,
                })
              );
              // trigger onchange of metadata
              form.trigger("metadata");
            }}
          />
        </div>

        {/* Assigned Team Member */}
        <FormField
          control={form.control}
          name="assignedTeamMemberId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assigned Team Member</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || undefined}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a team member" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers?.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional information about the asset..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Metadata */}
        <FormField
          control={form.control}
          name="metadata"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Metadata</FormLabel>
              <FormControl>
                <JsonInput
                  label="Your JSON"
                  placeholder="Enter JSON here"
                  validationError="Invalid JSON"
                  formatOnBlur
                  value={field.value}
                  className="w-full"
                  onChange={field.onChange}
                  autosize
                  minRows={4}
                  classNames={{ input: "w-full" }} // Apply Tailwind's w-full class to the input element
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!defaultValues ? (
          <DialogClose asChild>
            <Button type="submit">Submit</Button>
          </DialogClose>
        ) : (
          <Button type="submit">Update</Button>
        )}
      </form>
    </Form>
  );
}
