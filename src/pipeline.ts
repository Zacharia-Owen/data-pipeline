import { scrapeBooks } from './scraper';

const run = async () => {
    const rawBooks = await scrapeBooks(1);
    console.log('First book raw data');
    console.log(rawBooks[0]);
}

run();