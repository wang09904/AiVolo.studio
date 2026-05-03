# AiVolo.studio Design System: MASTER (High-End Overhaul)

## Visual Identity
**Style:** High-End SaaS / Editorial Minimalist
**Vibe:** Premium, clean, functional, asymmetric.
**Avoid:** The "Lila Ban" (No purple/blue AI glows). No centered heavy hero sections. No excessive card layouts. No Inter font.

## Color Palette (Zinc + Electric Blue)
| Role | Hex | Tailwind Class | Usage |
|------|-----|----------------|-------|
| Background | #09090b | `bg-zinc-950` | Primary page background |
| Surface | #18181b | `bg-zinc-900` | Subtle contrast areas (use sparingly, prefer negative space) |
| Border | rgba(39,39,42,0.5) | `border-zinc-800/50` | Dividers, structural lines (`divide-y`, `border-t`) |
| Accent | #2563eb | `bg-blue-600` | Primary actions, Electric Blue. Keep saturation tight. |
| Text Primary | #f4f4f5 | `text-zinc-100` | Main headings and high-priority text |
| Text Muted | #a1a1aa | `text-zinc-400` | Body copy, secondary labels |

## Typography (Deterministic Typography)
- **Primary Font:** `Outfit` (Sans Serif, Geometric, Premium)
  - Usage: Global font family for all text.
- **Headings:** Use tight tracking and tight leading (`tracking-tighter leading-none`).
- **Body:** Standardize on `text-base text-zinc-400 leading-relaxed max-w-[65ch]`.

## Layout Principles (Anti-Center Bias & Data Densification)
- **Asymmetry:** Default to split-screen (50/50) or left-aligned content with right-aligned assets. Avoid centered blobs.
- **Viewport:** Use `min-h-[100dvh]` for full-height sections to prevent iOS Safari jumping.
- **Anti-Card Overuse:** Do not wrap everything in boxes. Use negative space and thin 1px lines (`divide-y`, `border-b border-zinc-800/50`) to separate data points.
- **Grids:** Prefer CSS Grid over flexbox math.

## Micro-physics & Interaction
- **Click State:** All buttons and interactive elements must have tactile feedback: `active:scale-[0.98] transition-all duration-300 ease-out`.
- **Hover State:** Subtle color shifts. No heavy shadows or glows on hover.
- **Empty/Loading States:** Must be thoughtfully designed, using skeletal structures matching the final layout.
