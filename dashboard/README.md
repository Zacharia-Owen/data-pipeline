# Books Dashboard

A React/TypeScript data visualization dashboard for the Books Data Pipeline project. Presents scraped and cleaned book data through summary statistics, an interactive bar chart, and a full data table. Built as the visualization layer of a complete ETL pipeline.

## Live Demo

Coming soon — will be deployed to Vercel once the API is deployed to Render.

> **Note:** The dashboard requires the data-pipeline API running locally on port 4000. See Getting Started below.

## Tech Stack

- React 18 with TypeScript
- Vite (build tool and dev server)
- Axios (HTTP requests)
- Recharts (data visualization)

## Features

- Summary stat cards showing total books, average price, lowest and highest price, in-stock count, and five star count
- Ratings distribution bar chart comparing book count and average price across all star ratings
- Full books table with title, price, star rating, availability status, and direct links to each book

## Getting Started

### Prerequisites

- Node.js v18 or higher
- The data-pipeline API running locally on port 4000 (see companion repo)

### Installation

```bash
cd dashboard
npm install
```

### Running the Dashboard

```bash
npm run dev
```

The dashboard starts at `http://localhost:5173`.

The pipeline API must be running simultaneously. From the `data-pipeline` root:

```bash
npm run api
```

## API Endpoints Used

| Endpoint | Used for |
|---|---|
| `GET /api/stats` | Summary stat cards |
| `GET /api/ratings` | Ratings bar chart |
| `GET /api/books?sort=rating_desc` | Books data table |

## Design Decisions

**Parallel API requests:** All three API calls are fired simultaneously using `Promise.all` rather than sequentially. The dashboard loads in the time it takes for the slowest single request rather than the sum of all three.

**Recharts for visualization:** Recharts integrates cleanly with React's component model and handles responsive sizing out of the box, making it straightforward to build charts that work across different screen sizes without additional configuration.

**Standalone Vite app:** The dashboard lives inside the data-pipeline repo but is a completely independent Vite project. It can be deployed separately, replaced, or extended without touching any of the ETL or API code.

## Known Limitations

- No client-side filtering — all filtering happens at the API level
- No search functionality for book titles
- Requires the local API to be running — no deployed version yet

## Future Improvements

- [ ] Add client-side filtering by rating and price range
- [ ] Add a search bar for filtering by title
- [ ] Add a price distribution histogram
- [ ] Deploy to Vercel with the API URL configurable via environment variable
