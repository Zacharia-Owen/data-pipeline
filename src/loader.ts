import pool from './db'
import { CleanBook } from './cleaner'

export const loadBooks = async (books: CleanBook[]): Promise<void> => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const beforeCount = await client.query('SELECT COUNT(*) FROM books');
        const countBefore = parseInt(beforeCount.rows[0].count);

        for (const book of books) {
            await client.query(
                `INSERT INTO books (title, price, rating, available, url)
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (url) DO UPDATE
                SET title = EXCLUDED.title,
                    price = EXCLUDED.price,
                    rating = EXCLUDED.rating,
                    available = EXCLUDED.available,
                    scraped_at = NOW()`,
                [book.title, book.price, book.rating, book.availability, book.url]
            );
        }

        const afterCount = await client.query('SELECT COUNT(*) FROM books');
        const countAfter = parseInt(afterCount.rows[0].count);
        const newBooks = countAfter - countBefore;
        const updatedBooks = books.length - newBooks;

        await client.query('COMMIT');
        console.log(`Loaded ${newBooks} new books, updated ${updatedBooks} existing books.`);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Load failed, rolling back:', error);
        throw error;
    } finally {
        client.release();
    }
};