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

**Extract** — Axios fetches raw HTML from books.toscrape.com page by page, with a 1 second delay between requests to avoid overloading the server. Cheerio parses each page and extracts raw book data as strings.

**Transform** — The cleaner converts raw strings into properly typed records. Prices have currency symbols stripped and are parsed to decimals. Star ratings are converted from CSS class names to integers. Availability strings become booleans. Books that fail validation (zero price, zero rating, empty title) are filtered out entirely rather than stored as bad data.

**Load** — All inserts are wrapped in a single PostgreSQL transaction. If any insert fails, the entire load rolls back so the database is never left in a partially loaded state. Existing data is cleared before each run to ensure the database always reflects the most recent scrape.

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

**Truncate and reload:** On each pipeline run, existing data is cleared before fresh data is loaded. This guarantees the database always reflects the most recent scrape rather than accumulating stale or duplicate records.

**Parameterized queries:** All database queries use parameterized placeholders to prevent SQL injection, including dynamically constructed filter queries in the API.

**Polite scraping:** A 1 second delay is enforced between page requests. Sending requests without rate limiting is inconsiderate to the target server and risks IP blocking.

**Validation after transformation:** Books with empty titles, zero prices, or zero ratings are filtered out after cleaning. This keeps transformation and validation as separate concerns rather than mixing them together.

## Known Limitations

- Pipeline currently scrapes 3 pages (60 books) rather than the full 50 pages
- No incremental loading — each run clears and reloads all data
- No scheduled execution — the pipeline must be run manually

## Future Improvements

- [ ] Scrape all 50 pages for a complete dataset
- [ ] Add book category data to the schema
- [ ] Implement incremental loading with upsert to avoid full reloads
- [ ] Schedule pipeline runs automatically with a cron job
- [ ] Deploy API to Render and dashboard to Vercel
- [ ] Add data quality reporting to log rejected records and reasons
