# SocietyGuard A/B usability survey

Separate consumer survey project. No links to the study are added to SocietyGuard's product UI.

## Three interactive comparisons

1. **Visitor approval:** vertically stacked action buttons (A) vs side-by-side action buttons (B). Same visitor, information and outcomes.
2. **Complaint submission:** continuous form (A) vs grouped sections (B). Same fields, validation and confirmation.
3. **Complaint tracking:** inline status (A) vs highlighted status banner (B). Same status, team, timeline and escalation time.

Participants try both versions, then choose A/B/equally/neither, rate each version for ease and clarity (1–5), select optional reasons, and leave optional comments. A/B display order is randomized independently per test. Required answers and task attempts are checked before submission. The current version requires no name, email or sign-in.

## Run and deploy

Requires Node.js 22 or later.

```sh
npm ci
npm test
npm run dev
```

Local preview: http://localhost:3000. Without storage configuration the preview explicitly says collection is unavailable, and submission never reports success.

Deploy this directory as a **new** Vercel project, using the Other framework preset and `public` output directory. The root `api` directory contains Vercel serverless endpoints. No build command is required. Do not use the existing sample survey project.

1. Authenticate with `vercel login` and link a new project with `vercel link`.
2. Create and connect a **private** Vercel Blob store to this project. Let Vercel inject `BLOB_READ_WRITE_TOKEN`, or use the documented `BLOB_STORE_ID` / automatic OIDC configuration.
3. Add an encrypted `SURVEY_ADMIN_KEY` environment variable with a random value of at least 24 characters. Keep it with the research team; never put it in frontend code or share it with consumers.
4. Deploy with `vercel deploy --prod`.
5. Verify a synthetic response is saved and appears in the CSV before sharing the production URL. Remove the synthetic test record via the owner's Blob dashboard after checking it.

Official storage setup: https://vercel.com/docs/vercel-blob/using-blob-sdk

## Feedback collection and export

Share the deployed home URL with consumers. The private research page is `/research.html`; enter the research access key to download `societyguard-responses.csv`. The CSV has one row per test, so each participant produces three rows.

Responses are written as separate private JSON documents with a unique response ID. Retries of the same submission do not overwrite the first response. Server-side validation rejects incomplete responses. The export endpoint requires the access key and includes spreadsheet-formula escaping for free text. No responses or secrets are exposed by the public UI.

Reason codes 0–3 map, in order, to the four reason choices shown in each test. For test 1, the expected outcome is Approved; test 2, Submitted; test 3, In progress / Electrical team / Today, 17:00.

## Interpretation

This is an exploratory within-participant A/B usability comparison, not a production randomized conversion experiment. Both variants are visible and learning effects remain despite randomized display order. The task clock starts at first pointer/focus interaction and stops at the first completed attempt. It includes interruptions and is not a controlled speed benchmark. Ratings are the primary feedback; task answers are supporting evidence. The study does not establish statistical significance by itself.

Draft answers are held only in memory until submission. Reloading clears an unfinished survey. No complaint descriptions entered inside practice screens are sent; only the successful submission outcome is recorded.

## Current handoff status

- Completed SocietyGuard file: removed Approval Study frame, home study entry, two Study menu links, and Approval A/B prototype starting points.
- Other Figma links verified unchanged; no broken destinations.
- Survey application and private response/export endpoints implemented.
- Production deployment and real storage round-trip verification are pending authenticated Vercel deployment access.
