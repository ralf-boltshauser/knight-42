import { getAttackChain } from "@/features/attack-chains/attack-chain-actions";
import AttackChainDetail from "@/features/attack-chains/attack-chain-detail/attack-chain-detail";
import { notFound } from "next/navigation";

export default async function AttackChainDetailPage({
  params: { attackChainId },
}: {
  params: { attackChainId: string };
}) {
  const attackChain = await getAttackChain(attackChainId);
  if (!attackChain) {
    notFound();
  }
  return <AttackChainDetail attackChain={attackChain} />;
}
