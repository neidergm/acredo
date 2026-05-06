# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server.
- `npm run build` — type-check the whole project (`tsc -b`) then produce a production bundle. Type errors fail the build.
- `npm run lint` — run ESLint across the repo (flat config in `eslint.config.js`).
- `npm run typecheck` — run only `tsc -b` (no bundling). Fast feedback loop for type errors.
- `npm run preview` — serve the built `dist/` for a local smoke test.

There is no test runner configured. Don't fabricate test commands; if a change needs verification, run `npm run build` (which executes the TypeScript project references) and/or hit the relevant screen in `npm run dev`.

## Runtime configuration: `public/_config.js`

The app does not read environment variables. Instead, `public/_config.js` assigns a `window._NGconfig` object before the bundle loads, and TypeScript code reads from it (see `src/services/constantsService.ts`). Things that live there:

- `api_base_url` — every axios call goes here unless the URL is absolute.
- `google_client.id` — Google Sign-In client ID.
- `error_reporting_url`, `maintenance_url` — external services. The maintenance URL is hit on boot in `src/main.tsx`; if it returns a string, the page is redirected to it.
- `storage_prefix` — namespace for localStorage keys.
- `app_title`, `app_colors`, `app_help_link`, `formation_type` — UI configuration.

`public/Instructions-Config.txt` documents the per-deployment setup: the `*.org` files in `public/` are templates that must be renamed (drop the `.org`) and edited before shipping. When working in this repo, treat `_config.js` as deployment configuration — don't bake URLs or client IDs into TS source.

`window._NGconfig` is declared on `Window` in `src/main.tsx`. New runtime config keys should be added to `_config.js` and surfaced through `constantsService.ts` rather than read globally.

## Architecture

### Auth + HTTP

All HTTP goes through `AXIOS_REQUEST` in `src/services/axiosService.ts`, a wrapper around an `axios.create({ baseURL })` instance with two interceptors:
- **Request**: reads the token from `localStorageService` on every request and sets `Authorization`. No in-memory cache to keep in sync.
- **Response**: unwraps `resp.data` on success; on rejection preserves the `AxiosError` shape (so callers can `.catch(({ response }) => ...)`), toasts on `ERR_NETWORK`, and on 401 invokes a registered `onUnauthorized` callback.
- For `FormData` bodies, the wrapper deletes any `Content-Type` so axios infers `multipart/form-data` with the correct boundary.
- For `get`/`delete`, a string `data` appends to the URL; an object becomes query params.

The store registers its 401 handler at boot via `setOnUnauthorized((msg) => store.dispatch(setUnauthorized(msg)))` in `startUserConfigurations` (see `src/store/index.ts`). This callback pattern intentionally breaks the `axios → store → userSlice → axios` import cycle.

`AXIOS_REQUEST<T>(url, method?, data?, headers?, onUploadProgress?)` is generic — pass a type to get a typed response without casts.

Endpoint paths live in `src/services/endPointsService.ts` with JSDoc comments describing method and params. The API is in Spanish (`conv` = process/convocatoria, `cond` = condition/task, `fases` = phases, `resp` = answers/responses, `obs` = observations, `etapas` = stages, `acciones` = actions, `programas` = programs, `noti` = notifications). Add new endpoints here rather than hardcoding strings in slices.

### Redux store

`src/store/index.ts` builds the store from these slices: `user`, `dashboard`, `programs`, `process`, `conditions` (the file is `taskSlice.ts`), `notifications`, `loader`. A wrapper reducer resets `state = undefined` whenever `logout` or `setUnauthorized(<truthy>)` is dispatched and clears `user`/`token` from localStorage — so anything you store in Redux is implicitly tied to the session lifecycle.

Use the typed hooks `useAppSelector` / `useAppDispatch` from `src/hooks/`, never the raw react-redux hooks.

### localStorage is obfuscated

`src/services/localStorageService.ts` (and the `sessionStorageService` it exports) base64-encodes both keys and values, prefixed with `storage_prefix` from `_config.js`. Reading/writing `localStorage.*` directly will not interoperate. Always go through this service.

### User roles

`src/utils/userRolUtils.ts` and `src/interfaces/generic.interface.ts` define the role codes:
`A` = Lead, `B` = Reviewer, `C` = Admin, `D` = View-only, `E` = Supervisor.
Admin/supervisor-only screens are gated by a `<RequireAdmin>` wrapper component in `src/App.tsx` that reads the role via `useAppSelector` and either renders `children` or `<Navigate to="/proceso" replace />`.

### Routing and lazy loading

Routing uses **React Router v7 declarative mode**. Imports come from `react-router` (the unified v7 package — there is no `react-router-dom` dep). The Spanish path names (`/proceso`, `/usuarios`, `/programa`, `/notificaciones`) match the domain language.

Screens in `src/App.tsx` are lazy-loaded with plain `lazy(() => import('./screens/...'))`. Stale-chunk failures after a deploy are handled centrally in `src/components/ErrorHandler/index.jsx`: `componentDidCatch` detects chunk-load errors via a regex covering Vite/Rolldown (`Failed to fetch dynamically imported module`, `error loading dynamically imported module`, `Importing a module script failed`) and webpack-style messages, then triggers `window.location.reload()`. An anti-loop guard via `sessionStorage` prevents infinite reload loops (won't reload again within 10s of the previous reload). For non-chunk errors, ErrorHandler renders an error UI and reports via `sendReport`.

Note: `react-router@7` made `navigate()` return `Promise<void>`. Don't `return navigate(...)` from a `useEffect` callback (it makes the effect async and breaks). Use `navigate(...); return;` instead.

### Forms

The app uses `react-ngm-form`. Form definitions are colocated in `src/forms/` as TS arrays of field descriptors typed as `T_FieldsTypes` (re-exported from the library). `src/utils/formUtils.ts` (esp. `formToSubmitData`) converts form state into the `FormData` shape the backend expects, with conventions like nested date min/max validation and a `dataPrefix` (default `"resp"`) for serialized field names.

### UI and locale

- **Bootstrap 5 built from Sass source** via `src/styles/index.scss` (entry point) — requires `sass` devDep. Customization is split into partials following the canonical Bootstrap order:
  - `_variables.scss` — Sass overrides (`$primary`, `$warning`, `$card-bg`, `$btn-disabled-opacity`, …) BEFORE Bootstrap's `variables` import.
  - `_theme-colors.scss` — `map-merge` with `$theme-colors` AFTER Bootstrap's variables; defines `primary2` as a real theme color so Bootstrap auto-generates `.btn-primary2`, `.bg-primary2`, `.text-primary2`, `.border-primary2`, etc.
  - `_typography.scss`, `_layout.scss`, `_components.scss`, `_helpers.scss`, `_print.scss` — post-Bootstrap layers in cascade order.
  - **No `!important` in customization** — overrides happen at the Sass source, not by CSS specificity battles. Header/login colors still come from `_config.js` `app_colors`.
- **Reactstrap** for component primitives. Caveat: `UncontrolledAccordion` in 9.2.x has a typing bug requiring `toggle={() => {}}` no-op prop (see existing usages in `Phases/PhasesList.tsx`, `AttachmentsTable/AllAttachments.tsx`, `UserResume/index.tsx`).
- **Icons** come from `react-icons/bs` (Bootstrap Icons set). Names use the `Bs` prefix: `BsBell`, `BsPencilSquare`, `BsExclamationCircleFill`, etc. There is NO local icons file.
- The UI is Spanish; dates are formatted with `'es-CO'` locale via `src/utils/dateUtils.ts`.
- Toast/loader are mounted globally in `src/main.tsx` (`react-hot-toast` + `<Loader />` driven by `loaderSlice`); use the `useLoader` hook rather than mounting your own.
- Rich text uses `@ckeditor/ckeditor5-build-classic` — heavyweight (~1MB), so `TextEditor` is `lazy()`-loaded inside `src/utils/mapField.tsx` with a local `<Suspense>` boundary and a fixed-height placeholder. Drag-and-drop uses `@dnd-kit`; spreadsheet IO uses `xlsx` (also lazy — dynamic-imported only inside the export functions of `AttachmentsTable/AllAttachments.tsx` to keep it out of the main chunk).

## Conventions worth following

- Spanish field/endpoint names mirror the backend — don't translate them in TS code or the API breaks.
- Interfaces live under `src/interfaces/*.interface.ts`, one file per domain. Reuse `I_JSONObject` from `generic.interface.ts` for loose-shape backend payloads.
- Screens own their page-level state and dispatch slice actions; cross-screen state goes through Redux. Don't add new global stores outside the slices listed above without updating `src/store/index.ts`.
