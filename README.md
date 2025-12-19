# react-full-stack-boilerplate

## Deployment

This project is configured for deployment to Cloudflare using Pulumi for Infrastructure as Code.

- **Quick Start**: See [QUICKSTART-DEPLOYMENT.md](./QUICKSTART-DEPLOYMENT.md)
- **Full Guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Infrastructure**: See [infrastructure/README.md](./infrastructure/README.md)

## Stack

- Package manager
  - [x] PNPM
- Infrastructure
  - [x] IaC: Pulumi -- sst.dev
  - [x] Cloud: Cloudflare
  - [x] CI/CD: GH actions
  - [ ] CI/CD workers: Blacksmith
  - [ ] Secrets: phase.dev -- 1password / auth0 / doppler? / frontegg? / AWS / GCP
- Observibility
  - [x] Logger: pino -- winston
  - [ ] Uptime: betterstack
  - [x] Logs: betterstack -- Sentry
  - [x] Errors: Sentry
  - [ ] Incidents: betterstack
  - [ ] Analytics: Posthog / Cloudflare / Plausible
- Testing
  - [ ] Unit: vitest
  - [ ] Components: testing-library
  - [ ] E2E: playwright
  - [ ] Email trap: mailhog
  - [ ] Linting: Eslint
  - [ ] Formatting: Prettier
- Messaging
  - [x] Email: Sendgrid / Resend
  - [x] SMS: Twilio
  - [x] Push: Expo
- Misc
  - [x] Auth: Clerk
  - [x] Feature flags: Flagsmith -- Posthog
  - [x] Payments: Stripe
  - [ ] Intl: i18next
- Backend
  - [ ] Filestorage: Supabase / AWS / GCP
  - [x] Database: Supabase -- CockroachDB / AWS / GCP
  - [x] ORM: Drizzle
  - [ ] Email templates: MJML / React Email
- API
  - [x] Framework: fastify -- RedwoodSDK / Hono
- App: Web
  - [x] Framework: React Router
  - [x] Styling: Tailwind -- stitches / linaria / pandacss
  - [x] Components: shadcn
- App: Mobile
  - [ ] Framework: React Native / Expo
- App: Native
  - [ ] Framework: Electron
