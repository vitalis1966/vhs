

## Plan: Upgrade Vite from v5 to v6

### Summary
Upgrade Vite from `^5.4.19` to `^6.x` and update the companion plugin `@vitejs/plugin-react-swc` to its Vite 6-compatible version.

### Changes

**1. Update `package.json`**
- `vite`: `^5.4.19` → `^6.0.0`
- `@vitejs/plugin-react-swc`: `^3.11.0` → `^4.0.0` (required for Vite 6 compatibility)

**2. Update `vite.config.ts`**
- No breaking config changes expected — the current config uses standard options that are compatible with Vite 6
- Verify `build.target: 'es2020'` and `modulePreload` settings still work (they do in Vite 6)

**3. Update `vitest.config.ts`**
- No changes needed — Vitest 3.x already supports Vite 6

**4. Reinstall dependencies**
- Run `bun install` to update the lockfile

**5. Verify build**
- Run `bun run build` to confirm no breaking changes

### Risk
Low risk — this project uses standard Vite features with no custom plugins beyond `lovable-tagger` and `react-swc`. The main breaking change in Vite 6 is the new Environment API (internal) and some minor defaults changes that don't affect this config.

