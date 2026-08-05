import express from 'express';
import cors from 'cors';
import pool from './db';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// GET all books with optional filters
app.get('/api/books', async (req, res) => {
    try {
        const { rating, availability, sort } = req.query;

        let query = 'SELECT * from books WHERE 1=1';
        const params: any[] = [];

        if (rating) {
            params.push(Number(rating));
            query += ` AND rating = $${params.length}`;
        }

        if (availability === 'true') {
            query += ' AND available = true';
        }

        if (sort === 'price_asc') query += ' ORDER BY price ASC';
        else if (sort === 'price_desc') query += ' ORDER BY price DESC';
        else if (sort === 'rating_asc') query += ' ORDER BY rating ASC';
        else if (sort === 'rating_desc') query += ' ORDER BY rating DESC';
        else query += ' ORDER BY id ASC';

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fethch books'});
    }
});    

// GET summary statistics
app.get('/api/stats', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*) as total_books,
        ROUND(AVG(price), 2) as avg_price,
        MIN(price) as min_price,
        MAX(price) as max_price,
        COUNT(*) FILTER (WHERE available = true) as available_count,
        COUNT(*) FILTER (WHERE rating = 5) as five_star_count
      FROM books
    `);

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// GET books grouped by rating
app.get('/api/ratings', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        rating,
        COUNT(*) as total,
        ROUND(AVG(price), 2) as avg_price,
        MIN(price) as min_price,
        MAX(price) as max_price
      FROM books
      GROUP BY rating
      ORDER BY rating DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});

export default app;