interface Book {
    id: number;
    title: string;
    price: number;
    rating: number;
    available: boolean;
    url: string;
}

const stars = (rating: number) => '⭐'.repeat(rating);

function BooksTable({ books }: { books: Book[] }) {
  return (
    <div style={{
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ marginBottom: '1rem' }}>All Books</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Title</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Price</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Rating</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Available</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Link</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.75rem' }}>{book.title}</td>
                <td style={{ padding: '0.75rem' }}>£{book.price}</td>
                <td style={{ padding: '0.75rem' }}>{stars(book.rating)}</td>
                <td style={{ padding: '0.75rem' }}>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    backgroundColor: book.available ? '#d4edda' : '#f8d7da',
                    color: book.available ? '#155724' : '#721c24',
                    fontSize: '0.85rem'
                  }}>
                    {book.available ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <a href={book.url} target="_blank" rel="noreferrer"
                    style={{ color: '#2c3e50' }}>
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BooksTable;