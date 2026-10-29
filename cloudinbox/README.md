# CloudInbox: Serverless Contact Management

A responsive admin dashboard for triaging contact-form messages, plus an embeddable contact form. The frontend runs on **local sample data**; the services layer is prepared for an AWS serverless backend.

> Status: frontend only. No AWS resources, authentication or persistence exist yet. Data resets on refresh.

## Features
- Overview with summary cards (counts calculated from sample data; trend percentages are illustrative)
- Message table: search, status and priority filters, sorting, pagination, bulk actions, loading, empty and no-results states
- Detail drawer: full message, status change, internal notes, delete confirmation
- Analytics: status and priority charts from loaded messages; volume and response times are labeled sample data
- Settings: local profile form, notification preferences, light/dark/system theme; security controls are disabled placeholders
- Contact form (`#/contact`): validation, character limit, loading, success and error states

## Tech stack
React 18, Vite, JavaScript, Recharts, Lucide React, plain CSS with design tokens.

## Run locally
```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Structure
```
src/
  components/  reusable UI (badges, table, drawer, dialogs)
  layouts/     DashboardLayout (sidebar, top bar)
  pages/       Overview, Messages, Analytics, Settings, Help, ContactForm
  hooks/       InboxContext (state), useTheme, useHashPage, useClickOutside
  services/    mockApi.js, httpApi.js, index.js (switch via VITE_USE_MOCK)
  data/        mockData.js
  utils/       formatting helpers
```

## Architecture (planned)
React app on S3 + CloudFront -> API Gateway -> Lambda -> DynamoDB. Cognito authorizer on admin routes, least-privilege IAM role per Lambda, CloudWatch logs and alarms.

## Connecting AWS
1. Copy `.env.example` to `.env.local`, set `VITE_API_BASE_URL` and `VITE_USE_MOCK=false`.
2. Implement `getAuthToken()` in `src/services/httpApi.js` with Cognito.
3. Never place AWS keys in frontend code. Public `POST /messages` needs throttling/WAF and server-side validation.

### API contract
| Method | Path | Auth | Body | Response |
|---|---|---|---|---|
| GET | `/messages` | Admin | none | `Message[]` |
| GET | `/messages/{id}` | Admin | none | `Message` |
| POST | `/messages` | Public (rate limited) | `{name,email,subject,body,priority}` | `Message` (status `new`) |
| PATCH | `/messages/{id}/status` | Admin | `{status: "new"\|"in_progress"\|"resolved"}` | `Message` |
| POST | `/messages/{id}/notes` | Admin | `{text}` | `Message` |
| DELETE | `/messages/{id}` | Admin | none | `{id}` |
| GET | `/analytics` | Admin | none | `{volume:[{day,count}], responseTimes:{...}}` |

`Message`: `{id, name, email, subject, body, priority: "low"|"medium"|"high", status, receivedAt (ISO), notes:[{id,author,text,createdAt}]}`

## Screenshots
Add images to `docs/screenshots/` and link them here.
