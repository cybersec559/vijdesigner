import { site } from "@/site.config";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function publicContactEmail(): string | undefined {
  const candidates = [process.env.CONTACT_EMAIL, site.contactEmail];
  for (const candidate of candidates) {
    const email = candidate?.trim();
    if (email && emailPattern.test(email)) {
      return email;
    }
  }
  return undefined;
}
