import { publicContactEmail } from "@/lib/contact";

export function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const email = publicContactEmail();
  const contact = email ? `mailto:${email}` : `${origin}/security`;
  const body = [
    `Contact: ${contact}`,
    "Expires: 2027-10-23T00:00:00.000Z",
    "Preferred-Languages: en",
    `Canonical: ${origin}/.well-known/security.txt`,
    `Policy: ${origin}/security`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
