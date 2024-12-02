"use client";
import Link from "next/link";
import React from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTeamMembers } from "@/features/team/team-actions";
import { quillToolbar } from "@/lib/quill-toolbar";
import { cn } from "@/lib/utils";
import { PopulatedAlert } from "@/types/alert";
import { AlertStatus, AlertType, ReportStatus, User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  AlertCircle,
  AlertTriangle,
  Check,
  CheckCircle,
  ChevronsUpDown,
  Clock,
  LinkIcon,
  Save,
} from "lucide-react";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "sonner";
import { deleteIOC, getTechniques, updateAlert } from "../alert-actions";
import { createMispEvent, createMispEventIOC } from "../misp-actions";
import AddRelatedAssetDialog from "./add-related-asset-dialog";
import IOCDialog from "./ioc-form";
import ResponseActionForm from "./response-action-form";
import ResponseActionItem from "./response-action-item";

// Mock data for the alert

export default function AlertDetail({ alert }: { alert: PopulatedAlert }) {
  const [alertData, setAlertData] = useState({
    ...alert,
    timeline: [
      ...alert.relatedIOCs.map((ioc) => ({
        id: ioc.id,
        type: "IOC_ADDED",
        description: `IOC added: ${ioc.type} ${ioc.value}`,
        timestamp: ioc.dateFirstObserved,
      })),
      ...alert.responseActions.map((action) => ({
        id: action.id,
        type: "ACTION_TAKEN",
        description: action.name,
        timestamp: action.createdAt,
      })),
      {
        id: "event1",
        type: "ALERT_CREATED",
        description: "Alert created",
        timestamp: alert.createdAt,
      },
    ].toSorted((a, b) => a.timestamp.getTime() - b.timestamp.getTime()),
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedAlert, setEditedAlert] = useState(alertData);
  const { data: techniques } = useQuery({
    queryKey: ["techniques"],
    queryFn: () => getTechniques(),
  });

  useHotkeys("e", () => {
    if (!isEditing) {
      handleEdit();
    } else {
      handleSave();
    }
  });

  const [tab, setTab] = useQueryState("tab", { defaultValue: "assets" });

  const { data: teamMembers } = useQuery({
    queryKey: ["teamMembers"],
    queryFn: () => getTeamMembers(),
  });

  useEffect(() => {
    setEditedAlert(alertData);
  }, [alertData]);

  useEffect(() => {
    setAlertData({
      ...alert,
      timeline: [
        ...alert.relatedIOCs.map((ioc) => ({
          id: ioc.id,
          type: "IOC_ADDED",
          description: `IOC added: ${ioc.type} ${ioc.value}`,
          timestamp: ioc.dateFirstObserved,
        })),
        ...alert.responseActions.map((action) => ({
          id: action.id,
          type: "ACTION_TAKEN",
          description: action.name,
          timestamp: action.createdAt,
        })),
        {
          id: "event1",
          type: "ALERT_CREATED",
          description: "Alert created",
          timestamp: alert.createdAt,
        },
      ].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()),
    });
  }, [alert]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "INITIAL_INVESTIGATION":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "ESCALATED":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
    }
  };

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case "ALERT":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "INCIDENT":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically send the updated data to your backend
    updateAlert({
      id: editedAlert.id,
      ...(editedAlert.name !== alert.name && { name: editedAlert.name }),
      ...(editedAlert.categoryId !== alert.categoryId && {
        categoryId: editedAlert.categoryId,
      }),
      ...(editedAlert.type !== alert.type && { type: editedAlert.type }),
      ...(editedAlert.assignedInvestigatorId !==
        alert.assignedInvestigatorId && {
        assignedInvestigatorId: editedAlert.assignedInvestigatorId || undefined,
      }),
      ...(editedAlert.status !== alert.status && {
        status: editedAlert.status,
      }),
      ...(editedAlert.techniqueId !== alert.techniqueId && {
        techniqueId: editedAlert.techniqueId || undefined,
      }),
      ...(editedAlert.description !== alert.description && {
        description: editedAlert.description,
      }),
      ...(editedAlert.reportStatus !== alert.reportStatus && {
        reportStatus: editedAlert.reportStatus,
      }),
      ...(editedAlert.endDateTime !== alert.endDateTime && {
        endDateTime: editedAlert.endDateTime || undefined,
      }),
      ...(editedAlert.detectionSource !== alert.detectionSource && {
        detectionSource: editedAlert.detectionSource,
      }),
      ...(editedAlert.mispEntryLink !== alert.mispEntryLink && {
        mispEntryLink: editedAlert.mispEntryLink || undefined,
      }),
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditedAlert({ ...editedAlert, [e.target.name]: e.target.value });
  };

  const handleStatusChange = (value: string) => {
    setEditedAlert({ ...editedAlert, status: value as AlertStatus });
  };

  const handleCreateMispEvent = async () => {
    try {
      await createMispEvent(editedAlert);
      toast.success("MISP event created");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Alert Details</h1>
        <div className="flex items-center gap-4">
          {isEditing ? (
            <div>
              <Input
                name="mispLink"
                placeholder="Paste misp link!"
                value={editedAlert.mispEntryLink || ""}
                onChange={(e) =>
                  setEditedAlert({
                    ...editedAlert,
                    mispEntryLink: e.target.value,
                  })
                }
              />
            </div>
          ) : (
            <>
              {editedAlert.mispEntryLink ? (
                <Button variant={"outline"} asChild>
                  <Link href={editedAlert.mispEntryLink} target="_blank">
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Link to MISP
                  </Link>
                </Button>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline">Generate MISP Entry</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Create MISP Event</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will create a new MISP event for this alert. Are
                        you sure you want to continue?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleCreateMispEvent}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </>
          )}
          {isEditing ? (
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          ) : (
            <Button onClick={handleEdit}>
              <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg hidden md:flex">
                e
              </kbd>
              Edit
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center gap-8">
              {isEditing ? (
                <Input
                  name="name"
                  value={editedAlert.name}
                  onChange={handleInputChange}
                  className="text-2xl font-bold"
                />
              ) : (
                <CardTitle className="text-2xl">{editedAlert.name}</CardTitle>
              )}
              <div className="flex items-center gap-4">
                {isEditing ? (
                  <Select
                    onValueChange={(value) =>
                      setEditedAlert({
                        ...editedAlert,
                        type: value as AlertType,
                      })
                    }
                    defaultValue={editedAlert.type}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALERT">Alert</SelectItem>
                      <SelectItem value="INCIDENT">Incident</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge
                    variant="secondary"
                    className={getAlertTypeColor(editedAlert.type)}
                  >
                    {editedAlert.type}
                  </Badge>
                )}
                {isEditing ? (
                  <Select
                    onValueChange={(value) =>
                      setEditedAlert({
                        ...editedAlert,
                        reportStatus: value as ReportStatus,
                      })
                    }
                    defaultValue={editedAlert.reportStatus}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select report status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NEW">New</SelectItem>
                      <SelectItem value="HAD_CHANGES">Had Changes</SelectItem>
                      <SelectItem value="REPORTED_NATIONAL">
                        Reported National
                      </SelectItem>
                      <SelectItem value="REPORTED_INTERNATIONAL">
                        Reported International
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant="secondary">
                    <Link
                      href={`/network-map?datetime=${editedAlert.lastReportAt?.toLocaleString(
                        "en-US",
                        { timeZone: "Europe/Zurich" }
                      )}&playbackType=PAUSE`}
                    >
                      {editedAlert.reportStatus}
                    </Link>
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4 justify-between">
              <div className="flex flex-row gap-2 items-center">
                <div className="flex items-center gap-2">
                  {getStatusIcon(editedAlert.status)}
                  {isEditing ? (
                    <Select
                      onValueChange={handleStatusChange}
                      defaultValue={editedAlert.status}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(AlertStatus).map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <span>{editedAlert.status}</span>
                  )}
                </div>
                {isEditing ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="justify-between"
                      >
                        {editedAlert.techniqueId
                          ? techniques?.find(
                              (technique) =>
                                technique.id === editedAlert.techniqueId
                            )?.name
                          : "Select technique..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-fit">
                      <Command>
                        <CommandInput placeholder="Search technique..." />
                        <CommandList>
                          <CommandEmpty>No technique found.</CommandEmpty>
                          <CommandGroup>
                            {techniques?.map((technique) => {
                              const value =
                                technique.ttpIdentifier +
                                " - " +
                                technique.name;
                              const parent = techniques?.find(
                                (t) => t.id === technique.parentTechniqueId
                              );
                              return (
                                <CommandItem
                                  key={technique.id}
                                  value={value}
                                  className="w-full"
                                  onSelect={() => {
                                    setEditedAlert({
                                      ...editedAlert,
                                      techniqueId: technique.id,
                                    });
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      editedAlert.techniqueId === technique.id
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  <div className="flex flex-row justify-between items-center gap-1">
                                    {parent ? (
                                      <span className="text-nowrap">
                                        {parent.name} - {technique.name}
                                      </span>
                                    ) : (
                                      <span className="text-nowrap">
                                        {value}
                                      </span>
                                    )}
                                    {technique.threatActors.length > 0 && (
                                      <div className="flex gap-1 flex-wrap">
                                        {technique.threatActors.map((actor) => (
                                          <Badge
                                            key={actor.id}
                                            variant="secondary"
                                            className="bg-red-100 text-red-800 text-xs"
                                          >
                                            {actor.name}
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <span>
                    {editedAlert.techniqueId ? (
                      <span>
                        {(() => {
                          const technique = techniques?.find(
                            (t) => t.id === editedAlert.techniqueId
                          );
                          return technique
                            ? `${technique.ttpIdentifier} - ${technique.name}`
                            : null;
                        })()}
                      </span>
                    ) : (
                      "No technique assigned"
                    )}
                  </span>
                )}
              </div>
              <div className="flex flex-row gap-2 items-center"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                {isEditing ? (
                  <ReactQuill
                    modules={{
                      toolbar: quillToolbar,
                    }}
                    value={editedAlert.description}
                    onChange={(value) =>
                      setEditedAlert({ ...editedAlert, description: value })
                    }
                  />
                ) : (
                  <div
                    className="prose max-w-full"
                    dangerouslySetInnerHTML={{
                      __html: editedAlert.description,
                    }}
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Assigned Investigator
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {isEditing ? (
              <Select
                onValueChange={(value) => {
                  setEditedAlert({
                    ...editedAlert,
                    assignedInvestigatorId: value,
                    assignedInvestigator: teamMembers?.find(
                      (member) => member.id === value
                    ) as User,
                  });
                }}
                value={editedAlert.assignedInvestigatorId || undefined}
              >
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {editedAlert.assignedInvestigator ? (
                      <div className="flex items-center space-x-4">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className=" font-semibold text-primary">
                            {editedAlert.assignedInvestigator?.name?.charAt(0)}
                          </span>
                        </div>
                        <div className="flex flex-row items-center gap-2">
                          <p className="font-medium">
                            {editedAlert.assignedInvestigator.name}
                          </p>
                        </div>
                      </div>
                    ) : (
                      "Select Investigator"
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {teamMembers?.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                        <span>{member.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-semibold text-primary">
                    {editedAlert.assignedInvestigator?.name?.charAt(0)}
                  </span>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <p className="font-medium">
                    {editedAlert.assignedInvestigator?.name}
                  </p>
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col space-y-1.5 p-4 bg-secondary/20 rounded-lg">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                  Start Time
                </Label>
                <p className="text-sm font-semibold">
                  {format(
                    new Date(editedAlert.startDateTime),
                    "MMM d, yyyy HH:mm"
                  )}
                </p>
              </div>
              <div className="flex flex-col space-y-1.5 p-4 bg-secondary/20 rounded-lg">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                  End Time
                </Label>
                <p className="text-sm font-semibold">
                  {editedAlert.endDateTime
                    ? format(
                        new Date(editedAlert.endDateTime),
                        "MMM d, yyyy HH:mm"
                      )
                    : "N/A"}
                </p>
              </div>
              <div className="flex flex-col space-y-1.5 p-4 bg-secondary/20 rounded-lg">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                  Detection Source
                </Label>
                <p className="text-sm font-semibold">
                  {editedAlert.detectionSource}
                </p>
              </div>
              <div className="flex flex-col space-y-1.5 p-4 bg-secondary/20 rounded-lg">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                  Category
                </Label>
                <p className="text-sm font-semibold">
                  {editedAlert.category.name}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="">Alert Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={(v) => setTab(v)}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="assets">Related Assets</TabsTrigger>
                <TabsTrigger value="iocs">IOCs</TabsTrigger>
                <TabsTrigger value="actions">Response Actions</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>
              <TabsContent value="iocs">
                <div className="space-y-4">
                  {editedAlert.relatedIOCs.map((ioc) => (
                    <Card key={ioc.id}>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div className="flex flex-row items-center gap-2">
                          <CardDescription>{ioc.type}</CardDescription>
                          <Badge variant={"outline"}> {ioc.value}</Badge>
                          {ioc.linkedToMisp ? (
                            <Link
                              href={
                                editedAlert.mispEntryLink
                                  ? editedAlert.mispEntryLink
                                  : ""
                              }
                            >
                              <Badge
                                variant="secondary"
                                className="bg-blue-100 text-blue-800"
                              >
                                Linked to MISP
                              </Badge>
                            </Link>
                          ) : (
                            <>
                              {editedAlert.mispEventId && (
                                <Button
                                  variant="outline"
                                  size={"sm"}
                                  onClick={() => {
                                    createMispEventIOC(
                                      editedAlert.id,
                                      editedAlert.mispEventId!,
                                      ioc
                                    );
                                  }}
                                >
                                  Link to Misp
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="text-sm text-muted-foreground">
                            First observed:{" "}
                            {format(
                              new Date(ioc.dateFirstObserved),
                              "MMM d, yyyy HH:mm"
                            )}
                          </p>
                          {!ioc.linkedToMisp ? (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive"
                                >
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete IOC
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this IOC?
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => {
                                      deleteIOC(ioc.id, editedAlert.id);
                                      toast.success("IOC deleted successfully");
                                    }}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          ) : null}
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                  <IOCDialog alert={editedAlert} />
                </div>
              </TabsContent>
              <TabsContent value="actions">
                <div className="space-y-4">
                  {editedAlert.responseActions.map((action) => (
                    <ResponseActionItem
                      key={action.id}
                      responseActionItem={action}
                    />
                  ))}
                  <ResponseActionForm alert={editedAlert} />
                </div>
              </TabsContent>
              <TabsContent value="assets">
                <div className="space-y-4">
                  {editedAlert.assets.map((asset) => (
                    <Card key={asset.id}>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">
                          {asset.name}
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  ))}
                  <AddRelatedAssetDialog alert={editedAlert} />
                </div>
              </TabsContent>
              <TabsContent value="timeline">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {editedAlert.events.map((event, index) => (
                      <React.Fragment key={event.id}>
                        <div
                          className="flex items-center space-x-4"
                          key={event.id + "-event"}
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-lg font-semibold text-primary">
                              {index + 1}
                            </span>
                          </div>
                          <div className="flex-grow">
                            <p className="font-medium">{event.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(
                                new Date(event.createdAt),
                                "MMM d, yyyy HH:mm"
                              )}
                            </p>
                          </div>
                        </div>
                        {editedAlert.lastReportAt &&
                          event.createdAt < editedAlert.lastReportAt &&
                          (editedAlert.events[index + 1] == undefined ||
                            editedAlert.events[index + 1].createdAt >
                              editedAlert.lastReportAt) && (
                            <div
                              className="flex items-center space-x-4"
                              key={event.id + "-last-report"}
                            >
                              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                <span className="text-lg font-semibold text-green-800">
                                  R
                                </span>
                              </div>
                              <div className="flex-grow">
                                <p className="font-medium">Last Report</p>
                                <p className="text-sm text-muted-foreground">
                                  {format(
                                    new Date(editedAlert.lastReportAt!),
                                    "MMM d, yyyy HH:mm"
                                  )}
                                </p>
                              </div>
                            </div>
                          )}
                      </React.Fragment>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
