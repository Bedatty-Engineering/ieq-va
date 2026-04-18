<table><tr>
<td><img src="https://github.com/Bedatty-Engineering.png" alt="Bedatty Engineering" width="80" /></td>
<td><h1>AGENTS.md</h1></td>
</tr></table>

Guidelines for AI agents working in this repository.

## Project Overview

Static institutional church website built with Astro, Tailwind CSS, and TypeScript. The current version is intentionally simple and content-first, but the structure must remain ready for future additions such as authentication, events, and API integrations.

## Commands

```bash
npm run dev
npm run build
npm run preview
```

`npm run build` is the main acceptance gate.

## Repository Structure

```text
src/
  components/      # Reusable Astro UI components
  layouts/         # Base layout with SEO and site chrome
  lib/             # Placeholder data-layer entrypoints
  pages/           # File-based routes
  styles/          # Tailwind layers and global classes
  types/           # Shared domain types
public/
  images/          # Static images
```

## Conventions

- Keep the site fully static in this version.
- Do not add authentication, backend routes, or event logic.
- Keep UI concerns separate from future data-layer files in `src/lib`.
- Type Astro props explicitly with `interface Props`.
- Use `BaseLayout.astro` for page shell and SEO metadata.
- Validate changes with `npm run build`.

## Styling

- Use Tailwind utilities for layout and spacing.
- Prefer semantic global classes from `src/styles/global.css` for recurring patterns.
- Keep the look warm, minimal, and church-friendly.
- Do not introduce client-side frameworks.

