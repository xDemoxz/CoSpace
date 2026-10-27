# CoSpace_NicolasGuarin

# CoSpace_NicolasGuarin

A Next.js 16 (App Router + Turbopack) application built with feature-based.

This project is set up with ESLint + Prettier for code quality.

## Built With

- [Next.js 16](https://nextjs.org/) (App Router + Turbopack)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)

## Getting Started

First, install dependencies and run the development server:

```sh
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts

| Script                 | Description                          |
| ---------------------- | ------------------------------------ |
| `npm run dev`          | Start development server (Turbopack) |
| `npm run build`        | Build for production                 |
| `npm run start`        | Start production server              |
| `npm run lint`         | Run ESLint                           |
| `npm run lint:fix`     | Run ESLint with auto-fix             |
| `npm run format`       | Format code                          |
| `npm run format:check` | Verify code is formatted             |
| `npm run typecheck`    | Type-check the project (tsc -b)      |

## Project Structure

This project is built on **Next.js 16 (App Router + Turbopack)** with React Server Components (RSC) by default.

```
src/
├── app/          # Next.js App Router (Server & Client Components)
├──     ├── layout.tsx    # Root layout (Server Component)
    ├── page.tsx      # Home page (Server Component)
    └── globals.css   # Tailwind CSS & global styling directives
├── features/     # Feature modules (pages, hooks, api, types)
├── shared/       # Reusable, domain-agnostic resources
└──     ├── components/ # Shared UI components & primitives
    ├── hooks/      # Shared custom hooks
    ├── layouts/    # High-level layout wrappers
    ├── stores/     # Global state stores
    ├── types/      # Global TypeScript definitions
    └── utils/      # Pure utility functions
```

## Authors

- **Your Name** - [@your_twitter](https://twitter.com/your_twitter) - your@email.com

See also the list of [contributors](https://github.com/your_username/CoSpace_NicolasGuarin/graphs/contributors) who participated in this project.

## License

Distributed under the MIT License. See `LICENSE` for more information.
