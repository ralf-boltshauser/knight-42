"use client";

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Server,
  Shield,
} from "lucide-react";
import { useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";

// Mock data

const assignedHosts = [
  {
    id: "host1",
    name: "Web Server",
    status: "Healthy",
    lastChecked: "2024-11-24T10:00:00Z",
  },
  {
    id: "host2",
    name: "Database Server",
    status: "Warning",
    lastChecked: "2024-11-24T09:30:00Z",
  },
  {
    id: "host3",
    name: "Application Server",
    status: "Critical",
    lastChecked: "2024-11-24T11:00:00Z",
  },
];

const initialAlerts = [
  {
    id: "alert1",
    name: "Suspicious Login Attempt",
    status: "New",
    priority: "High",
    timestamp: "2024-11-24T10:30:00Z",
  },
  {
    id: "alert2",
    name: "Unusual Network Traffic",
    status: "In Progress",
    priority: "Medium",
    timestamp: "2024-11-24T09:45:00Z",
  },
  {
    id: "alert3",
    name: "Failed System Update",
    status: "Resolved",
    priority: "Low",
    timestamp: "2024-11-24T08:15:00Z",
  },
];

const initialResponseActions = [
  {
    id: "action1",
    name: "Block Suspicious IP",
    status: "Pending",
    assignedHost: "Web Server",
    timestamp: "2024-11-24T10:35:00Z",
  },
  {
    id: "action2",
    name: "Investigate Network Logs",
    status: "In Progress",
    assignedHost: "Database Server",
    timestamp: "2024-11-24T09:50:00Z",
  },
  {
    id: "action3",
    name: "Apply Security Patch",
    status: "Completed",
    assignedHost: "Application Server",
    timestamp: "2024-11-24T11:05:00Z",
  },
];

export default function UserDashboard() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [responseActions, setResponseActions] = useState(
    initialResponseActions
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Healthy":
      case "Resolved":
      case "Completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "Warning":
      case "In Progress":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "Critical":
      case "New":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (result.type === "alert") {
      const newAlerts = Array.from(alerts);
      const [reorderedItem] = newAlerts.splice(source.index, 1);
      newAlerts.splice(destination.index, 0, reorderedItem);

      setAlerts(newAlerts);
    } else if (result.type === "action") {
      const newActions = Array.from(responseActions);
      const [reorderedItem] = newActions.splice(source.index, 1);
      newActions.splice(destination.index, 0, reorderedItem);

      setResponseActions(newActions);
    }
  };

  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
            <Progress value={33} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Response Actions
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{responseActions.length}</div>
            <p className="text-xs text-muted-foreground">+1 from yesterday</p>
            <Progress value={66} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Assigned Hosts
            </CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignedHosts.length}</div>
            <p className="text-xs text-muted-foreground">
              No change from last month
            </p>
            <Progress value={100} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="actions">Response Actions</TabsTrigger>
          <TabsTrigger value="hosts">Assigned Hosts</TabsTrigger>
        </TabsList>
        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>
                Drag and drop to reorder or update status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="alerts" type="alert">
                  {(provided: any) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {alerts.map((alert, index) => (
                        <Draggable
                          key={alert.id}
                          draggableId={alert.id}
                          index={index}
                        >
                          {(provided: any) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-2"
                            >
                              <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                  <CardTitle className="text-sm font-medium">
                                    {alert.name}
                                  </CardTitle>
                                  <Badge
                                    variant="secondary"
                                    className={getPriorityColor(alert.priority)}
                                  >
                                    {alert.priority}
                                  </Badge>
                                </CardHeader>
                                <CardContent>
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-2">
                                      {getStatusIcon(alert.status)}
                                      <span className="text-sm text-muted-foreground">
                                        {alert.status}
                                      </span>
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                      {format(
                                        new Date(alert.timestamp),
                                        "MMM d, HH:mm"
                                      )}
                                    </span>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="actions">
          <Card>
            <CardHeader>
              <CardTitle>Response Actions</CardTitle>
              <CardDescription>
                Drag and drop to reorder or update status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="actions" type="action">
                  {(provided: any) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {responseActions.map((action, index) => (
                        <Draggable
                          key={action.id}
                          draggableId={action.id}
                          index={index}
                        >
                          {(provided: any) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-2"
                            >
                              <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                  <CardTitle className="text-sm font-medium">
                                    {action.name}
                                  </CardTitle>
                                  <Badge variant="outline">
                                    {action.assignedHost}
                                  </Badge>
                                </CardHeader>
                                <CardContent>
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-2">
                                      {getStatusIcon(action.status)}
                                      <span className="text-sm text-muted-foreground">
                                        {action.status}
                                      </span>
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                      {format(
                                        new Date(action.timestamp),
                                        "MMM d, HH:mm"
                                      )}
                                    </span>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="hosts">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Hosts</CardTitle>
              <CardDescription>
                Overview of your assigned hosts and their current status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignedHosts.map((host) => (
                  <Card key={host.id}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {host.name}
                      </CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Run Diagnostics</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Update Status</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(host.status)}
                          <span className="text-sm font-medium">
                            {host.status}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          Last checked:{" "}
                          {format(new Date(host.lastChecked), "MMM d, HH:mm")}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
