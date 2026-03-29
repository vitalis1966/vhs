

## Accessibility Contrast Fixes

Three targeted changes to meet WCAG AA contrast requirements.

### 1. Hero CTA button — dark text on sage background
The `hero` button variant uses `bg-primary text-primary-foreground`. The primary foreground (`--primary-foreground`) is a light cream, giving only 2.05:1 contrast on the sage green.

**Fix:** Override the hero button text to dark green `text-[#1a2a18]` directly in the variant definition in `src/components/ui/button.tsx`.

### 2. "Get Started" label — darkened gold
The accent color `text-accent` (#c89741-ish) on the cream background fails at 2.44:1.

**Fix:** Add a new CSS utility class `text-accent-dark` with color `#7a5500` and apply it to the "Get Started" label in `src/components/home/PracticePathFinder.tsx`. Also check for any other `text-accent` labels used as small eyebrow/tagline text on light backgrounds (e.g., HeroSection "Full-Cycle Healthcare Strategy") and apply the same fix.

### 3. Footer text — use white throughout
Footer uses `text-primary-foreground/70`, `/60`, `/50` opacity variants that produce insufficient contrast on the `bg-primary` (#a5b29f) background.

**Fix:** In `src/components/Footer.tsx`, replace all opacity-reduced text classes with full `text-white` (or `text-white/90` minimum for body copy). Specifically:
- Body copy: `text-primary-foreground/70` → `text-white`
- Location/email: `text-primary-foreground/60` → `text-white`
- Category headings: `text-primary-foreground/50` → `text-white/90`
- Links: `text-primary-foreground/70` → `text-white hover:text-white/80`
- Copyright & bottom links: `text-primary-foreground/50` → `text-white/80`
- Border: `border-primary-foreground/10` → `border-white/20`

### Files to edit
| File | Change |
|------|--------|
| `src/components/ui/button.tsx` | Update `hero` variant: change `text-primary-foreground` to `text-[#1a2a18]` |
| `src/components/home/PracticePathFinder.tsx` | Change "Get Started" label from `text-accent` to `text-[#7a5500]` |
| `src/components/home/HeroSection.tsx` | Change "Full-Cycle Healthcare Strategy" label from `text-accent` to `text-[#7a5500]` |
| `src/components/Footer.tsx` | Replace all low-opacity text colors with `text-white` variants |

### Note
The hero button variant change will affect all `variant="hero"` buttons site-wide — this is intentional since they all share the same contrast problem. Buttons using `variant="hero-outline"` are unaffected.

