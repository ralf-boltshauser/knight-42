"use client";

import { ArrowLeft, Bell, Link, Server, Shield, Skull } from "lucide-react";
import * as React from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { useQuery } from "@tanstack/react-query";
import {
  getAlerts,
  getAssets,
  getAttackChains,
  getResponseActions,
  getThreatActors,
} from "./cmd-k-actions";

enum CmdMode {
  Menu = "menu",
  Alerts = "alerts",
  Assets = "assets",
  ResponseActions = "response-actions",
  ThreatActors = "threat-actors",
  AttackChains = "attack-chains",
}

export function CmdK() {
  const [open, setOpen] = React.useState(false);

  const { data: alerts, refetch: refetchAlerts } = useQuery({
    queryKey: ["alerts"],
    queryFn: () => getAlerts(),
    enabled: false,
  });

  const { data: assets, refetch: refetchAssets } = useQuery({
    queryKey: ["assets"],
    queryFn: () => getAssets(),
    enabled: false,
  });

  const { data: responseActions, refetch: refetchResponseActions } = useQuery({
    queryKey: ["responseActions"],
    queryFn: () => getResponseActions(),
    enabled: false,
  });

  const { data: threatActors, refetch: refetchThreatActors } = useQuery({
    queryKey: ["threatActors"],
    queryFn: () => getThreatActors(),
    enabled: false,
  });

  const { data: attackChains, refetch: refetchAttackChains } = useQuery({
    queryKey: ["attackChains"],
    queryFn: () => getAttackChains(),
    enabled: false,
  });

  const [mode, setMode] = React.useState<CmdMode>(CmdMode.Menu);

  const [modifier, setModifier] = React.useState<"shift" | "ctrl" | null>(null);
  const [cmdInput, setCmdInput] = React.useState("");

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
        if (!open) {
          refetchAlerts();
          refetchAssets();
          refetchResponseActions();
          refetchThreatActors();
          refetchAttackChains();
        }
      }

      if (open) {
        if (e.key === "Backspace" && cmdInput.length === 0) {
          setMode(CmdMode.Menu);
        }

        if (e.metaKey || e.ctrlKey) {
          setModifier("ctrl");
        } else if (e.shiftKey) {
          setModifier("shift");
        }
      }
    };

    const up = (e: KeyboardEvent) => {
      if (!e.metaKey && !e.ctrlKey && !e.shiftKey) {
        setModifier(null);
      }
    };

    document.addEventListener("keydown", down);
    document.addEventListener("keyup", up);
    return () => {
      document.removeEventListener("keydown", down);
      document.removeEventListener("keyup", up);
    };
  }, [setModifier, setMode, cmdInput, open]);

  const handleSetMode = (mode: CmdMode) => {
    setMode(mode);
    setCmdInput("");
  };

  const handleNavigate = (url: string) => {
    setOpen(false);
    if (modifier === "shift") {
      window.open(url, "_blank");
    } else {
      window.location.href = url;
    }
  };

  return (
    <>
      <p className="text-sm text-muted-foreground">
        Press{" "}
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>J
        </kbd>
      </p>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Type a command or search..."
          value={cmdInput}
          onValueChange={(value) => setCmdInput(value)}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {mode === CmdMode.Menu ? (
            <>
              <CommandGroup heading="Navigation">
                <CommandItem onSelect={() => handleSetMode(CmdMode.Alerts)}>
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Alerts</span>
                </CommandItem>
                <CommandItem onSelect={() => handleSetMode(CmdMode.Assets)}>
                  <Server className="mr-2 h-4 w-4" />
                  <span>Assets</span>
                </CommandItem>
                <CommandItem
                  onSelect={() => handleSetMode(CmdMode.ResponseActions)}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Response Actions</span>
                </CommandItem>
                <CommandItem
                  onSelect={() => handleSetMode(CmdMode.ThreatActors)}
                >
                  <Skull className="mr-2 h-4 w-4" />
                  <span>Threat Actors</span>
                </CommandItem>
                <CommandItem
                  onSelect={() => handleSetMode(CmdMode.AttackChains)}
                >
                  <Link className="mr-2 h-4 w-4" />
                  <span>Attack Chains</span>
                </CommandItem>
              </CommandGroup>
              {/* <CommandSeparator />
              <CommandGroup heading="Settings">
                <CommandItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                  <CommandShortcut>⌘P</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                  <CommandShortcut>⌘S</CommandShortcut>
                </CommandItem>
              </CommandGroup> */}
            </>
          ) : mode === CmdMode.Alerts ? (
            <CommandGroup heading="Alerts">
              {alerts?.map((alert) => (
                <CommandItem
                  key={alert.id}
                  onSelect={() => handleNavigate(`/alerts/${alert.id}`)}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  <span>{alert.name}</span>
                  <CommandShortcut>↵</CommandShortcut>
                </CommandItem>
              ))}
              <CommandItem onSelect={() => handleSetMode(CmdMode.Menu)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                <span>Back to menu</span>
                <CommandShortcut>⌫</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          ) : mode === CmdMode.Assets ? (
            <CommandGroup heading="Assets">
              {assets?.map((asset) => (
                <CommandItem
                  key={asset.id}
                  onSelect={() => handleNavigate(`/assets/${asset.id}`)}
                >
                  <Server className="mr-2 h-4 w-4" />
                  <span>{asset.name}</span>
                  <CommandShortcut>↵</CommandShortcut>
                </CommandItem>
              ))}
              <CommandItem onSelect={() => handleSetMode(CmdMode.Menu)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                <span>Back to menu</span>
                <CommandShortcut>⌫</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          ) : mode === CmdMode.ResponseActions ? (
            <CommandGroup heading="Response Actions">
              {responseActions?.map((action) => (
                <CommandItem
                  key={action.id}
                  onSelect={() =>
                    handleNavigate(
                      `/alerts/${action.relatedIncidentId}?tab=actions`
                    )
                  }
                >
                  <Shield className="mr-2 h-4 w-4" />
                  <span>{action.name}</span>
                  <CommandShortcut>↵</CommandShortcut>
                </CommandItem>
              ))}
              <CommandItem onSelect={() => handleSetMode(CmdMode.Menu)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                <span>Back to menu</span>
                <CommandShortcut>⌫</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          ) : mode === CmdMode.ThreatActors ? (
            <CommandGroup heading="Threat Actors">
              {threatActors?.map((actor) => (
                <CommandItem
                  key={actor.id}
                  onSelect={() => handleNavigate(`/threat-actors/${actor.id}`)}
                >
                  <Skull className="mr-2 h-4 w-4" />
                  <span>{actor.name}</span>
                  <CommandShortcut>↵</CommandShortcut>
                </CommandItem>
              ))}
              <CommandItem onSelect={() => handleSetMode(CmdMode.Menu)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                <span>Back to menu</span>
                <CommandShortcut>⌫</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          ) : mode === CmdMode.AttackChains ? (
            <CommandGroup heading="Attack Chains">
              {attackChains?.map((chain) => (
                <CommandItem
                  key={chain.id}
                  onSelect={() => handleNavigate(`/attack-chains/${chain.id}`)}
                >
                  <Link className="mr-2 h-4 w-4" />
                  <span>{chain.name}</span>
                  <CommandShortcut>↵</CommandShortcut>
                </CommandItem>
              ))}
              <CommandItem onSelect={() => handleSetMode(CmdMode.Menu)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                <span>Back to menu</span>
                <CommandShortcut>⌫</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          ) : null}
        </CommandList>
      </CommandDialog>
    </>
  );
}
