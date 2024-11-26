"use client";

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "sonner";
import { z } from "zod";
import { getTechniques } from "../alerts/alert-actions";
import {
  createThreatActor,
  getRemainingAttackChains,
} from "./threat-actor-actions";
import { ThreatActorSchema } from "./threat-actor-schema";

export default function ThreatActorForm() {
  const { data: attackChains } = useQuery({
    queryKey: ["attackChains"],
    queryFn: () => getRemainingAttackChains(),
  });

  const { data: techniques } = useQuery({
    queryKey: ["techniques"],
    queryFn: () => getTechniques(),
  });

  const form = useForm<z.infer<typeof ThreatActorSchema>>({
    resolver: zodResolver(ThreatActorSchema),
    defaultValues: {
      name: "",
      notes: "",
      techniques: [],
      linkedAttackChains: [],
    },
  });

  async function onSubmit(values: z.infer<typeof ThreatActorSchema>) {
    toast.success("Threat Actor created successfully");
    await createThreatActor(values);
    form.reset();
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
                <Input placeholder="Threat Actor name" {...field} />
              </FormControl>
              <FormDescription>
                Give this threat actor a descriptive name
              </FormDescription>
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

        <FormField
          control={form.control}
          name="techniques"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Techniques</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? field.value
                            .map((technique) => {
                              const t = techniques?.find(
                                (t) => t.id === technique
                              );
                              return t
                                ? `${t.ttpIdentifier} - ${t.name}`
                                : technique;
                            })
                            .join(", ")
                        : "Select techniques"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search techniques..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No framework found.</CommandEmpty>
                      <CommandGroup>
                        {techniques?.map((technique) => (
                          <CommandItem
                            value={`${technique.ttpIdentifier}-${technique.name}`}
                            key={`${technique.ttpIdentifier}-${technique.name}`}
                            onSelect={() => {
                              form.setValue("techniques", [
                                ...(field.value || []),
                                technique.id,
                              ]);
                            }}
                          >
                            {technique.ttpIdentifier} - {technique.name}
                            <Check
                              className={cn(
                                "ml-auto",
                                field.value?.includes(technique.id)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                Select the techniques that are associated with this threat
                actor.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="linkedAttackChains"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Attack Chains</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "justify-between",
                        !field.value?.length && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? field.value
                            .map((chainId) => {
                              const chain = attackChains?.find(
                                (c) => c.id === chainId
                              );
                              return chain ? chain.name : chainId;
                            })
                            .join(", ")
                        : "Select attack chains"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search attack chains..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No attack chains found.</CommandEmpty>
                      <CommandGroup>
                        {attackChains?.map((chain) => (
                          <CommandItem
                            value={chain.name}
                            key={chain.id}
                            onSelect={() => {
                              form.setValue("linkedAttackChains", [
                                ...(field.value || []),
                                chain.id,
                              ]);
                            }}
                          >
                            {chain.name}
                            <Check
                              className={cn(
                                "ml-auto",
                                field.value?.includes(chain.id)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                Select the attack chains that are associated with this threat
                actor.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
