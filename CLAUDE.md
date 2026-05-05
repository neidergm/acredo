# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server.
- `npm run build` — type-check the whole project (`tsc -b`) then produce a production bundle. Type errors fail the build.
- `npm run lint` — run ESLint across the repo (flat config in `eslint.config.js`).
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

All HTTP goes through `AXIOS_REQUEST` in `src/services/axiosService.ts`. It:
- Prepends `BASE_URL` unless the URL is already absolute.
- Pulls the bearer token from a module-level cache, falling back to `localStorageService.getItem("token")`.
- Switches to multipart headers when `data instanceof FormData`.
- For `get`/`delete`, sends a string `data` as URL suffix and an object `data` as query params.
- On 401, dispatches `setUnauthorized("Su sesión a expirado")` (wired up in `src/store/index.ts` via `setOtherAxiosConfig`), which the store reducer interprets as "wipe user/token from localStorage and reset all state."

Endpoint paths live in `src/services/endPointsService.ts` with JSDoc comments describing method and params. The API is in Spanish (`conv` = process/convocatoria, `cond` = condition/task, `fases` = phases, `resp` = answers/responses, `obs` = observations, `etapas` = stages, `acciones` = actions, `programas` = programs, `noti` = notifications). Add new endpoints here rather than hardcoding strings in slices.

### Redux store

`src/store/index.ts` builds the store from these slices: `user`, `dashboard`, `programs`, `process`, `conditions` (the file is `taskSlice.ts`), `notifications`, `loader`. A wrapper reducer resets `state = undefined` whenever `logout` or `setUnauthorized(<truthy>)` is dispatched and clears `user`/`token` from localStorage — so anything you store in Redux is implicitly tied to the session lifecycle.

Use the typed hooks `useAppSelector` / `useAppDispatch` from `src/hooks/`, never the raw react-redux hooks.

### localStorage is obfuscated

`src/services/localStorageService.ts` (and the `sessionStorageService` it exports) base64-encodes both keys and values, prefixed with `storage_prefix` from `_config.js`. Reading/writing `localStorage.*` directly will not interoperate. Always go through this service.

### User roles

`src/utils/userRolUtils.ts` and `src/interfaces/generic.interface.ts` define the role codes:
`A` = Lead, `B` = Reviewer, `C` = Admin, `D` = View-only, `E` = Supervisor.
Admin-only screens use the `screenAvalaible` helper in `src/App.tsx`, which redirects non-admin/non-supervisor users to `/proceso`.

### Routing and lazy loading

All screens in `src/App.tsx` are lazy-loaded through `lazyLoaderComponents` (`src/services/lazyLoadingService.ts`), which retries dynamic-import failures up to 3 times at 1.5s intervals — useful when a deploy invalidates cached chunks. When adding a screen, follow the same pattern instead of plain `React.lazy`.

Routes use `BrowserRouter` with `basename='/'`. The Spanish path names (`/proceso`, `/usuarios`, `/programa`, `/notificaciones`) match the domain language.

### Forms

The app uses `react-ngm-form`. Form definitions are colocated in `src/forms/` as TS arrays of field descriptors typed as `T_FieldsTypes` (re-exported from the library). `src/utils/formUtils.ts` (esp. `formToSubmitData`) converts form state into the `FormData` shape the backend expects, with conventions like nested date min/max validation and a `dataPrefix` (default `"resp"`) for serialized field names.

### UI and locale

- Bootstrap 5 + Reactstrap. `src/App.css` and `src/custom-colors.css` carry app-specific styles; header/login colors come from `_config.js` `app_colors`.
- The UI is Spanish; dates are formatted with `'es-CO'` locale via `src/utils/dateUtils.ts`.
- Toast/loader are mounted globally in `src/main.tsx` (`react-hot-toast` + `<Loader />` driven by `loaderSlice`); use the `useLoader` hook rather than mounting your own.
- Rich text uses `@ckeditor/ckeditor5-build-classic`; drag-and-drop uses `@dnd-kit`; spreadsheet IO uses `xlsx`.

## Conventions worth following

- Spanish field/endpoint names mirror the backend — don't translate them in TS code or the API breaks.
- Interfaces live under `src/interfaces/*.interface.ts`, one file per domain. Reuse `I_JSONObject` from `generic.interface.ts` for loose-shape backend payloads.
- Screens own their page-level state and dispatch slice actions; cross-screen state goes through Redux. Don't add new global stores outside the slices listed above without updating `src/store/index.ts`.
