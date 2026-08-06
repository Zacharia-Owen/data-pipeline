import { scrapeBooks } from './scraper';
import { cleanBooks } from './cleaner';
import { loadBooks } from './loader';

const run = async () => {
    console.log ('Starting the book scraping, cleaning, and loading process...');
    console.log('');

    // Extracting raw data
    console.log('Scraping raw book data...');
    const rawBooks = await scrapeBooks(50);
    console.log('');

    // Cleaning the data
    console.log('Cleaning the scraped book data...');
    const cleanedBooks = cleanBooks(rawBooks);
    console.log('');

    // Loading the data into the database
    console.log('Loading cleaned book data into the database...');
    await loadBooks(cleanedBooks);
    console.log('');

    console.log('Process completed successfully.');
    process.exit(0);
};

run().catch(error => {
    console.error('Pipeline execution failed:', error);
    process.exit(1);
});