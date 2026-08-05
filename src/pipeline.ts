import { scrapeBooks } from './scraper';
import { cleanBooks } from './cleaner';

const run = async () => {
    const rawBooks = await scrapeBooks(1);
    const cleanedBooks = cleanBooks(rawBooks);

    console.log('First book cleaned:');
    console.log(cleanedBooks[0]);
}

run();