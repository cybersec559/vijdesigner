import { HomePage } from "@/components/home-page";
import { SiteHeader } from "@/components/site-header";
import { readPieces } from "@/lib/pieces";

export const dynamic = "force-dynamic";

export default async function Page() {
  const pieces = await readPieces();
  return (
    <>
      <SiteHeader overlay />
      <HomePage pieces={pieces} />
    </>
  );
}
