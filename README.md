# yWorkouty

[日本語版 README](README.ja.md)

A single-user web app for logging strength training, built with Next.js and Supabase to run on Cloudflare Workers. You run your own copy: one GitHub account records workouts, and anyone can view the home page.

## Features

- Record a workout on `/record` (記録する): pick a body part and an exercise, then enter weight (kg), reps and sets. The exercises are a fixed list of nine for chest, back and arms in `src/lib/exercises.ts`
- The 前回コピー button fills in weight, reps and sets from your latest record of the selected exercise
- The home page shows a heatmap of sets per day for chest, back and arms over the last 12 weeks, without signing in

## Setup

Requires Node.js 20 or later, a Supabase project and, for deployment, a Cloudflare account.

1. Install dependencies: `npm ci`
2. Create the tables. Either run `npx supabase login`, `npx supabase link --project-ref <project-ref>` and `npx supabase db push` to apply `supabase/migrations/`, or paste `supabase/schema.sql` into the Supabase SQL editor
3. Create a GitHub OAuth App with the callback URL `https://<project-ref>.supabase.co/auth/v1/callback`. In the Supabase dashboard, enable the GitHub auth provider with the app's client ID and secret, and add `<origin>/auth/callback` (for example `http://localhost:3000/auth/callback`) to the allowed redirect URLs
4. Copy `env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from your Supabase project's API settings. Both are embedded at build time, so they must be set when you build, not only at runtime
5. Set `ALLOWED_GITHUB_ID` in `src/lib/supabase/middleware.ts` to your numeric GitHub user ID (`gh api user --jq .id`). Other accounts are sent back to the home page when they open `/record`
6. Start the dev server with `npm run dev` and open http://localhost:3000

## Deploy to Cloudflare Workers

1. In `wrangler.toml`, change `name` and `account_id`, replace or remove `[[routes]]`, and replace the values in `[vars]` with your own
2. Sign in with `npx wrangler login`, then run `npm run deploy`. It builds with OpenNext (`npm run build:cf`) and runs `wrangler deploy`

`.github/workflows/deploy.yml` deploys on every push to `main`. It reads the repository secrets `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Set them, or delete the workflow.

## Limitations

- Every record is public: anyone can read all rows of `training_logs` through the Supabase API, and the home page shows the records of every user
- The GitHub ID check guards only the `/record` page, and it reads `user_metadata`, which signed-in users can change themselves. The database policies let any signed-in user insert, update and delete their own rows through the Supabase API, and those rows appear on the home page
- Dates are stored as the UTC date at the time of recording
- The 知識メモ page lists placeholder notes, and their links lead to pages that do not exist
- The interface is in Japanese

## Build

```bash
npm ci
npm run build      # Next.js production build
npm run build:cf   # Cloudflare Workers bundle in .open-next/
```

## License

[MIT](LICENSE)
