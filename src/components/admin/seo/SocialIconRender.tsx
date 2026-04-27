import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { XIcon, TikTokIcon, PinterestIcon, BlueskyIcon } from "@/components/icons/SocialIcons";
import { BrandIcon } from "@/components/icons/BrandIcons";
import { cn } from "@/lib/utils";

export type IconStyle = "original" | "filled" | "outline" | "monochrome";

export const PLATFORM_META: Record<
  string,
  { label: string; color: string; emoji: string; placeholder: string }
> = {
  facebook:  { label: "Facebook",  color: "#1877F2", emoji: "📘", placeholder: "https://facebook.com/yourpage" },
  instagram: { label: "Instagram", color: "#E4405F", emoji: "📸", placeholder: "https://instagram.com/yourhandle" },
  linkedin:  { label: "LinkedIn",  color: "#0A66C2", emoji: "💼", placeholder: "https://linkedin.com/company/yourpage" },
  x:         { label: "X (Twitter)", color: "#000000", emoji: "✖️", placeholder: "https://x.com/yourhandle" },
  youtube:   { label: "YouTube",   color: "#FF0000", emoji: "▶️", placeholder: "https://youtube.com/@yourchannel" },
  tiktok:    { label: "TikTok",    color: "#000000", emoji: "🎵", placeholder: "https://tiktok.com/@yourhandle" },
  pinterest: { label: "Pinterest", color: "#E60023", emoji: "📌", placeholder: "https://pinterest.com/yourpage" },
  bluesky:   { label: "Bluesky",   color: "#0085FF", emoji: "🦋", placeholder: "https://bsky.app/profile/yourhandle" },
};

const LucideMap = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
} as const;

const CustomMap = {
  x: XIcon,
  tiktok: TikTokIcon,
  pinterest: PinterestIcon,
  bluesky: BlueskyIcon,
} as const;

interface Props {
  platform: string;
  iconStyle: IconStyle;
  size?: number;
  className?: string;
}

export function SocialIconRender({ platform, iconStyle, size = 20, className }: Props) {
  const meta = PLATFORM_META[platform];

  // "Original" = authentic brand glyph rendered as a rounded brand-colored tile,
  // matching the look of official social-media icon sheets.
  if (iconStyle === "original") {
    return <BrandIcon platform={platform} size={size + 8} tile className={className} />;
  }

  const Lucide = (LucideMap as any)[platform];
  const Custom = (CustomMap as any)[platform];

  if (Lucide) {
    const lucideProps =
      iconStyle === "filled" && meta
        ? { color: meta.color, fill: meta.color, strokeWidth: 0 }
        : iconStyle === "outline"
        ? { fill: "none", strokeWidth: 1.75 }
        : {};
    return <Lucide size={size} className={cn("transition-colors", className)} {...lucideProps} />;
  }

  if (Custom) {
    const colorStyle: React.CSSProperties =
      iconStyle === "filled" && meta ? { color: meta.color } : {};
    return (
      <Custom
        size={size}
        className={cn(
          "transition-colors",
          iconStyle === "outline" && "[&_path]:fill-none [&_path]:stroke-current [&_path]:stroke-[1.5]",
          className,
        )}
        style={colorStyle}
      />
    );
  }

  return null;
}
