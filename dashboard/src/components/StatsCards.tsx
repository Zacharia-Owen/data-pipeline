interface Stats {
    total_books: number;
    avg_price: number;
    min_price: number;
    max_price: number;
    available_count: number;
    five_star_count: number;
}

const StatCard = ({ label, value }: { label: string, value: number }) => (
    <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
    }}>
        <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{label}</p>
        <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2c3e50' }}>{value}</p>
    </div>
);

function StatsCards({ stats }: { stats: Stats | null }) {
    if (!stats) return null;

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
        }}>
            <StatCard label="Total Books" value={stats.total_books} />
            <StatCard label="Average Price" value={stats.avg_price} />
            <StatCard label="Lowest Price" value={stats.min_price} />
            <StatCard label="Highest Price" value={stats.max_price} />
            <StatCard label="In Stock" value={stats.available_count} />
            <StatCard label="5-Star Reviews" value={stats.five_star_count} />
        </div>
    )
}

export default StatsCards;