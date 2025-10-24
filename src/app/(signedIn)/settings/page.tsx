import PopulateNetwork from "@/features/settings/populate-network";
import SSHConfig from "@/features/settings/ssh-config";

export default async function SettingsPage() {
  return (
    <div>
      <SSHConfig />
      <PopulateNetwork />
    </div>
  );
}
