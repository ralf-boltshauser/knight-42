import {
  getAlerts,
  getAttackChain,
} from "@/features/attack-chains/attack-chain-actions";
import AttackChainDetail from "@/features/attack-chains/attack-chain-detail/attack-chain-detail";
import { notFound } from "next/navigation";

export default async function AttackChainDetailPage({
  params: { attackChainId },
}: {
  params: { attackChainId: string };
}) {
  const attackChain = await getAttackChain(attackChainId);
  const alerts = await getAlerts();
  if (!attackChain || !alerts) {
    notFound();
  }
  return <AttackChainDetail attackChain={attackChain} alerts={alerts} />;
}
