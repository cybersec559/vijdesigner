import { SiteHeader } from "@/components/site-header";
import { StudioBoard } from "@/components/studio-board";
import { StudioGate } from "@/components/studio-gate";
import { isStudioAuthed, studioConfigured } from "@/lib/studio-auth";

export const dynamic = "force-dynamic";

export default async function StudioPage() {
  const authed = await isStudioAuthed();
  return (
    <>
      <SiteHeader />
      {authed ? <StudioBoard /> : <StudioGate configured={studioConfigured()} />}
    </>
  );
}
