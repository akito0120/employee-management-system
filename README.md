# Employee Management System

## Recommended VSCode Settings

```
{
  "files.insertFinalNewline": true,
  "files.trimTrailingWhitespace": true,
  "editor.formatOnSave": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "files.eol": "\n",
  "i18n-ally.localesPaths": ["src/renderer/public/locales"],
  "i18n-ally.keystyle": "nested",
  "i18n-ally.sourceLanguage": "en"
}
```

## Scripts

- Install dependencies: `npm install`
- Generate migration: `npm run db:generate`
- Build for windows: `npm run build:win`
- Start dev server: `npm run dev`
- Format files: `npm run format`

## Project Structure

```
.
├── docs (documentation and user manual)
├── drizzle (generated migration script, no need to edit manually)
└── src/
    ├── main (backend)/
    │   ├── db/
    │   │   ├── schema.ts (DB schema definition)
    │   │   ├── seed.ts (Seed program)
    │   │   └── index.ts (DB client instantiation)
    │   ├── modules (services)
    │   ├── index.ts (entry point of the backend program)
    │   └── router.ts (tRPC router definition)
    ├── renderer (frontend)/
    │   ├── public (resources)
    │   └── src (React components)
    └── shared (zod schema definitions shared by frontend and backend)
```

