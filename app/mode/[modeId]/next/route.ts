import { NextResponse, type NextRequest } from "next/server";
import { getMode, randomForMode } from "@/lib/modes";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ modeId: string }> },
) {
  const { modeId } = await params;
  const mode = getMode(modeId);
  if (!mode) {
    return NextResponse.json({ error: "Unknown mode" }, { status: 404 });
  }

  const excludeParam = request.nextUrl.searchParams.get("exclude");
  const exclude = excludeParam ? Number(excludeParam) : undefined;

  return NextResponse.json({ number: randomForMode(mode, exclude) });
}
