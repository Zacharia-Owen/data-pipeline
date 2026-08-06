import axios from 'axios';
import * as cheerio from 'cheerio';

export interface RawBook {
    title: string;
    price: string;
    rating: string;
    availability: string;
    url: string;
}

const BASE_URL = 'http://books.toscrape.com/catalogue';

const scrapeOnePage = async (pageNumber: number): Promise<RawBook[]> => {
    const url = pageNumber === 1 
    ? 'http://books.toscrape.com/catalogue/page-1.html'
    : `${BASE_URL}/page-${pageNumber}.html`;

    let response;
    try {
        response = await axios.get(url);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(`Failed to fetch page ${pageNumber} (${url}): ${error.message}`)
        } else {
            console.error(`Failed to fetch page ${pageNumber} (${url}): ${error}`)
        }
        return [];
    }
    const $ = cheerio.load(response.data);
    const books: RawBook[] = [];

    $('article.product_pod').each((_, element) => {
        const title = $(element).find('h3 a').attr('title') || '';
        const price = $(element).find('.price_color').text().trim() || '';
        const rating = $(element).find('p.star-rating').attr('class') || '';
        const availability = $(element).find('.availability').text().trim() || '';
        const relativeUrl = $(element).find('h3 a').attr('href') || '';

        books.push({
            title,
            price,
            rating,
            availability,
            url: relativeUrl,
        });

    });
    return books;
}

export const scrapeBooks = async (pages: number): Promise<RawBook[]> => {
    const allBooks: RawBook[] = [];

    for (let i = 1; i <= pages; i++) {
        console.log(`Scraping page ${i}...`);
        const books = await scrapeOnePage(i);

        if (books.length === 0) {
            console.log(`No books found on page ${i}. Stopping the scraping process.`);
            break;
        }

        allBooks.push(...books);

        await new Promise(resolve => setTimeout(resolve, 1000)); // Delay to avoid overwhelming the server
    }

    console.log(`Scraped ${allBooks.length} books total.`)
    return allBooks;
}