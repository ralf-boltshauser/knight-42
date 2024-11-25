"use client";

import { Badge } from "@/components/ui/badge";
import "react-quill/dist/quill.snow.css";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { PopulatedAlert } from "@/types/alert";
import { AlertStatus, AlertType, User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  Edit2,
  Save,
} from "lucide-react";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { updateAlert } from "../alert-actions";
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
        description: `IOC added: ${ioc.type.name} ${ioc.value}`,
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

  const [tab, setTab] = useQueryState("tab", { defaultValue: "assets" });

  const { data: teamMembers } = useQuery({
    queryKey: ["teamMembers"],
    queryFn: () => getTeamMembers(),
  });

  useEffect(() => {
    setEditedAlert(alertData);
  }, [alertData]);

  useEffect(() => {
    console.log("alert changed");
    setAlertData({
      ...alert,
      timeline: [
        ...alert.relatedIOCs.map((ioc) => ({
          id: ioc.id,
          type: "IOC_ADDED",
          description: `IOC added: ${ioc.type.name} ${ioc.value}`,
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
    console.log("Saving updated alert:", editedAlert);
    updateAlert({
      id: editedAlert.id,
      name: editedAlert.name,
      categoryId: editedAlert.categoryId,
      type: editedAlert.type,
      assignedInvestigatorId: editedAlert.assignedInvestigatorId || undefined,
      status: editedAlert.status,
      description: editedAlert.description,
      endDateTime: editedAlert.endDateTime || undefined,
      detectionSource: editedAlert.detectionSource,
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

  return (
    <div className="">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Alert Details</h1>
        {isEditing ? (
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        ) : (
          <Button onClick={handleEdit}>
            <Edit2 className="mr-2 h-4 w-4" /> Edit Alert
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
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
              {isEditing ? (
                <Select
                  onValueChange={(value) =>
                    setEditedAlert({ ...editedAlert, type: value as AlertType })
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
            </div>
            <div className="flex items-center space-x-2">
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
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                {isEditing ? (
                  <ReactQuill
                    modules={{
                      toolbar: [
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["bold", "italic", "underline"],
                      ],
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
                  console.log("value", value);
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
                          <CardDescription>{ioc.type.name}</CardDescription>
                          <Badge variant={"outline"}> {ioc.value}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          First observed:{" "}
                          {format(
                            new Date(ioc.dateFirstObserved),
                            "MMM d, yyyy HH:mm"
                          )}
                        </p>
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
                    {editedAlert.timeline.map((event, index) => (
                      <div
                        key={event.id}
                        className="flex items-center space-x-4"
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-lg font-semibold text-primary">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-grow">
                          <p className="font-medium">{event.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(
                              new Date(event.timestamp),
                              "MMM d, yyyy HH:mm"
                            )}
                          </p>
                        </div>
                      </div>
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
