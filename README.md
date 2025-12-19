# react-full-stack-boilerplate

## Deployment

This project is configured for deployment to Cloudflare using Pulumi for Infrastructure as Code.

- **Quick Start**: See [QUICKSTART-DEPLOYMENT.md](./QUICKSTART-DEPLOYMENT.md)
- **Full Guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Infrastructure**: See [infrastructure/README.md](./infrastructure/README.md)

## Stack

- Package manager
  - [ ] PNPM
- Infrastructure
  - [x] IaC: Pulumi
  - [x] Cloud: Cloudflare
  - [x] CI/CD: GH actions
  - [ ] CI/CD workers: Blacksmith
  - [ ] Secrets: 1password / auth0 / doppler? / frontegg? / AWS / GCP
- Observibility
  - [ ] Logger: winston / pino
  - [ ] Uptime: betterstack
  - [ ] Logs: betterstack / Sentry
  - [ ] Errors: Sentry
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
  - [ ] Email: Sendgrid / Resend
  - [ ] SMS: Twilio
  - [ ] Push: Expo
- Misc
  - [ ] Auth: Clerk
  - [ ] Feature flags: Flagsmith / Posthog
  - [ ] Payments: Stripe
  - [ ] Intl: i18next
- Backend
  - [ ] Filestorage: Supabase / AWS / GCP
  - [ ] Database: Supabase / CockroachDB / AWS / GCP
  - [ ] ORM: Drizzle
  - [ ] Email templates: MJML / React Email
- API
  - [ ] Framework: RedwoodSDK / Hono / fastify
- App: Web
  - [x] Framework: React Router
  - [ ] Styling: Tailwind / stitches / linaria / pandacss
  - [ ] Components: shadcn
- App: Mobile
  - [ ] Framework: React Native / Expo
- App: Native
  - [ ] Framework: Electron
