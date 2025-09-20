import React, { useState, useEffect } from 'react';
import './App.css';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CSVLink } from 'react-csv';

// Sample data (replace with fetch from CSV/JSON/API as needed)
const sampleData = [
  {
    month: "2025-03",
    platform: "Facebook",
    campaign_name: "Traffic",
    spend: 165000,
    impressions: 4780000,
    reach: 2800000,
    clicks: 96540,
    link_clicks: 9310,
    video_views: 34950,
    leads: 11400,
    profile_visits: 828,
    followers_gained: 19994,
    heat_zone_focus: "246 Pan-India"
  },
  // ...add more rows as needed...
];

function App() {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    month: '',
    platform: '',
    campaign: ''
  });

  useEffect(() => {
    // Simulate data load
    setData(sampleData);
  }, []);

  // Unique values for filters
  const months = [...new Set(sampleData.map(d => d.month))];
  const platforms = [...new Set(sampleData.map(d => d.platform))];
  const campaigns = [...new Set(sampleData.map(d => d.campaign_name))];

  // Filtered data logic
  const filteredData = data.filter(row => {
    if (filters.month && row.month !== filters.month) return false;
    if (filters.platform && row.platform !== filters.platform) return false;
    if (filters.campaign && row.campaign_name !== filters.campaign) return false;
    return true;
  });

  // KPI calculations (example: CTR, CPC, CPM, CVR, MoM%)
  const calculateKPIs = (row) => {
    const ctr = row.impressions ? row.clicks / row.impressions : 0;
    const cpc = row.clicks ? row.spend / row.clicks : 0;
    const cpm = row.impressions ? (row.spend / row.impressions) * 1000 : 0;
    const cvr = row.clicks ? row.leads / row.clicks : 0;
    return { ctr, cpc, cpm, cvr };
  };

  // Aggregate KPIs for summary cards
  const aggregateKPIs = (rows) => {
    const totalSpend = rows.reduce((sum, r) => sum + r.spend, 0);
    const totalImpressions = rows.reduce((sum, r) => sum + r.impressions, 0);
    const totalClicks = rows.reduce((sum, r) => sum + r.clicks, 0);
    const totalLeads = rows.reduce((sum, r) => sum + r.leads, 0);
    const ctr = totalImpressions ? totalClicks / totalImpressions : 0;
    const cpc = totalClicks ? totalSpend / totalClicks : 0;
    const cpm = totalImpressions ? (totalSpend / totalImpressions) * 1000 : 0;
    const cvr = totalClicks ? totalLeads / totalClicks : 0;
    return { totalSpend, totalImpressions, totalClicks, totalLeads, ctr, cpc, cpm, cvr };
  };

  const kpiSummary = aggregateKPIs(filteredData);

  // Chart data
  const chartData = filteredData.map(row => ({
    month: row.month,
    spend: row.spend,
    impressions: row.impressions,
    clicks: row.clicks,
    leads: row.leads,
    ctr: calculateKPIs(row).ctr,
    cpc: calculateKPIs(row).cpc,
    cpm: calculateKPIs(row).cpm,
    cvr: calculateKPIs(row).cvr,
  }));

  // CSV headers
  const csvHeaders = [
    { label: "Month", key: "month" },
    { label: "Platform", key: "platform" },
    { label: "Campaign", key: "campaign_name" },
    { label: "Spend", key: "spend" },
    { label: "Impressions", key: "impressions" },
    { label: "Clicks", key: "clicks" },
    { label: "CTR", key: "ctr" },
    { label: "CPC", key: "cpc" },
    { label: "CPM", key: "cpm" },
    { label: "CVR", key: "cvr" },
    // ...other columns...
  ];
  const csvData = filteredData.map(row => {
    const kpis = calculateKPIs(row);
    return {
      ...row,
      ctr: kpis.ctr,
      cpc: kpis.cpc,
      cpm: kpis.cpm,
      cvr: kpis.cvr
    };
  });

  return (
    <div className="dashboard">
      <h1>Meta MoM Performance Dashboard</h1>
      {/* Filters */}
      <div className="filters">
        <label>
          Month:
          <select value={filters.month} onChange={e => setFilters(f => ({ ...f, month: e.target.value }))}>
            <option value="">All</option>
            {months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </label>
        <label>
          Platform:
          <select value={filters.platform} onChange={e => setFilters(f => ({ ...f, platform: e.target.value }))}>
            <option value="">All</option>
            {platforms.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </label>
        <label>
          Campaign:
          <select value={filters.campaign} onChange={e => setFilters(f => ({ ...f, campaign: e.target.value }))}>
            <option value="">All</option>
            {campaigns.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
      </div>
      {/* KPI Summary Cards */}
      <div className="kpi-cards" style={{ display: 'flex', gap: '1rem', margin: '1rem 0' }}>
        <div className="kpi-card">Spend: ₹{kpiSummary.totalSpend}</div>
        <div className="kpi-card">Impressions: {kpiSummary.totalImpressions}</div>
        <div className="kpi-card">Clicks: {kpiSummary.totalClicks}</div>
        <div className="kpi-card">Leads: {kpiSummary.totalLeads}</div>
        <div className="kpi-card">CTR: {(kpiSummary.ctr * 100).toFixed(2)}%</div>
        <div className="kpi-card">CPC: ₹{kpiSummary.cpc.toFixed(2)}</div>
        <div className="kpi-card">CPM: ₹{kpiSummary.cpm.toFixed(2)}</div>
        <div className="kpi-card">CVR: {(kpiSummary.cvr * 100).toFixed(2)}%</div>
      </div>
      {/* Charts */}
      <div className="charts" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ width: '400px', height: '300px' }}>
          <h3>Spend by Month</h3>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={chartData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="spend" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ width: '400px', height: '300px' }}>
          <h3>Clicks by Month</h3>
          <ResponsiveContainer width="100%" height="80%">
            <LineChart data={chartData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="clicks" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ width: '400px', height: '300px' }}>
          <h3>CTR by Month</h3>
          <ResponsiveContainer width="100%" height="80%">
            <LineChart data={chartData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="ctr" stroke="#ff7300" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Add more charts as needed */}
      </div>
      {/* Detailed Table */}
      <div className="table" style={{ marginTop: '2rem' }}>
        <CSVLink data={csvData} headers={csvHeaders} filename="dashboard_export.csv">
          <button>Export CSV</button>
        </CSVLink>
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Platform</th>
              <th>Campaign</th>
              <th>Spend</th>
              <th>Impressions</th>
              <th>Clicks</th>
              <th>CTR</th>
              <th>CPC</th>
              <th>CPM</th>
              <th>CVR</th>
              {/* ...other columns... */}
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr><td colSpan={10}>No data available</td></tr>
            ) : (
              filteredData.map((row, idx) => {
                const kpis = calculateKPIs(row);
                return (
                  <tr key={idx}>
                    <td>{row.month}</td>
                    <td>{row.platform}</td>
                    <td>{row.campaign_name}</td>
                    <td>{row.spend}</td>
                    <td>{row.impressions}</td>
                    <td>{row.clicks}</td>
                    <td>{(kpis.ctr * 100).toFixed(2)}%</td>
                    <td>₹{kpis.cpc.toFixed(2)}</td>
                    <td>₹{kpis.cpm.toFixed(2)}</td>
                    <td>{(kpis.cvr * 100).toFixed(2)}%</td>
                    {/* ...other columns... */}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
