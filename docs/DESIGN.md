# Acredo — Design System

Este documento describe la **intención** del sistema de diseño. La **implementación** vive en Sass:

- **Fuente única de verdad de valores**: [`src/styles/_variables.scss`](../src/styles/_variables.scss)
- **Theme colors custom** (que extienden los semánticos Bootstrap): [`src/styles/_theme-colors.scss`](../src/styles/_theme-colors.scss)
- **Variantes emphasis/subtle**: [`src/styles/_theme-emphasis.scss`](../src/styles/_theme-emphasis.scss)
- **Visualización en vivo**: la app expone `/theming` — una pantalla que lee todos los valores desde las CSS variables `--bs-*` en runtime.

Cuando cambia un token Sass, `/theming` se actualiza al recompilar. Por eso este doc evita listar hex específicos.

---

## 1. Project overview

**Acredo** es una plataforma SaaS para gestión de calidad académica en instituciones de educación superior (IES) colombianas. Maneja:
- Registros calificados (RC Nuevo, RC Renovación, RC Ampliación)
- Condiciones iniciales de acreditación (CI)
- Procesos de acreditación de alta calidad (CNA)

**Producción:** `acredo.online` · **Demo:** `demo.acredo.online`

---

## 2. Nomenclatura de procesos

Jerarquía canónica — nunca desviarse:

```
Proceso → Etapa → Entregable → Iteración → Actividad
```

| Nivel | Nombre     | Descripción                                                 |
|-------|------------|-------------------------------------------------------------|
| 1     | Proceso    | Contenedor top-level: tipo, programa, facultad, sede        |
| 2     | Etapa      | Periodo agrupado en tiempo con start/end                    |
| 3     | Entregable | Unidad de trabajo con formularios, Google Doc, evidencia    |
| 4     | Iteración  | Sub-ciclo de revisión (1ª revisión, 2ª revisión, Final)     |
| 5     | Actividad  | Acción asignable con responsable y fecha límite             |

---

## 3. Brand identity

### Logo

Logomarca: "A" geométrica con stroke abierto.
- Triángulo sin fill, stroke emerald
- Crossbar al ~65% de altura
- Arco emerald-claro sobre el apex (metáfora de sello de certificación)
- Punto emerald-claro en el apex

```html
<svg viewBox="0 0 56 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M28 6 L52 58 L4 58 Z" stroke="var(--bs-primary)" stroke-width="3" stroke-linejoin="round"/>
  <line x1="16" y1="41" x2="40" y2="41" stroke="var(--bs-primary)" stroke-width="2.5"/>
  <path d="M12 9 A20 20 0 0 1 44 9" fill="none" stroke="var(--bs-primary-surface)" stroke-width="2" stroke-linecap="round"/>
  <circle cx="28" cy="6" r="3.5" fill="var(--bs-primary-surface)"/>
</svg>
```

### Wordmark

```html
<!-- Sobre dark -->
<span style="font-family: var(--bs-body-font-family);">
  <em class="text-primary-surface fst-italic fw-normal">Ac</em><b class="text-white fw-bold">redo</b>
</span>

<!-- Sobre light -->
<span style="font-family: var(--bs-body-font-family);">
  <em class="text-primary-emphasis fst-italic fw-normal">Ac</em><b class="text-dark fw-bold">redo</b>
</span>
```

**Regla:** *Ac* siempre italic + peso ligero. *redo* siempre bold + upright.

### Taglines

- Primary: *"Accredit what you believe in."*
- Spanish: *"Acredita lo que crees."*
- Secondary: *"Gestión de calidad, construida con convicción."*

---

## 4. Sistema de color

### Slots semánticos

Los slots semánticos de Bootstrap (`primary`, `secondary`, etc.) están mapeados al brand en `_variables.scss`. Cada uno auto-genera el set completo de utilities sin escribir CSS.

| Slot              | Intención brand                                       | Status process |
|-------------------|-------------------------------------------------------|----------------|
| `primary`         | Emerald — CTAs, logo, acción principal                | Completado     |
| `secondary`       | Slate medio — neutral, acciones secundarias           | Pendiente      |
| `success`         | Verde profundo — confirmación                         | —              |
| `info`            | Azul — informativo neutral                            | En curso       |
| `warning`         | Amber — atención requerida                            | Por vencer     |
| `danger`          | Rojo — error o bloqueo                                | Vencido        |
| `light`           | Mint surface — fondo branded suave                    | —              |
| `dark`            | Deep slate — backgrounds dark, topbar                 | —              |
| `navy` *(custom)* | Deep slate — utilities específicas del shell          | —              |
| `primary-surface` *(custom)* | Mint — acentos sobre dark, CTAs secundarios | —      |

Los valores exactos se ven en `/theming` o en `_variables.scss`.

### Utilities auto-generadas

Para **cada** slot, Bootstrap genera (sin escribir CSS):

```
.bg-{name}            .bg-{name}-subtle
.text-{name}          .text-{name}-emphasis
.border-{name}        .border-{name}-subtle
.btn-{name}           .btn-outline-{name}
.alert-{name}         .badge.bg-{name}
.link-{name}          .table-{name}
--bs-{name}           --bs-{name}-rgb
--bs-{name}-text-emphasis
--bs-{name}-bg-subtle
--bs-{name}-border-subtle
```

### Reglas de uso

- **Texto emerald sobre fondos claros:** usar `.text-primary-emphasis` (no `.text-primary` — el emerald puro falla AA sobre blanco).
- **Texto mint sobre dark:** usar `.text-primary-surface` (no sobre blanco, contraste insuficiente).
- **Acciones primarias:** `.btn-primary`. Bootstrap selecciona automáticamente el color de texto vía `color-contrast()` configurado en `_variables.scss`.
- **Backgrounds branded:** `.bg-light` (mint surface) para secciones destacadas, `.bg-body-tertiary` para modales.

---

## 5. Tipografía

### Stack de fuentes

- **Body / Headings:** `DM Sans Variable` (loaded via `@fontsource-variable/dm-sans`)
- **Fallback:** `Inter Variable`, system-ui, Segoe UI, sans-serif
- **Code/Mono:** `source-code-pro`, Menlo, Monaco, Consolas

Configurado en `_variables.scss` sección "3. Tipografía":

```scss
$font-family-base:     "DM Sans Variable", "Inter Variable", "Segoe UI", ...;
$headings-font-family: "DM Sans Variable", "Inter Variable", "Segoe UI", Tahoma;
$headings-color:       $_navy;
$headings-font-weight: 600;
```

### Clases utilitarias

| Clase            | Rol                                          |
|------------------|----------------------------------------------|
| `h1`–`h6`        | Headings, color `$_navy`, weight 600         |
| `.display-{N}`   | Display sizes, peso 600                      |
| `.lead`          | Texto introductorio, peso 300                |
| `.text-secondary`| Texto secundario / meta                      |
| `.text-muted`    | Igual rol que `.text-secondary`              |
| `.eyebrow`       | Custom — sobre-título uppercase + tracking   |

**Regla:** minimum body 16px en mobile. Headings inherit `$_navy`.

---

## 6. Espaciado y radios

### Spacing scale

Definido en `_variables.scss` sección "6. Espaciado". Acceso vía utilities `.m{tbsexy}-{0..10}`, `.p{tbsexy}-{0..10}`, `.gap-{0..10}`.

| Token | Valor    |
|-------|----------|
| `1`   | 4px      |
| `2`   | 8px      |
| `3`   | 12px     |
| `4`   | 16px     |
| `5`   | 20px     |
| `6`   | 24px     |
| `7`   | 32px     |
| `8`   | 40px     |
| `9`   | 48px     |
| `10`  | 64px     |

### Border radius

Definido en `_variables.scss` sección "4. Bordes y radio". Acceso vía utilities `.rounded`, `.rounded-{sm,lg}`, `.rounded-pill` o CSS vars `--bs-border-radius{,-sm,-lg,-xl,-xxl,-pill}`.

| Token        | Valor    |
|--------------|----------|
| `sm`         | 6px      |
| `base`       | 8px      |
| `lg`         | 10px     |
| `xl`         | 12px     |
| `xxl`        | 16px     |
| `pill`       | 9999px   |

---

## 7. Breakpoints

| Sufijo  | min-width | Container max-width |
|---------|-----------|---------------------|
| `xs`    | 0         | —                   |
| `sm`    | 576px     | 540px               |
| `md`    | 768px     | 720px               |
| `lg`    | 992px     | 960px               |
| `xl`    | 1200px    | 1140px              |
| `xxl`   | 1400px    | 1320px              |
| `xxxl`  | 1600px    | 1540px              |

Genera **todas** las utilities responsive: `.col-{bp}-{N}`, `.d-{bp}-{flex|block|none|...}`, `.flex-{bp}-{row|column|...}`, `.m{tbsexy}-{bp}-{N}`, `.p{tbsexy}-{bp}-{N}`, `.text-{bp}-{start|center|end}`, `.order-{bp}-{N}`.

---

## 8. Patrones de componentes

### Botones

```jsx
<Button color="primary">Acción principal</Button>
<Button color="primary-surface">Acción secundaria (sobre dark)</Button>
<Button outline color="primary">Acción suave</Button>
<Button color="primary" disabled>No disponible</Button>
```

- `.btn-primary-surface` tiene **hover especial** (mint → emerald) definido en [`_components.scss`](../src/styles/_components.scss). El resto se auto-genera.
- Bootstrap elige automáticamente el color de texto vía `color-contrast()` con `$_contrast-dark` como dark fallback (forzando texto oscuro coherente con marca).

### Cards

```jsx
<Card>
  <CardHeader>Título</CardHeader>
  <CardBody>Contenido</CardBody>
</Card>

{/* Card destacada con subtle bg + emphasis text */}
<Card body className="bg-primary-subtle border-primary-subtle">
  <p className="text-primary-emphasis">Mensaje destacado</p>
</Card>
```

### Alerts

```jsx
<Alert color="primary">Mensaje</Alert>
<Alert color="warning">Atención</Alert>
<Alert color="danger">Error</Alert>
```

Cada theme color genera su variant. Usan `--bs-{name}-bg-subtle` + `--bs-{name}-border-subtle` + `--bs-{name}-text-emphasis`.

### Formularios

Configurados en `_variables.scss` sección "9. Formularios". Bordes finos (0.5px), focus emerald, radius `border-radius-lg`.

```jsx
<FormGroup>
  <Label className="form-label">Etiqueta</Label>
  <Input placeholder="..." />
  <div className="form-text">Helper text</div>
</FormGroup>

{/* Validación */}
<Input className="is-valid" />
<Input className="is-invalid" />
<div className="invalid-feedback">Mensaje</div>
```

### Topbar (shell)

Custom — Bootstrap navbar no llega a esta densidad. Implementado en [`_components.scss`](../src/styles/_components.scss) bajo `.tb-acredo`:

```jsx
<div className="tb-acredo">
  <a className="tb-logo">…</a>
  <span className="tb-wordmark">…</span>
  <span className="tb-sep" />
  <span className="tb-crumb">Crumb</span>
  <div className="tb-actions">…</div>
  <div className="tb-avatar">N</div>
</div>
```

---

## 9. Cómo customizar

### Cambiar valor de marca

1. Editar el token correspondiente en `src/styles/_variables.scss`. Los tokens internos del brand viven con prefijo `$_` en la sección superior (`$_emerald`, `$_navy`, `$_mint`, etc.). Editar uno propaga el cambio a todos los slots semánticos que lo referencian.
2. Recompilar (HMR de Vite recarga al guardar).
3. Verificar en `/theming` que el cambio se ve coherente.

### Agregar un theme color custom

1. Agregar entry en `$custom-colors` de `_theme-colors.scss`:
   ```scss
   $custom-colors: (
       "brand-x": $_some-token,
   );
   ```
2. Agregar las 3 variantes derivadas en `_theme-emphasis.scss`:
   ```scss
   $custom-colors-text:          ( "brand-x": #color-emphasis );
   $custom-colors-bg-subtle:     ( "brand-x": #color-bg );
   $custom-colors-border-subtle: ( "brand-x": #color-border );
   ```
3. Agregar `"brand-x"` al array `THEME_COLORS` en `src/screens/Theme/index.tsx` para que aparezca en `/theming`.

Bootstrap auto-genera `.btn-brand-x`, `.bg-brand-x`, `.text-brand-x-emphasis`, `.alert-brand-x`, etc. — sin escribir CSS.

### Personalizar un componente Bootstrap

Antes de escribir CSS custom, revisar `_variables.scss` secciones 8-20: hay overrides para botones, formularios, cards, modales, dropdowns, tablas, progress, badges, accordion, paginación, nav, tooltips. Casi cualquier ajuste se hace allí — no en `_components.scss`.

### Reglas de oro

- **NO escribir hex inline** fuera de la sección de tokens internos (`$_`) en `_variables.scss`.
- **NO usar `!important`** — overrides en Sass, no en CSS.
- **NO usar `.text-primary` en texto sobre blanco** (falla AA). Usar `.text-primary-emphasis`.
- **SÍ usar utilities Bootstrap antes de escribir CSS custom** — casi siempre existe la utility.
- **SÍ visitar `/theming`** después de cualquier cambio para validar visualmente.

---

## 10. Contenido y tono

- **Idioma UI:** Español (Colombia)
- **Idioma técnico** (variables, comentarios): English
- **Tono:** profesional pero directo, sin fluff corporativo
- **Process names:** usar siempre la jerarquía canónica (Proceso → Etapa → Entregable → Iteración → Actividad)
- **Demos:** data ficticia (SNIES 4-5 dígitos, "Sede Central", programas inventados)
- **No referenciar:** UNINÚÑEZ, Corporación Universitaria Rafael Núñez, ni data institucional real en contenido público/demo

---

## 11. Qué NO hacer

- ❌ Usar `.text-primary` como color de texto sobre blanco (FAILS AA, 2.54:1)
- ❌ Usar hex literal en archivos `.tsx` o `.scss` fuera de la sección de tokens internos
- ❌ Llamar los niveles de proceso por nombres antiguos (Fase, Tarea, Acción)
- ❌ Mencionar Microsoft en contenido user-facing
- ❌ Usar fuentes Inter/Roboto/Arial como primaria (DM Sans Variable es la base)
- ❌ Tablas sin wrapper de scroll en mobile
- ❌ Body text por debajo de 16px en mobile
- ❌ Crear CSS custom para algo que Bootstrap ya expone como utility

---

## Recursos

- **Visualización en vivo:** `/theming` (en la app, requiere login)
- **Implementación:** [`src/styles/_variables.scss`](../src/styles/_variables.scss)
- **Theme colors custom:** [`src/styles/_theme-colors.scss`](../src/styles/_theme-colors.scss) + [`_theme-emphasis.scss`](../src/styles/_theme-emphasis.scss)
- **Componentes shell:** [`src/styles/_components.scss`](../src/styles/_components.scss)
- **Bootstrap 5.3 docs:** https://getbootstrap.com/docs/5.3/customize/sass
