"use client";

import dynamic from "next/dynamic";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";

function EmptyAssetList() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [copiedText, copy] = useCopyToClipboard();

  const handleCopy = (text: string) => {
    copy(text)
      .then(() => {
        toast.success("Copied to clipboard");
      })
      .catch((error) => {
        console.error("Failed to copy!", error);
      });
  };
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8 border-2 border-dashed rounded-lg">
      <div className="text-lg font-medium text-muted-foreground">
        No assets found
      </div>
      <p className="text-sm text-muted-foreground max-w-md text-center">
        Get started by adding assets using one of the available agents below:
      </p>
      <div className="space-y-4 w-full max-w-4xl">
        <div className="space-y-2">
          <div className="font-medium">Linux Agent</div>
          <div className="relative">
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
              <code>
                curl -sSL
                https://raw.githubusercontent.com/ralf-boltshauser/knight-42/refs/heads/main/agents/linux-agent.sh
                | bash -s -- -h {window.location.hostname}
              </code>
            </pre>
          </div>
        </div>
        <div className="space-y-2">
          <div className="font-medium">Windows Agent</div>
          <div className="relative">
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
              <code>
                Invoke-WebRequest -Uri
                https://raw.githubusercontent.com/ralf-boltshauser/knight-42/refs/heads/main/agents/windows-agent.ps1
                -OutFile windows-agent.ps1; .\windows-agent.ps1 -TargetIP
                {window.location.hostname}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(EmptyAssetList), {
  ssr: false,
});
