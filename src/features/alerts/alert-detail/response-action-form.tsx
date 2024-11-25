"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
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
import { PopulatedAlert } from "@/types/alert";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResponseActionStatus, ResponseActionType } from "@prisma/client";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createResponseAction } from "../alert-actions";
import { ResponseActionSchema } from "./response-action-schema";
export default function ResponseActionForm({
  alert,
}: {
  alert: PopulatedAlert;
}) {
  const form = useForm<z.infer<typeof ResponseActionSchema>>({
    resolver: zodResolver(ResponseActionSchema),
    defaultValues: {
      name: "",
      actionType: "OTHER",
      status: ResponseActionStatus.OUTSTANDING,
      dateTime: new Date(),
      description: "",
      affectedAssetId: "",
      relatedIOCId: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof ResponseActionSchema>) {
    toast.success("Response action added successfully");
    createResponseAction(
      values,
      alert.id,
      values.affectedAssetId || alert.assets[0].id,
      alert.assignedInvestigator?.id
    );
    form.reset();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Response Action
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Response Action</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Action name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="actionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select action type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(ResponseActionType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* related iocs */}
            <FormField
              control={form.control}
              name="relatedIOCId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Related IOCs</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select related IOC" />
                      </SelectTrigger>
                      <SelectContent>
                        {alert.relatedIOCs.map((ioc) => (
                          <SelectItem key={ioc.id} value={ioc.id}>
                            {ioc.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            {alert.assets.length > 1 && (
              <FormField
                control={form.control}
                name="affectedAssetId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Affected Asset</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select affected asset" />
                        </SelectTrigger>
                        <SelectContent>
                          {alert.assets.map((asset) => (
                            <SelectItem key={asset.id} value={asset.id}>
                              {asset.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add description..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogClose asChild>
              <Button type="submit">Add Response Action</Button>
            </DialogClose>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
