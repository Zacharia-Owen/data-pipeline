import { useEffect, useState } from 'react';
import axios from 'axios';
import StatsCards from './components/StatsCards';
import RatingsChart from './components/RatingsChart';
import BooksTable from './components/BooksTable';

const API_URL = 'http://localhost:4000';

interface Stats {
  total_books: number;
  avg_price: number;
  min_price: number;
  max_price: number;
  available_count: number;
  five_star_count: number;
}

interface Rating {
  rating: number;
  total: number;
  avg_price: number;
  min_price: number;
  max_price: number;
}

interface Book {
  id: number;
  title: string;
  price: number;
  rating: number;
  available: boolean;
  url: string;
}

export interface AppData {
  stats: Stats | null;
  ratings: Rating[];
  books: Book[];
}

function App() {
  const [data, setData] = useState<AppData>({
    stats: null,
    ratings: [],
    books: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get(`${API_URL}/api/stats`),
      axios.get(`${API_URL}/api/ratings`),
      axios.get(`${API_URL}/api/books?sort=rating_desc`)
    ]).then(([statsRes, ratingsRes, booksRes]) => {
      setData({
        stats: statsRes.data,
        ratings: ratingsRes.data,
        books: booksRes.data
      });
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <p>Loading dashboard...</p>
    </div>
  );

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto'}}>
      <h1 style={{ marginBottom: '0.5rem' }}>Books Data Dashboard</h1>
      <p style={{ color: '#666', marginBottom: '1rem'}}>
        Data scraped from books.toscrape.com - {data.stats?.total_books} books loaded.
      </p>

      <StatsCards stats={data.stats} />
      <RatingsChart ratings={data.ratings} />
      <BooksTable books={data.books} />
    </div>
  );
}

export default App;