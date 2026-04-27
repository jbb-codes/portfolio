# Portfolio

An Angular 18 personal portfolio application with dark/light theme toggle and responsive home page.

## Prerequisites

- Node.js 18+
- npm 9+
- Angular CLI 18: `npm install -g @angular/cli`

## Setup

```bash
npm install
```

<!-- AUTO-GENERATED: scripts -->
## Available Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start development server at `http://localhost:4200` with hot reload |
| `npm run build` | Production build — output goes to `dist/` |
| `npm run watch` | Development build in watch mode |
| `npm test` | Run unit tests via Karma/Jasmine |
| `ng generate component <name>` | Scaffold a new component |
<!-- END AUTO-GENERATED: scripts -->

## Project Structure

```
src/
  app/
    pages/
      home/          # Home page component
    app.component.*  # Root component with theme toggle
    app.routes.ts    # Route definitions
  styles.css         # Global styles and CSS custom properties
```

## Testing

Tests use Karma + Jasmine. Run with:

```bash
npm test
```

Coverage reports are generated in `coverage/`.

## Further Help

- `ng help` — Angular CLI reference
- [Angular CLI Overview](https://angular.dev/tools/cli)
