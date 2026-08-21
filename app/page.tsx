import { redirect } from "next/navigation";
import { DEFAULT_MODE_ID } from "@/lib/modes";

export default function Home() {
  redirect(`/mode/${DEFAULT_MODE_ID}`);
}
