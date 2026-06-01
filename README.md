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
APPWRITE_ENDPOINT=https://tor.cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=6a1ddc28001802029c80
APPWRITE_API_KEY=<server-side API key>
APPWRITE_DATABASE_ID=tim_cpg_insights
APPWRITE_SCORECARD_TABLE_ID=scorecard_rows
APPWRITE_IMPORT_RUNS_TABLE_ID=import_runs
```

Vercel can use the checked-in `vercel.json` from the repository root:

- Install Command: `cd frontend && npm install`
- Build Command: `cd frontend && npm run build`
- Output Directory: `frontend/dist`
- Framework Preset: `Vite`

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

## Import The Four Nielsen Pulls

Preferred monthly refresh flow:

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
