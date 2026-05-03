# AiVolo.studio Design System: MASTER (Playful Creator)

## Visual Identity
**Style:** Playful Creator / Consumer Entertainment
**Vibe:** Lively, human-centric, approachable, creative, low AI-feel.
**Avoid:** Cold tech aesthetics, dark B2B SaaS dashboards, sharp corners, purely symmetric technical layouts.

## Color Palette (Warm Sand & Violet)
| Role | Hex | Tailwind Class | Usage |
|------|-----|----------------|-------|
| Background | #FAFAF9 | `bg-brand-bg` | Warm sand/cream page background |
| Surface | #FFFFFF | `bg-brand-surface` | Pure white for cards and floating elements |
| Border | #E7E5E4 | `border-brand-border` | Extremely subtle structural lines |
| Accent (CTA) | #7C3AED | `bg-brand-cta` | Vibrant Violet for primary actions and strong highlights |
| Secondary | #EDE9FE | `bg-brand-secondary` | Soft violet for secondary actions, badges, and active states |
| Text Primary | #1C1917 | `text-brand-text` | Deep warm stone gray for main text |
| Text Muted | #78716C | `text-brand-muted` | Soft stone gray for descriptions and placeholders |

## Typography (Friendly & Expressive)
- **Primary Font:** `Bricolage Grotesque` (Sans Serif, Expressive, Rounded structure)
  - Usage: Global font family. Brings a lot of personality without sacrificing readability.
- **Headings:** Bold, slightly tighter tracking (`tracking-tight font-bold`).
- **Body:** Generous line height, readable size (`text-base leading-relaxed max-w-[65ch]`).

## Layout Principles (Bento & Soft Shapes)
- **Friendly Curves:** Extensive use of large border radii. `rounded-3xl` for main cards, `rounded-2xl` or `rounded-full` for buttons and inputs.
- **Soft Diffusion (Shadows):** Rely on large, extremely soft shadows (`shadow-[0_8px_30px_rgb(0,0,0,0.04)]`) to create a "floating" feel rather than relying solely on borders.
- **Overlapping Elements:** Encourage slightly overlapping badges or floating avatars to break the grid and add playfulness.
- **Bento Grid:** Use asymmetric grid layouts (Bento box style) for feature showcases, but keep the content inside friendly and highly visual.

## Micro-physics & Interaction
- **Bouncy Physics:** Interactions should feel elastic. Use `active:scale-95 transition-transform duration-300 ease-out` for a satisfying "squish" on click.
- **Focus States:** Bright, colorful focus rings (`focus:ring-brand-cta/40`) to make inputs pop clearly.
