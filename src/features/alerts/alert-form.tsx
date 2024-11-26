"use client";

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
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertStatus, AlertType, DetectionSource } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import "react-quill/dist/quill.snow.css";
import { z } from "zod";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import ReactQuill from "react-quill";
import { toast } from "sonner";
import { getTeamMembers } from "../team/team-actions";
import { createAlert, getAlertCategories, getAssets } from "./alert-actions";
import { AlertSchema } from "./alert-schema";

export function AlertForm() {
  const { data: session } = useSession();
  const queryParams = useSearchParams();
  const assetId = queryParams.get("assetId");
  const form = useForm<z.infer<typeof AlertSchema>>({
    resolver: zodResolver(AlertSchema),
    defaultValues: {
      name: "",
      type: "ALERT",
      startDateTime: new Date(),
      endDateTime: null,
      assets: assetId ? [assetId] : [],
      detectionSource: "OTHER",
      categoryId: undefined,
      status: "INITIAL_INVESTIGATION",
      description: "",
      relatedIOCs: [],
      attackChainId: null,
      responseActions: [],
      assignedInvestigatorId: session?.user.dbId,
    },
  });

  const { data: teamMembers } = useQuery({
    queryKey: ["teamMembers"],
    queryFn: () => getTeamMembers(),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getAlertCategories(),
  });

  const { data: assets } = useQuery({
    queryKey: ["assets"],
    queryFn: () => getAssets(),
  });
  useEffect(() => {
    if (
      form.getValues("assets")?.length == 0 ||
      form.getValues("categoryId") == null ||
      form.getValues("name").length > 0
    ) {
      return;
    }

    form.setValue(
      "name",
      `${
        categories?.find((c) => c.id === form.getValues().categoryId)?.name
      } - ${assets?.find((a) => a.id === form.getValues("assets")?.[0])?.name}`
    );
  }, [form, assets, categories]);

  function onSubmit(values: z.infer<typeof AlertSchema>) {
    toast.success("Alert created successfully");
    createAlert(values);
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Assets */}
        <FormField
          control={form.control}
          name="assets"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assets</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => field.onChange([value])}
                  defaultValue={field.value?.[0]}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select affected assets" />
                  </SelectTrigger>
                  <SelectContent>
                    {assets?.map((asset) => (
                      <SelectItem key={asset.id} value={asset.id}>
                        {asset.type} - {asset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Alert name" {...field} />
              </FormControl>
              <FormDescription>
                Give this alert a descriptive name
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Start Date */}
        <FormField
          control={form.control}
          name="startDateTime"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Date & Time</FormLabel>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        const currentTime = field.value || new Date();
                        date?.setHours(currentTime.getHours());
                        date?.setMinutes(currentTime.getMinutes());
                        field.onChange(date);
                      }}
                      disabled={(date: Date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Input
                  type="time"
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(":");
                    const newDate = new Date(field.value || new Date());
                    newDate.setHours(parseInt(hours));
                    newDate.setMinutes(parseInt(minutes));
                    field.onChange(newDate);
                  }}
                  value={field.value ? format(field.value, "HH:mm") : ""}
                  className="w-[150px]"
                />
              </div>
              <FormDescription>
                Select when this alert was first detected
              </FormDescription>
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
                    {Object.entries(AlertType).map(([key, value]) => (
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

        {/* Detection Source */}
        <FormField
          control={form.control}
          name="detectionSource"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Detection Source</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select detection source" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(DetectionSource).map(([key, value]) => (
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

        {/* Status */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(AlertStatus).map(([key, value]) => (
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

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <ReactQuill
                  modules={{
                    toolbar: [
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["bold", "italic", "underline"],
                    ],
                  }}
                  theme="snow"
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Assigned Investigator */}
        <FormField
          control={form.control}
          name="assignedInvestigatorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assigned Investigator</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || undefined}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an investigator" />
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

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
