import Link from "next/link";
import { notFound } from "next/navigation";
import { getMode, MODES } from "@/lib/modes";

export default async function ModeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ modeId: string }>;
}) {
  const { modeId } = await params;
  if (!getMode(modeId)) notFound();

  return (
    <div className="flex w-full flex-1">
      <aside className="w-44  gap-1 border-r border-black/[.08] px-3 py-8 dark:border-white/[.145]">
        {MODES.map((m) => (
          <Link
            key={m.id}
            href={`/mode/${m.id}`}
            className={
              m.id === modeId
                ? "flex rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background"
                : "flex rounded-full px-4 py-2 text-sm font-medium text-black/70 transition-colors hover:bg-black/[.04] dark:text-white/70 dark:hover:bg-[#1a1a1a]"
            }
          >
            {m.label}
          </Link>
        ))}
      </aside>

      <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        {children}
      </div>
    </div>
  );
}
