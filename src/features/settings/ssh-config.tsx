import { prisma } from "@/lib/client";
import { JsonObject } from "@prisma/client/runtime/library";

export default async function SSHConfig() {
  const assets = await prisma.asset.findMany();

  const config = assets
    .map((asset) => {
      const metadata = asset.metadata as JsonObject;
      if (!metadata || !metadata.IP || !metadata.username) return null;
      return {
        identifier: asset.identifier,
        host: metadata.IP,
        user: metadata.username,
        identityFile: "~/.ssh/common_identity_file",
      };
    })
    .filter((c) => c !== null) as {
    identifier: string;
    host: string;
    user: string;
    identityFile: string;
  }[];

  return (
    <div>
      <h1 className="text-2xl font-bold">SSH Config</h1>
      <pre className="rounded-lg bg-slate-200 p-4 text-sm text-slate-800 font-mono my-3">
        {config
          .map(
            (c) => `Host ${c.identifier}
    HostName ${c.host}
    User ${c.user}
    IdentityFile ${c.identityFile}`
          )
          .join("\n\n")}
      </pre>
      <div>
        <p>
          To get a shared ssh config ensure that <strong>IP</strong> and
          <strong> username</strong> are added to the metadata!
        </p>
      </div>
    </div>
  );
}
