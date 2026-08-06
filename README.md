# Data Pipeline

A TypeScript ETL (Extract, Transform, Load) pipeline that scrapes live book data from the web, cleans and validates it, stores it in PostgreSQL using transactional writes, and serves it through a REST API. Built to demonstrate core data engineering skills including web scraping, data transformation, schema design, SQL aggregations, and API development.

## Live Demo

The dashboard and API are coming soon.

> **Note:** The pipeline is designed to run locally or be scheduled on a server. See Getting Started below.

## Project Structure
data-pipeline/
├── src/
│ ├── scraper.ts Extract: fetches pages and parses HTML
│ ├── cleaner.ts Transform: validates and converts raw data to typed records
│ ├── loader.ts Load: transactional bulk insert into PostgreSQL
│ ├── pipeline.ts Orchestrator: runs all three ETL steps in sequence
│ ├── api.ts REST API: Express server with filtering and aggregation
│ └── db.ts Database connection pool
├── dashboard/ React visualization dashboard (see dashboard/README.md)
├── seed.sql Database schema setup
└── .env.example Environment variable template

## Tech Stack

**Pipeline**
- Node.js with TypeScript
- Axios (HTTP requests)
- Cheerio (HTML parsing)
- PostgreSQL (database)
- tsx (TypeScript execution)

**API**
- Express (REST API framework)
- PostgreSQL with parameterized queries
- CORS enabled for local development

## How It Works

The pipeline runs in three sequential steps:

**Extract** — Axios fetches raw HTML from books.toscrape.com, page by page across the full 50-page catalogue, with a 1 second delay between requests to avoid overloading the server. If a page fails to load or returns no books, the scraper logs it and stops early rather than continuing to hit pages that don't exist. Cheerio parses each page and extracts raw book data as strings.

**Transform** — The cleaner converts raw strings into properly typed records. Prices have currency symbols stripped and are parsed to decimals. Star ratings are converted from CSS class names to integers. Availability strings become booleans. Books that fail validation (zero price, zero rating, empty title) are filtered out entirely rather than stored as bad data.

**Load** — Each book is inserted or, if it already exists (matched by its unique URL), updated with the latest scraped data — all wrapped in a single PostgreSQL transaction. If any write fails, the entire load rolls back so the database is never left in a partially loaded state.

## Getting Started

### Prerequisites

- Node.js v18 or higher
- PostgreSQL

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file using `.env.example` as a template:

DB_USER=postgres
DB_HOST=localhost
DB_NAME=data_pipeline
DB_PASSWORD=your_password
DB_PORT=5432

### Database Setup

```bash
psql -U postgres
CREATE DATABASE data_pipeline;
\q
psql -U postgres -d data_pipeline -f seed.sql
```

### Running the Pipeline

```bash
npm run pipeline
```

Scrapes 3 pages (60 books), cleans the data, and loads it into PostgreSQL.

### Running the API

```bash
npm run api
```

The API runs on `http://localhost:4000`.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/books` | Returns all books with optional filters |
| GET | `/api/stats` | Returns summary statistics |
| GET | `/api/ratings` | Returns books grouped by rating with averages |

### Query Parameters for `/api/books`

| Parameter | Example | Description |
|---|---|---|
| `rating` | `?rating=5` | Filter by star rating (1–5) |
| `available` | `?available=true` | Filter by availability |
| `sort` | `?sort=price_asc` | Sort by price_asc, price_desc, or rating_desc |

## Design Decisions

**Transactional loading:** All inserts are wrapped in a single PostgreSQL transaction. If any insert fails mid-load, the entire operation rolls back. The database is never left in a partially loaded state.

**Upsert instead of truncate-and-reload:** Each run inserts new books and updates existing ones (matched by URL) rather than clearing the table first. This avoids unnecessarily rewriting unchanged rows and lays the groundwork for incremental, scheduled runs. Trade-off: a book that's removed from the source site will still remain in the database rather than being cleaned up automatically — see Future Improvements.

**Resilient scraping:** Requests that fail (network errors, bad responses) are caught and logged rather than crashing the whole pipeline; that page is simply treated as empty and the run continues.

**Parameterized queries:** All database queries use parameterized placeholders to prevent SQL injection, including dynamically constructed filter queries in the API.

**Polite scraping:** A 1 second delay is enforced between page requests. Sending requests without rate limiting is inconsiderate to the target server and risks IP blocking.

**Validation after transformation:** Books with empty titles, zero prices, or zero ratings are filtered out after cleaning. This keeps transformation and validation as separate concerns rather than mixing them together.

## Known Limitations

- No category data yet — the source site only exposes category on each book's individual detail page, not the listing page, so this would require a second request per book (~1000 extra
requests, ~17 extra minutes with the current polite delay)
- Books removed from the source site are never removed from the database (no soft-delete or cleanup logic yet)
- No scheduled execution — the pipeline must be run manually

## Future Improvements

- [ ] Schedule pipeline runs automatically with a cron job
- [ ] Deploy API to Render and dashboard to Vercel
- [ ] Add data quality reporting to log rejected records and reasons
- [ ] Add book category data to the schema (requires per-book detail page requests)
- [ ] Soft-delete books that no longer appear in a scrape, instead of leaving stale rows indefinitely