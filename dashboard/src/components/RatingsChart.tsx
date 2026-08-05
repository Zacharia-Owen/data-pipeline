import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Rating {
    rating: number;
    total: number;
    avg_price: number;
}

function RatingsChart({ ratings }: { ratings: Rating[] }) {
    const chartData = ratings.map(r => ({
        rating: `${r.rating} ⭐`,
        books: Number(r.total),
        avg_price: Number(r.avg_price)
    }));

    return (
        <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            marginBottom: '2rem',
        }}>
            <h2 style={{ marginBottom: '1rem' }}>Books by Rating</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rating" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="books" fill="#2c3e50" name="Number of Books" />
                    <Bar yAxisId="right" dataKey="avg_price" fill="#e74c3c" name="Avg Price (£)" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default RatingsChart;