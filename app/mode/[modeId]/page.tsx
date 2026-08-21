import { notFound } from "next/navigation";
import { getMode, randomForMode } from "@/lib/modes";
import NumberGame from "@/app/number-game";

export default async function ModePage({
  params,
}: {
  params: Promise<{ modeId: string }>;
}) {
  const { modeId } = await params;
  const mode = getMode(modeId);
  if (!mode) notFound();

  return (
    <NumberGame
      modeId={modeId}
      initialNumber={randomForMode(mode)}
      key={modeId}
    />
  );
}
