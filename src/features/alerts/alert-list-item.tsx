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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { PopulatedAlert } from "@/types/alert";
import {
  getActionStatusColor,
  getAlertTypeColor,
  getStatusIcon,
} from "@/types/alert-types";
import { format } from "date-fns";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";

export default function AlertListItem({ alert }: { alert: PopulatedAlert }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [copy, copyText] = useCopyToClipboard();
  const handleCopy = (text: string) => {
    copyText(text);
    toast.success("Copied to clipboard");
  };
  return (
    <Card
      key={alert.id}
      className="hover:shadow-lg transition-shadow duration-200"
    >
      <Collapsible>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon(alert.status)}
                <CardTitle className="text-xl">{alert.name}</CardTitle>
              </div>
              <Badge
                variant="secondary"
                className={getAlertTypeColor(alert.type)}
              >
                {alert.type}
              </Badge>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardDescription className="px-6">
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: alert.description }}
            ></div>
          </CardDescription>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Start Time
                </p>
                <p className="font-medium">
                  {format(new Date(alert.startDateTime), "MMM d, yyyy HH:mm")}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  End Time
                </p>
                <p className="font-medium">
                  {alert.endDateTime
                    ? format(new Date(alert.endDateTime), "MMM d, yyyy HH:mm")
                    : "Ongoing"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Detection Source
                </p>
                <p className="font-medium">{alert.detectionSource}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Category
                </p>
                <p className="font-medium">{alert.category.name}</p>
              </div>
            </div>

            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm" className="mb-2">
                  View IOCs ({alert.relatedIOCs.length})
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="grid gap-2 mt-2">
                  {alert.relatedIOCs.length == 0 ? (
                    <span className="text-sm text-muted-foreground">
                      No IOCs found
                    </span>
                  ) : (
                    alert.relatedIOCs.map((ioc) => (
                      <div
                        key={ioc.id}
                        className="flex items-center justify-between p-2 bg-muted rounded-md"
                      >
                        <div
                          className="flex items-center"
                          onClick={() => handleCopy(ioc.value)}
                        >
                          <Badge variant="outline" className="mr-2">
                            {ioc.type.name}
                          </Badge>
                          <span className="text-sm font-medium truncate">
                            {ioc.value}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {format(
                            new Date(ioc.dateFirstObserved),
                            "MMM d, yyyy HH:mm"
                          )}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible className="mt-4">
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm" className="mb-2">
                  View Response Actions ({alert.responseActions.length})
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="grid gap-2 mt-2">
                  {alert.responseActions.length == 0 ? (
                    <span className="text-sm text-muted-foreground">
                      No response actions assigned
                    </span>
                  ) : (
                    alert.responseActions.map((action, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-muted rounded-md"
                      >
                        <span className="font-medium">{action.name}</span>
                        <Badge
                          variant="secondary"
                          className={getActionStatusColor(action.status)}
                        >
                          {action.status}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {alert.assets.map((asset) => (
                  <Link href={`/assets/${asset.id}`} key={asset.id}>
                    <Badge variant="secondary">{asset.name}</Badge>
                  </Link>
                ))}
              </div>
              <div className="flex items-center space-x-4">
                {alert.assignedInvestigator && (
                  <span className="text-sm text-muted-foreground">
                    Assigned to: {alert.assignedInvestigator.name}
                  </span>
                )}
                <Link href={`/alerts/${alert.id}`}>
                  <Button variant="ghost" size="icon">
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">View details</span>
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
