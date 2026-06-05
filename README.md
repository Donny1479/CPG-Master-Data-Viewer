# CPG Master Data Viewer

Backend foundation for a Tim Hortons CPG insights dashboard powered by Nielsen scorecard workbooks.

## Backend Direction

Appwrite is a good fit for the first version if we treat it as the application backend:

- Store uploaded Nielsen workbooks in Appwrite Storage.
- Store cleaned scorecard rows in Appwrite TablesDB.
- Use Appwrite Auth and Teams for internal access.
- Precompute the dashboard-friendly rows from the four Nielsen pulls at import time instead of relying on ad hoc BI-style aggregation.

For very large history, advanced pivots, or arbitrary analyst queries, add a warehouse layer later. The current July workbook has about 39k master rows, which is comfortably small for an Appwrite-backed MVP.

## Local Setup

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
```

Fill `.env` with your Appwrite endpoint, project ID, and an API key with database write access.

## Frontend

The dashboard frontend lives in `frontend/` and is configured for Vercel. It uses the root `api/dashboard.js` serverless route so the Appwrite API key stays server-side.

Required Vercel environment variables:

```text
# Server-side API route. Keep APPWRITE_API_KEY private.
APPWRITE_ENDPOINT=https://tor.cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=6a1ddc28001802029c80
APPWRITE_API_KEY=<server-side API key>
APPWRITE_DATABASE_ID=tim_cpg_insights
APPWRITE_SCORECARD_TABLE_ID=scorecard_rows
APPWRITE_IMPORT_RUNS_TABLE_ID=import_runs
APPWRITE_IMPORT_METADATA_TABLE_ID=import_metadata

# Browser login page. These are public client config values.
VITE_APPWRITE_ENDPOINT=https://tor.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=6a1ddc28001802029c80
```

`APPWRITE_ENDPOINT`/`APPWRITE_PROJECT_ID` can also fall back to the matching `VITE_` values, but keeping both pairs in Vercel makes the configuration easier to audit.

Vercel can use the checked-in `vercel.json` from the repository root:

- Install Command: `cd frontend && npm install`
- Build Command: `cd frontend && npm run build`
- Output Directory: `frontend/dist`
- Framework Preset: `Vite`

## Login Setup

The frontend uses Appwrite Auth for email/password login. The `/api/dashboard` route also validates an Appwrite JWT before returning dashboard data.
The login form displays `Username` and resolves it to the Appwrite user's email before creating the Appwrite session. A username can be the Appwrite user's `name`, the email prefix before `@`, or the full email address.

To create logins:

1. In Appwrite Console, open project `6a1ddc28001802029c80`.
2. Go to `Auth` > `Settings` and ensure `Email/Password` is enabled.
3. Go to `Auth` > `Users` > `Create user`.
4. Enter the team member username in `Name`, their email, and a temporary password.
5. Give that username/password to the user; they can sign in on the TimsIQ login page.

The server-side `APPWRITE_API_KEY` must include permission to read/list users, because `/api/resolve-user` maps usernames to Appwrite emails before login.

To allow the deployed site to use Appwrite Auth:

1. In Appwrite Console, go to `Project` > `Platforms`.
2. Add a `Web` platform for each hostname that will use the login page.
3. Add your production Vercel hostname, any custom domain, and `localhost` for local development.
4. In Vercel, set `VITE_APPWRITE_ENDPOINT` and `VITE_APPWRITE_PROJECT_ID` for Production and Preview along with the server-side Appwrite variables above.

If login says `Failed to fetch`, the browser is usually being blocked by Appwrite platform/CORS settings. Add the exact hostname shown in the browser address bar as an Appwrite `Web` platform. Use only the hostname, such as `timsiq.vercel.app`, not `https://timsiq.vercel.app/`.

## Inspect The Current Reference Workbook

```powershell
python -m backend.inspect_workbook "C:\Users\rbide014\Downloads\July_Coffee Category and Customer Scorecard .xlsx"
```

## Create Appwrite Tables

```powershell
python -m backend.setup_appwrite
```

## Import Workbook Rows

This compatibility path reads the current Excel `Master Table`. It is useful for validating against the reference workbook, but it is not the preferred monthly refresh flow.

```powershell
python -m backend.import_workbook "C:\Users\rbide014\Downloads\July_Coffee Category and Customer Scorecard .xlsx" --dry-run
```

Then import:

```powershell
python -m backend.import_workbook "C:\Users\rbide014\Downloads\July_Coffee Category and Customer Scorecard .xlsx"
```

The importer reads the workbook `Master Table`, normalizes the Excel headers into Appwrite-safe column keys, and upserts rows in batches.

## Import The Nielsen Pulls

Preferred monthly coffee refresh flow:

```powershell
python -m backend.import_nielsen_pulls "C:\path\to\Topline Brands.xlsx" "C:\path\to\Single Serve.xlsx" "C:\path\to\Instant.xlsx" "C:\path\to\R&G.xlsx" --dry-run
```

Then import:

```powershell
python -m backend.import_nielsen_pulls "C:\path\to\Topline Brands.xlsx" "C:\path\to\Single Serve.xlsx" "C:\path\to\Instant.xlsx" "C:\path\to\R&G.xlsx"
```

You can also pass one Nielsen export workbook if it contains all four tabs. The compiler auto-detects:

- Topline Brands
- Single Serve
- Instant
- R&G

It then normalizes `NUMBER OF PACKETS` to `SIZE`, builds the dashboard `Products` field, filters out Nielsen footer rows, and appends the four pulls into one scorecard row stream.

The importer also writes compact dashboard metadata to `import_metadata` so the Vercel API can populate dropdowns without scanning the full scorecard table on every request.

Preferred monthly soup and chili refresh flow:

```powershell
python -m backend.import_nielsen_pulls --business soup_chili "C:\path\to\Soup and Chili Scorecard.xlsx" --dry-run
python -m backend.import_nielsen_pulls --business soup_chili "C:\path\to\Soup and Chili Scorecard.xlsx"
```

The soup/chili compiler auto-detects the three Nielsen raw tabs:

- Ready to Serve
- Condensed
- Chili

Coffee and soup/chili imports are tracked as separate business datasets, so a new soup import will not replace the coffee dashboards and a new coffee import will not replace the soup dashboards.

## Import The Coffee Dashboard Workbook

The expanded coffee dashboard tabs are imported as a separate `coffee_dashboard` dataset. This compiler reads the four raw dashboard tabs and derives the chart-ready period/product fields internally; it does not depend on future `MasterTable` uploads.

```powershell
python -m backend.import_nielsen_pulls --business coffee_dashboard "C:\path\to\July_Dashboard_Coffee Category.xlsm" --dry-run
python -m backend.import_nielsen_pulls --business coffee_dashboard "C:\path\to\July_Dashboard_Coffee Category.xlsm"
```

The raw tabs expected by the compiler are:

- `1-Topline Brands`
- `2-Single Serve`
- `3-Instant`
- `4-R&G`

The first three website dashboard tabs built from this dataset are Share Trended, Price Compare, and Market View.
