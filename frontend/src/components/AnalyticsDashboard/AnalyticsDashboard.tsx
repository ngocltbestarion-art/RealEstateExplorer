import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  getAnalyticsOverview,
  getTypeDistribution,
  getPriceTrends,
  getGeographicDistribution,
  AnalyticsOverview,
  PropertyTypeDistribution,
  PriceTrend,
  GeographicDistribution
} from '../../api/analyticsApi';

interface AnalyticsDashboardProps {
  onClose: () => void;
}

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a'];

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ onClose }) => {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [typeDistribution, setTypeDistribution] = useState<PropertyTypeDistribution[]>([]);
  const [priceTrends, setPriceTrends] = useState<PriceTrend[]>([]);
  const [geoDistribution, setGeoDistribution] = useState<GeographicDistribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [overviewData, typeData, trendData, geoData] = await Promise.all([
        getAnalyticsOverview(),
        getTypeDistribution(),
        getPriceTrends(),
        getGeographicDistribution()
      ]);
      setOverview(overviewData);
      setTypeDistribution(typeData);
      setPriceTrends(trendData);
      setGeoDistribution(geoData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '12px',
          fontSize: '18px',
          fontWeight: 600
        }}>
          Loading Analytics...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          maxWidth: '1400px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '24px 32px',
          borderBottom: '2px solid #f3f4f6',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px 16px 0 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: 'white' }}>
            📊 Analytics Dashboard
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '20px',
              color: 'white',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: '32px' }}>
          {/* Overview Stats */}
          {overview && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              marginBottom: '32px'
            }}>
              <StatCard
                icon="🏠"
                label="Total Properties"
                value={overview.totalProperties.toString()}
                color="#667eea"
              />
              <StatCard
                icon="💰"
                label="Average Price"
                value={formatPrice(overview.averagePrice)}
                color="#764ba2"
              />
              <StatCard
                icon="📈"
                label="Highest Price"
                value={formatPrice(overview.maxPrice)}
                color="#f093fb"
              />
              <StatCard
                icon="📉"
                label="Lowest Price"
                value={formatPrice(overview.minPrice)}
                color="#4facfe"
              />
              <StatCard
                icon="✅"
                label="Available"
                value={overview.availableCount.toString()}
                color="#43e97b"
              />
              <StatCard
                icon="🔒"
                label="Sold"
                value={overview.soldCount.toString()}
                color="#fa709a"
              />
            </div>
          )}

          {/* Charts Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
            gap: '24px'
          }}>
            {/* Property Type Distribution */}
            <ChartCard title="Property Type Distribution">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={typeDistribution}
                    dataKey="count"
                    nameKey="typeName"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry: any) => `${entry.typeName}: ${entry.count}`}
                  >
                    {typeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Price Trends */}
            <ChartCard title="Price Trends Over Time">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={priceTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                  <Tooltip formatter={(value: any) => formatPrice(value as number)} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="averagePrice"
                    stroke="#667eea"
                    strokeWidth={3}
                    name="Average Price"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Geographic Distribution */}
            <ChartCard title="Properties by Region">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={geoDistribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="region" type="category" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#667eea" name="Property Count" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Average Price by Region */}
            <ChartCard title="Average Price by Region">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={geoDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                  <Tooltip formatter={(value: any) => formatPrice(value as number)} />
                  <Legend />
                  <Bar dataKey="averagePrice" fill="#764ba2" name="Average Price" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: string; label: string; value: string; color: string }> = ({
  icon,
  label,
  value,
  color
}) => (
  <div style={{
    padding: '20px',
    borderRadius: '12px',
    background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
    border: `2px solid ${color}30`,
    transition: 'all 0.2s'
  }}>
    <div style={{ fontSize: '32px', marginBottom: '8px' }}>{icon}</div>
    <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: 500 }}>
      {label}
    </div>
    <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>
      {value}
    </div>
  </div>
);

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{
    padding: '24px',
    borderRadius: '12px',
    backgroundColor: 'white',
    border: '2px solid #f3f4f6',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
  }}>
    <h3 style={{
      margin: '0 0 20px 0',
      fontSize: '18px',
      fontWeight: 700,
      color: '#111827'
    }}>
      {title}
    </h3>
    {children}
  </div>
);

export default AnalyticsDashboard;
