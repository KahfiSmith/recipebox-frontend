# Vue 3 boilerplate (Vite + TypeScript)

Starter with a scalable, feature-first structure, routing, global styles, and Pinia state already wired.

## Folder layout

```
src
├─ assets/             # static assets (images, fonts)
├─ components/         # ui building blocks (base + common)
├─ composables/        # reusable logic (e.g., useAsyncTask)
├─ features/           # feature-first views/components
│  ├─ home/pages/HomePage.vue
│  └─ misc/pages/NotFoundPage.vue
├─ layouts/            # page shells (DefaultLayout.vue)
├─ router/             # routes + hooks
├─ services/           # API / infrastructure clients (httpClient.ts)
├─ stores/             # Pinia stores
├─ styles/             # global styles and design tokens
└─ main.ts             # app bootstrap
```

Key conventions:
- Feature-first: group pages, components, and services by domain inside `features/`.
- Components: `components/base` for low-level UI primitives; `components/common` for shared structural pieces.
- Routing: `router/routes.ts` exports typed routes; meta titles propagate via `router.afterEach`.
- State: Pinia is ready; `stores/counter.ts` is an example of setup-style store.
- Styling: `styles/main.css` defines tokens/typography and is imported once in `main.ts`.
- Services: `services/httpClient.ts` is a small fetch wrapper to centralize API calls.

## Commands

```sh
pnpm install   # install deps
pnpm dev       # start dev server
pnpm build     # type-check + production build
pnpm lint      # eslint with caching
pnpm format    # prettier on src/
```

## Recommended tooling

- VS Code + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (disable Vetur).
- Browser devtools: [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) (Chrome/Edge) or [Firefox addon](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/).
