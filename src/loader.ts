import pool from './db'
import { CleanBook } from './cleaner'

export const loadBooks = async (books: CleanBook[]): Promise<void> => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Clearing existing data before fresh data loads
        await client.query('DELETE FROM books');

        let inserted = 0;

        for (const book of books) {
            await client.query(
                `INSERT INTO books (title, price, rating, available, url)
                VALUES ($1, $2, $3, $4, $5)`,
                [book.title, book.price, book.rating, book.availability, book.url]
            );
            inserted++;
        }

        await client.query('COMMIT');
        console.log(`Loaded ${inserted} books into the database.`);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Load failed, rolling back:', error);
    } finally {
        client.release();
    }
};