import { RawBook } from './scraper';

export interface CleanBook {
  title: string;
  price: number;
  rating: number;
  availability: boolean;
  url: string;
};

const ratingMap: Record<string, number> ={
    'One': 1,
    'Two': 2,
    'Three': 3,
    'Four': 4,
    'Five': 5
};

const cleanPrice = (raw: string): number => {
    const cleaned = raw.replace(/[^0-9.]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
};

const cleanRating = (raw: string): number => {
    const parts = raw.split(' ');
    const word = parts[parts.length - 1];
    return ratingMap[word] ?? 0;
}

const cleanAvailable = (raw: string): boolean => {
    return raw.toLowerCase().includes('in stock');
}

const cleanUrl = (raw: string): string => {
  const cleaned = raw.replace(/^(\.\.\/)+/, '');
  return `https://books.toscrape.com/catalogue/${cleaned}`;
};

export const cleanBooks = (rawBooks: RawBook[]): CleanBook[] => {
    const cleaned = rawBooks.map(book => ({
        title: book.title.trim(),
        price: cleanPrice(book.price),
        rating: cleanRating(book.rating),
        availability: cleanAvailable(book.availability),
        url: cleanUrl(book.url)
    }));

    const valid = cleaned.filter(book =>
        book.title.length > 0 &&
        book.price > 0 &&
        book.rating > 0
    );

    console.log(`Cleaned ${rawBooks.length} books, ${valid.length} valid`);
    return valid;
}