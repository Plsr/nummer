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
      <aside className="flex w-44 flex-col gap-1 border-r-2 border-zinc-300 bg-zinc-50 px-3 py-8 dark:border-zinc-700 dark:bg-black">
        <h2 className="text-lg font-bold">Modes</h2>
        {MODES.map((m) => (
          <Link
            key={m.id}
            href={`/mode/${m.id}`}
            className={
              m.id === modeId
                ? "flex rounded-lg border-2 border-zinc-500 bg-zinc-300 px-4 py-2 text-sm font-bold text-zinc-900 dark:border-zinc-800 dark:bg-zinc-600 dark:text-white"
                : "flex rounded-lg px-4 py-2 text-sm font-bold text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
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
