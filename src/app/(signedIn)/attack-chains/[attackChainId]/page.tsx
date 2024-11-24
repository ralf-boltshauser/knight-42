import { getAttackChain } from "@/features/attack-chains/attack-chain-actions";
import AttackChainDetail from "@/features/attack-chains/attack-chain-detail/attack-chain-detail";
import { PopulatedAttackChain } from "@/types/attack-chain";

export default async function AttackChainDetailPage({
  params: { attackChainId },
}: {
  params: { attackChainId: string };
}) {
  const attackChain = await getAttackChain(attackChainId);
  return (
    <AttackChainDetail attackChain={attackChain as PopulatedAttackChain} />
  );
}
