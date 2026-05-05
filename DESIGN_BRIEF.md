# NASS Branch Document Tracker — Design Brief

> Design context for redesigns / new component generation.
> Pair this brief with `style.css` and `index.html` for full fidelity.

## Identity

Nigerian Navy / Naval Safety & Standards Branch. Internal staff app for tracking document workflow. Voice: **authoritative, military, formal** — but the app is lived in daily, so density and speed beat decoration. Always desktop-first; mobile-responsive but secondary.

## Palette (verbatim from `:root` in `style.css`)

- **Navy** — `--nass-navy-900: #002655` through `--nass-navy-100: #0055cc`. Primary identity.
- **Gold** — `--nass-gold-500: #c8a400`, with deeper 600 and lighter 300. Used **only on navy** (rank-insignia metaphor): topbar accent strip, CTA, avatar ring, active-tab underline.
- **Status colors** (semantic — these are the visual vocabulary users learn):
  - Active = sky blue `#0055aa`
  - Completed = green `#0d6e35`
  - On Hold = amber `#8a6000`
  - Cancelled = red `#b81c2e`
  - Filed = purple `#5a2d9a`
  - **Overdue** overrides any status tint with red `#fde0e5`
- **Backgrounds** — `--bg-app: #eef1f6` (cool gray), card `#ffffff`, subtle/muted/panel/hover variants.
- **Foreground** — `#1a2332` ink → `#5a6375` muted → `#9aa3b0` faint, plus `--fg-on-navy` for dark surfaces.
- **Dark mode** — full second palette with vivid status fills + glow rings on chips.

## Typography

- Body **13px** — this is a data app, density matters
- Sans: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif`
- Mono: `ui-monospace, 'SF Mono', Consolas`
- Hierarchy: micro-labels 10–11px **uppercase + tracked** (`letter-spacing: 0.08em`); section heads 12–15px navy + gold underline; numerals on stat tiles 23px bold

## Spacing / radii

- Radii: 4, 5, 6, 7, 8, 10, 12, **20 (pill)**
- Common gaps: 6 / 8 / 10 / 12 / 16 / 22 px
- Topbar height **56px** (sticky, with 2px gold underline + shadow)
- Tables vertically scroll inside `calc(100vh - 235px)` so topbar/stats/filter/footer always pin

## Component inventory (full)

1. **Topbar** (BEM `topbar__*`) — gradient navy, gold 2px underline, brand wordmark, nav tabs (active = gold underline), expanding search (160 → 280px on focus), notification icon, role badge, gold CTA, avatar + email + sign-out
2. **Stats bar** — six tiles (Total / Active / Completed / Overdue / On Hold / Cancelled / Filed). Each tile has a colored 3px top accent matching its status color. Click filters the table.
3. **Filter bar** — magnifying-glass search input (pill), status / officer / role dropdowns
4. **Main table** — sticky header (navy gradient), status-tinted rows, overdue rows take precedence, inline-edit status select, per-row actions: View / Edit / Duplicate / Delete (delete is icon-only red on hover)
5. **Pagination** — windowed numeric pager (10 buttons), prev/next arrows, active = navy fill
6. **Bulk action bar** — slides up from bottom when ≥1 row checkbox selected
7. **Modal** — backdrop blur 3px, 540px card, 2-col form grid, navy primary button
8. **Detail modal** — *expandable*: when a Drive PDF match is found, expands to 97vw × 94vh with split layout (record details left 460px, PDF iframe right). Subject becomes a clickable link to Drive.
9. **Drive search view** — three-pane: search input + breadcrumb / results list / preview panel
10. **Admin panel** — card grid; each card holds tag-pills for one config list (officers / statuses / locations / actions / file index) with paginator
11. **Activity log** — paginated audit table with user / action / before → after columns
12. **Dashboard** — summary stat tiles + charts row + overdue-records mini-table
13. **Kanban board** — column per status, drag/drop cards
14. **Inbox / Internal mail** — Gmail-style row list + sidebar + threaded detail + compose panel + autocomplete recipient suggestions
15. **Messenger** — draggable floating action button + expandable panel; *also* has a docked split-view mode that pushes other content left and reveals a sidebar with conversations
16. **Toasts** — corner stack, success/warn/error variants
17. **Login** — full-bleed navy gradient, centered card with NN logo

## Interaction language

- Hover: rows lighten (`--bg-row-hover`), tiles lift `translateY(-1px)`, buttons get a slightly heavier shadow
- Focus: 3px navy ring at 10% opacity (`--ring-focus`), input border darkens to navy-700
- Modal entry: fade + backdrop blur, no slide
- Status tile click: drills into filtered table view
- Drive PDF found: detail modal smoothly grows to fill almost full viewport
- Toast: slide-in from edge, auto-dismiss
- Dark mode: status chips get **leading colored dot + glow ring** (extra distinctiveness needed against dark backgrounds)

## Responsive

- Tablet ≤ 900px: hide low-priority columns
- Mobile ≤ 640px: full reflow — table → cards, sidebar → drawer
- Small phones ≤ 380px: further density cuts
- Docked-chat affects desktop layouts (chat panel pushes content; admin collapses to 1-col; activity log hides extra columns)

## What works — preserve

- The **status color system** is the most learnable part of the UI; users navigate by hue. Don't redesign these colors, only refine.
- **Gold-on-navy rule.** Gold never appears on light backgrounds. Maintain this constraint.
- BEM naming on the topbar — extending elsewhere (`mbox__`, `tab__`) would be a coherent improvement.
- Density at 13px body — designers will be tempted to inflate; resist.

## What needs love (designer brief)

- **Button system fragmented** — `.medit`, `.mok`, `.mcancel`, `.btn-clear`, `.view-btn`, `.edit-btn`, `.del`, `.btn-gold`, `.btn-ghost`, `.btn-navy`, `.btn-signout` are all one-offs. Consolidate into a small set of semantic variants (primary / secondary / ghost / danger / icon).
- **Empty states** are bare text. Pattern needed.
- **Loading**: spinner-only. Skeleton rows for the table would improve perceived speed.
- **Onboarding** for first-time users (no current pattern).
- **Typography contrast** between body and headings is mild — could be sharper without breaking density.
- **Spacing rhythm** — many `padding: 7px 11px`-style ad-hoc values. A 4px or 8px scale would tighten things.
- **Accessibility** — verify focus rings on all interactive elements, contrast on muted text on muted backgrounds.

## How to prompt claude.ai/design

> "Here is the design brief and the current `style.css` and `index.html`. Redesign the **[topbar / detail modal / dashboard / table / inbox / etc.]**. Keep the navy + gold identity, the status-color vocabulary, and the BEM topbar structure. Optimize for **[clarity at scan / mobile usability / first-time user comprehension / etc.]**. Output: HTML + CSS using the same design tokens defined in `:root`."
