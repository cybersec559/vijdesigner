import Image from "next/image";

const files = {
  light: "/brand/vjm-logo-light.png",
  dark: "/brand/vjm-logo-dark.png",
} as const;

export function Logo({
  tone = "light",
  className = "h-16 w-auto",
}: {
  tone?: keyof typeof files;
  className?: string;
}) {
  return (
    <Image
      src={files[tone]}
      alt="VJM Design"
      width={860}
      height={628}
      className={className}
      priority
    />
  );
}
