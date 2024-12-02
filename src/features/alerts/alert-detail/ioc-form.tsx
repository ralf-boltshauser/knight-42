"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, IOCType } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createIOC, getIOCs, linkIOCToAlert } from "../alert-actions";
import { IOCSchema } from "./ioc-schema";

export default function IOCDialog({ alert }: { alert?: Alert }) {
  const [linkIOCId, setLinkIOCId] = useState<string | undefined>(undefined);
  const { data: iocs } = useQuery({
    queryKey: ["iocs"],
    queryFn: () => getIOCs(),
  });
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof IOCSchema>>({
    resolver: zodResolver(IOCSchema),
    defaultValues: {
      type: IOCType.MD5,
      value: "",
      dateFirstObserved: new Date(),
      notes: "",
    },
  });

  function onSubmit(values: z.infer<typeof IOCSchema>) {
    toast.success("IOC added successfully");
    createIOC(values, alert?.id);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add IOC
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add IOC</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Link Existing IOC</h3>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="justify-between w-full"
                  >
                    {linkIOCId
                      ? iocs?.find((ioc) => ioc.id === linkIOCId)?.value
                      : "Select existing IOC..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="Search IOCs..." />
                    <CommandList>
                      <CommandEmpty>No IOCs found.</CommandEmpty>
                      <CommandGroup>
                        {iocs?.map((ioc) => (
                          <CommandItem
                            key={ioc.id}
                            value={ioc.type + " " + ioc.value}
                            className="w-full"
                            onSelect={() => {
                              setLinkIOCId(ioc.id);
                            }}
                          >
                            {linkIOCId === ioc.id ? (
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  linkIOCId === ioc.id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            ) : (
                              <Badge variant="outline">{ioc.type}</Badge>
                            )}
                            <span className="text-nowrap">{ioc.value}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <DialogClose asChild>
                <Button
                  onClick={() => {
                    if (linkIOCId && alert?.id) {
                      linkIOCToAlert(linkIOCId, alert.id);
                      toast.success("IOC linked successfully");
                    }
                  }}
                >
                  Link IOC
                </Button>
              </DialogClose>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="font-medium">Create New IOC</h3>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="justify-between w-full"
                            >
                              {field.value || "Select IOC type"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="p-0 w-fit">
                            <Command>
                              <CommandInput placeholder="Search IOC type..." />
                              <CommandList>
                                <CommandEmpty>No IOC type found.</CommandEmpty>
                                <CommandGroup>
                                  {Object.values(IOCType).map((type) => (
                                    <CommandItem
                                      key={type}
                                      value={type}
                                      onSelect={() => {
                                        field.onChange(type);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          field.value === type
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      <span className="text-nowrap">
                                        {type}
                                      </span>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Value</FormLabel>
                      <FormControl>
                        <Input placeholder="IOC value..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Add any notes..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogClose asChild>
                  <Button type="submit">Create IOC</Button>
                </DialogClose>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
