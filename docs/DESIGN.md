# Acredo — Design System & Project Context for Claude Code

## Project overview

**Acredo** is a SaaS platform for academic quality management in Colombian higher education institutions (IES). It handles:
- Qualified registries (RC Nuevo, RC Renovación, RC Ampliación)
- Initial accreditation conditions (CI)
- High-quality accreditation processes (CNA)

**Production domain:** `acredo.online`
**Demo domain:** `demo.acredo.online`
**Stack:** Web app (tech stack TBD), static landing at root

---

## Process architecture nomenclature

This is the canonical naming — never deviate from it:

```
Proceso → Etapa → Entregable → Iteración → Actividad
```

| Level | Name       | Description                                               |
|-------|------------|-----------------------------------------------------------|
| 1     | Proceso    | Top-level container: type, program, faculty, campus       |
| 2     | Etapa      | Time-grouped period with start/end dates                  |
| 3     | Entregable | Working unit with forms, Google Docs link, evidence       |
| 4     | Iteración  | Review sub-cycle (1ª revisión, 2ª revisión, Revisión final) |
| 5     | Actividad  | Assignable action with responsible user and due date      |

---

## Brand identity

### Logo

The logomark is a geometric open-stroke "A":
- Triangle with no fill, emerald stroke (#10B981)
- Crossbar at ~65% height
- Emerald arc above the apex (certification seal metaphor)
- Emerald dot at the apex

```html
<!-- Standard logomark SVG — copy exactly -->
<svg viewBox="0 0 56 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M28 6 L52 58 L4 58 Z" stroke="#10B981" stroke-width="3" stroke-linejoin="round"/>
  <line x1="16" y1="41" x2="40" y2="41" stroke="#10B981" stroke-width="2.5"/>
  <path d="M12 9 A20 20 0 0 1 44 9" fill="none" stroke="#6EE7B7" stroke-width="2" stroke-linecap="round"/>
  <circle cx="28" cy="6" r="3.5" fill="#6EE7B7"/>
</svg>
```

### Wordmark

```html
<!-- On dark backgrounds -->
<span style="font-family:'Cormorant Garamond',serif;">
  <em style="color:#6EE7B7;font-style:italic;font-weight:400;">Ac</em><strong style="color:#fff;font-weight:700;">redo</strong>
</span>

<!-- On light backgrounds -->
<span style="font-family:'Cormorant Garamond',serif;">
  <em style="color:#065F46;font-style:italic;font-weight:400;">Ac</em><strong style="color:#0F2030;font-weight:700;">redo</strong>
</span>
```

**Rule:** *Ac* is always italic, lighter weight. *redo* is always bold, upright.

### Taglines

- Primary: *"Accredit what you believe in."*
- Spanish: *"Acredita lo que crees."*
- Secondary: *"Gestión de calidad, construida con convicción."*

---

## Color system

### Core palette

| Token            | Hex       | Usage                                      |
|------------------|-----------|--------------------------------------------|
| `--navy`         | `#0F2030` | Primary dark background, nav, hero         |
| `--navy-mid`     | `#1E3A5F` | Secondary dark surface, cards on dark      |
| `--navy-light`   | `#334E68` | Hover states, dividers on dark             |
| `--emerald`      | `#10B981` | Primary accent — CTAs, active states, logo |
| `--mint`         | `#6EE7B7` | Light accent on dark backgrounds only      |
| `--mint-surface` | `#F0FDF9` | Light page background, section fills       |
| `--mint-border`  | `#A7F3D0` | Borders on mint surfaces                   |
| `--mint-light`   | `#D1FAE5` | Progress fills, success tints              |
| `--slate`        | `#64748B` | Secondary text — passes AA on white (4.76:1) |
| `--off`          | `#F8FAFC` | Off-white backgrounds                      |
| `--white`        | `#FFFFFF` | Base white                                 |
| `--amber`        | `#F59E0B` | Warnings — dark backgrounds only           |

### Text-safe overrides (WCAG AA on light backgrounds)

⚠️ **CRITICAL:** `#10B981` emerald is only 2.54:1 on white — FAILS. Always use these for text:

| Token           | Hex       | Contrast on white | Use case                          |
|-----------------|-----------|-------------------|-----------------------------------|
| `--green-text`  | `#065F46` | 7.68:1 ✓          | Emerald text on white/mint-surface |
| `--muted`       | `#475569` | 7.58:1 ✓          | Muted text on white (replaces #94A3B8) |
| `--amber-text`  | `#78350F` | 8.45:1 ✓          | Amber text on light surfaces      |
| `--body`        | `#1E3A5F` | 11.50:1 ✓         | Body text in legal/content pages  |
| `--heading`     | `#0F2030` | max contrast ✓    | All headings                      |

### Colors that ONLY work on dark (#0F2030) backgrounds

| Color     | Hex       | Contrast on navy |
|-----------|-----------|------------------|
| `#94A3B8` | Gray-blue | 6.45:1 ✓         |
| `#6EE7B7` | Mint      | 10.85:1 ✓        |
| `#F59E0B` | Amber     | 7.70:1 ✓         |

### Process status colors

| Status      | Color     | Hex       | On white  | On dark   |
|-------------|-----------|-----------|-----------|-----------|
| Completado  | Emerald   | `#10B981` | Use text: `#065F46` | `#10B981` |
| En curso    | Blue      | `#3B82F6` | 3.95:1 (large only) | ✓ |
| Avanzado    | Sky blue  | `#38BDF8` | 2.5:1 ❌ dark only | ✓ |
| Pendiente   | Slate     | `#64748B` | 4.76:1 ✓ | ✓ |
| Por vencer  | Amber     | `#F59E0B` | dark only | ✓ |
| Vencido     | Red       | `#EF4444` | 3.94:1 (large) | ✓ |

### Process type badge colors

| Type          | Bg        | Text      | Border    |
|---------------|-----------|-----------|-----------|
| CI·Acred.     | `#F5F3FF` | `#4C1D95` | `#C4B5FD` |
| RC Nuevo      | `#E6FFFA` | `#065F46` | `#81E6D9` |
| RC Renovación | `#EFF6FF` | `#1E3A5F` | `#BFDBFE` |
| RC Ampliación | `#FFFBEB` | `#78350F` | `#FDE68A` |

---

## Typography

### Font families

```css
/* Google Fonts import */
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

--font-display: 'Cormorant Garamond', Georgia, serif;  /* Headings, wordmark, numbers */
--font-body:    'DM Sans', system-ui, sans-serif;       /* All UI text */
--font-mono:    'Courier New', monospace;               /* Code, SNIES numbers, hex values */
```

### Type scale

| Role             | Font    | Size (desktop) | Size (mobile) | Weight | Color on white |
|------------------|---------|----------------|---------------|--------|----------------|
| Display / H1     | Display | 46–78px (clamp)| 36–58px       | 600    | `#0F2030`      |
| Section title H2 | Display | 34–52px (clamp)| 28–40px       | 600    | `#0F2030`      |
| Card title H3    | Body    | 17–18px        | 16px          | 500    | `#0F2030`      |
| Body text        | Body    | 16–17px        | 16px min      | 300–400| `#1E3A5F`      |
| UI label         | Body    | 13–14px        | 13px          | 400    | `#475569`      |
| Caption / meta   | Body    | 11–12px        | 11px          | 400–500| `#475569`      |
| Eyebrow / tag    | Body    | 11–12px        | 11px          | 500    | `#065F46` (light bg) |
| Legal body       | Body    | 16px           | 16px          | 300    | `#1E3A5F`      |

### Key rules
- **Minimum body text: 16px** on mobile
- **Display font for:** hero titles, section titles, KPI numbers, wordmark
- **Body font for:** everything else — labels, descriptions, forms, tables, navigation
- **Never use** Inter, Roboto, Arial, or system-ui as primary (DM Sans is the substitute)
- **Italic is reserved** for the "Ac" portion of the wordmark and accent phrases

---

## Spacing & layout

```css
--space-1:  4px;
--space-2:  8px;
--space-3:  12px;
--space-4:  16px;
--space-5:  20px;
--space-6:  24px;
--space-8:  32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-24: 96px;

/* Section vertical padding */
--section-pad: clamp(60px, 10vw, 100px);

/* Page horizontal padding */
--page-x: clamp(16px, 5vw, 40px);

/* Max content width */
--max-width: 1200px;
--max-prose:  760px;  /* Legal / long-form text */
```

---

## Breakpoints

```css
/* Mobile first */
--bp-sm:  480px;   /* Small phones */
--bp-md:  768px;   /* Tablets / large phones */
--bp-lg:  1024px;  /* Small laptops */
--bp-xl:  1280px;  /* Desktops */
--bp-2xl: 1536px;  /* Large screens */
```

```css
/* Usage */
@media (max-width: 480px)  { /* small phone overrides */ }
@media (max-width: 768px)  { /* mobile layout */         }
@media (max-width: 1024px) { /* tablet layout */         }
```

---

## Component patterns

### Buttons

```html
<!-- Primary CTA -->
<a href="https://demo.acredo.online" class="btn-primary">
  Explorar la demo
  <svg viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>
</a>

<!-- Ghost / secondary -->
<a href="#section" class="btn-ghost">¿Cómo funciona?</a>
```

```css
.btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  background: #10B981; color: #022C22;
  font-family: var(--font-body); font-size: 15px; font-weight: 600;
  min-height: 48px; padding: 12px 28px; border-radius: 10px;
  text-decoration: none; border: none; cursor: pointer;
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
}
.btn-primary:hover {
  background: #0D9488; transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(16,185,129,0.25);
}

.btn-ghost {
  display: inline-flex; align-items: center; gap: 8px;
  background: transparent; color: #CBD5E1;
  font-family: var(--font-body); font-size: 15px; font-weight: 400;
  min-height: 48px; padding: 12px 24px; border-radius: 10px;
  text-decoration: none; border: 0.5px solid rgba(255,255,255,0.12);
  cursor: pointer; transition: border-color 0.2s, color 0.2s;
}
.btn-ghost:hover { border-color: rgba(110,231,183,0.3); color: #6EE7B7; }
```

**Rules:**
- All interactive elements min 44px tap target (48px preferred)
- Primary: emerald bg, deep green text `#022C22` (always)
- Ghost: transparent + soft border, used on dark backgrounds only
- On light bg: use `border: 0.5px solid #A7F3D0; color: #065F46; background: transparent`

### Cards (process cards)

```css
.process-card {
  background: #fff;
  border: 0.5px solid #E2E8F0;
  border-radius: 10px;
  overflow: hidden;
  transition: border-color 0.15s;
}
.process-card:hover { border-color: #A7F3D0; }
/* Color accent bar at top = process type color */
.process-card-bar { height: 4px; }
```

### Progress rings (SVG)

```html
<!-- 67% progress, emerald -->
<svg width="52" height="52" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#D1FAE5" stroke-width="3.2"/>
  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10B981" stroke-width="3.2"
    stroke-dasharray="67 33" stroke-linecap="round" transform="rotate(-90 18 18)"/>
  <text x="18" y="17" text-anchor="middle" dominant-baseline="central"
    font-size="8" font-weight="500" font-family="Georgia,serif" fill="#10B981">67%</text>
  <text x="18" y="25" text-anchor="middle"
    font-size="4" font-family="sans-serif" fill="#94A3B8">avance</text>
</svg>
```

**Ring color by progress:**
- 100% → `#10B981` emerald
- 67–99% → `#3B82F6` blue
- 50–66% → `#F59E0B` amber
- 25–49% → `#F97316` orange
- 0–24% → `#EF4444` red

### Status badges

```css
/* Base badge */
.badge {
  display: inline-block;
  font-size: 10px; font-weight: 500;
  padding: 2px 8px; border-radius: 20px;
  white-space: nowrap;
}

/* Variants */
.badge-done    { background: #DCFCE7; color: #166534; }
.badge-active  { background: #DBEAFE; color: #1D4ED8; }
.badge-pending { background: #F1F5F9; color: #64748B; }
.badge-warning { background: #FEF9C3; color: #854D0E; }
.badge-danger  { background: #FEE2E2; color: #991B1B; }
```

### Highlight / info box

```css
.highlight-box {
  background: #F0FDF9; border: 0.5px solid #A7F3D0;
  border-left: 3px solid #10B981;
  border-radius: 0 10px 10px 0;
  padding: 16px 20px;
}
.highlight-box p { font-size: 15px; color: #065F46; }

.warn-box {
  background: #FEF9C3; border: 0.5px solid #FDE68A;
  border-left: 3px solid #F59E0B;
  border-radius: 0 10px 10px 0;
  padding: 16px 20px;
}
.warn-box p { font-size: 15px; color: #78350F; }
```

### Tables (always inside scroll wrapper on mobile)

```html
<div class="table-wrap">
  <table>
    <thead><tr><th>Columna</th><th>Columna</th></tr></thead>
    <tbody><tr><td>Dato</td><td>Dato</td></tr></tbody>
  </table>
</div>
```

```css
.table-wrap {
  overflow-x: auto; -webkit-overflow-scrolling: touch;
  margin: 16px 0 20px; border-radius: 8px;
  border: 0.5px solid #E2E8F0;
}
table { width: 100%; border-collapse: collapse; min-width: 480px; }
th {
  background: #0F2030; color: #6EE7B7;
  padding: 11px 14px; text-align: left;
  font-size: 11px; font-weight: 500;
  letter-spacing: 0.06em; text-transform: uppercase;
}
td {
  padding: 11px 14px; border-bottom: 0.5px solid #E2E8F0;
  color: #1E3A5F; font-weight: 300; vertical-align: top;
}
tr:nth-child(even) td { background: #F8FAFC; }
```

---

## Navigation

### Topbar (app, not marketing)

```css
.tb { background: #0F2030; padding: 0 18px; height: 44–58px; }
/* Logo → crumb → [spacer] → actions → avatar */
```

### Breadcrumb pattern

```
Procesos / Ing. Industrial / Construcción docs. / Aspectos curriculares
         ↑                 ↑                    ↑
    clickable          clickable            current (emerald)
```

---

## Shadows

```css
--shadow-sm: 0 2px 8px rgba(15,32,48,0.08);
--shadow-md: 0 4px 16px rgba(15,32,48,0.10);
--shadow-lg: 0 8px 28px rgba(15,32,48,0.12);
--shadow-xl: 0 16px 48px rgba(15,32,48,0.15);

/* For cards floating on dark backgrounds */
--shadow-dark: 0 32px 80px rgba(0,0,0,0.40);
```

---

## Border radius

```css
--radius-sm:  6px;
--radius-md:  8px;
--radius-lg: 10px;
--radius-xl: 12px;
--radius-2xl:16px;
--radius-pill: 9999px;
```

---

## Animations

```css
/* Standard entry */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0);    }
}

/* Usage pattern: stagger with animation-delay */
.hero-eyebrow  { animation: fadeUp 0.6s 0s   ease both; }
.hero-title    { animation: fadeUp 0.6s 0.1s ease both; }
.hero-desc     { animation: fadeUp 0.6s 0.2s ease both; }
.hero-actions  { animation: fadeUp 0.6s 0.3s ease both; }

/* Transition defaults */
--transition-fast:   0.15s ease;
--transition-normal: 0.20s ease;
--transition-slow:   0.30s ease;
```

**Rules:**
- Use `animation-fill-mode: both` (shorthand: include `both` in animation declaration)
- Never animate `width` or `height` — use `transform` and `opacity` only
- Respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## App-specific UI patterns

### Left sidebar (form index, doc list)
- Width: 220–260px
- Active item: `border-left: 3px solid #10B981; background: #F0FDF9;`
- Hover: `background: #F8FAFC;`

### 3-column layout (app pages)
```
[Left sidebar 220–260px] [Center flex:1] [Right panel 300–320px]
```

### Section header in dark context
```css
.section-eyebrow {
  font-size: 12px; font-weight: 500;
  color: #065F46;               /* on white/light */
  /* color: #6EE7B7 on dark */
  letter-spacing: 0.1em; text-transform: uppercase;
}
```

### Iteration pipeline (timeline)
- Done: `border-color: #10B981; background: #10B981; color: #fff;` + ✓ icon
- Active: `border-color: #3B82F6; background: #EFF6FF; color: #3B82F6;`
- Pending: `border-color: #E2E8F0; background: #F8FAFC; color: #CBD5E1;`

---

## Legal pages

- Max content width: `760px`
- Body font: 16px, `#1E3A5F`, weight 300, line-height 1.85
- Section number: Cormorant Garamond, 13px, `#065F46`
- H2: Cormorant Garamond, `clamp(22px, 4vw, 28px)`, weight 600, `#0F2030`
- H3: DM Sans, 16px, weight 500, `#0F2030`
- Contact cards: navy background `#0F2030`, links in `#6EE7B7`

---

## File structure (recommended)

```
acredo.online/
├── index.html              ← Landing page
├── privacy.html            ← Política de privacidad
├── terms.html              ← Términos del servicio
├── assets/
│   ├── css/
│   │   └── tokens.css      ← All CSS variables (copy from design-tokens.css)
│   ├── svg/
│   │   ├── logo.svg        ← Standalone logomark
│   │   └── logo-wordmark.svg
│   └── fonts/              ← (optional self-hosted fallback)
├── app/                    ← The actual web app
│   └── ...
```

---

## Content & tone rules

- Language: **Spanish** for all user-facing content in the app
- Language: **Spanish** for the landing page
- Technical docs / variable names: English
- Tone: professional but direct — no corporate fluff
- Process names: always use the canonical 5-level hierarchy
- Demo data: always fictional — invented SNIES codes (4–5 digits), "Sede Central"/"Sede Norte", generic program names
- **Never reference:** UNINÚÑEZ, Corporación Universitaria Rafael Núñez, or any real institutional data in demo/public-facing content

---

## Google Sign-In integration notes

- Auth method: Google OAuth 2.0 / OpenID Connect only
- Scopes requested: `openid`, `email`, `profile` (minimum)
- Optional (when user enables Docs integration): Google Docs scope
- Never store passwords
- Privacy policy URL: `https://acredo.online/privacy.html`
- Terms URL: `https://acredo.online/terms.html`

---

## What NOT to do

- ❌ Do NOT use `#10B981` emerald as text color on white or mint-surface backgrounds
- ❌ Do NOT use `#94A3B8` as text on white backgrounds (only on dark navy)
- ❌ Do NOT use `#F59E0B` amber as text on white or light backgrounds
- ❌ Do NOT use Inter, Roboto, Arial as primary fonts
- ❌ Do NOT call the process levels by their old names (Fase, Tarea, Etapa, Acción)
- ❌ Do NOT mention Microsoft in any user-facing content
- ❌ Do NOT use real UNINÚÑEZ data in demos or public content
- ❌ Do NOT add a CTA "Iniciar implementación" button on the closing slide (presentation)
- ❌ Do NOT put tables without a `.table-wrap` scroll container on mobile
- ❌ Do NOT use font sizes below 16px for body text
