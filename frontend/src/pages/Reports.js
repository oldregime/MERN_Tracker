import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { fetchFinancialSummary, fetchExpenseStats, fetchIncomeStats, fetchCashFlow } from '../services/apiService';

const Reports = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('expense-category');
  const [timeRange, setTimeRange] = useState('month');
  const [reportData, setReportData] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    savingsRate: 0
  });

  useEffect(() => {
    // Fetch report data from API
    const fetchReportData = async () => {
      try {
        setLoading(true);
        let data = [];
        const colors = [
          '#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6',
          '#1abc9c', '#d35400', '#34495e', '#16a085', '#c0392b'
        ];

        // Get financial summary
        const summaryData = await fetchFinancialSummary();
        if (summaryData && summaryData.summary) {
          setSummary({
            totalIncome: summaryData.summary.totalIncome || 0,
            totalExpenses: summaryData.summary.totalExpenses || 0,
            balance: summaryData.summary.balance || 0,
            savingsRate: summaryData.summary.savingsRate || 0
          });
        }

        if (reportType === 'expense-category') {
          // Get expense stats
          const expenseStats = await fetchExpenseStats();
          const categories = expenseStats?.categoryStats || [];

          data = categories.map((item, index) => ({
            label: item._id,
            value: item.total,
            color: colors[index % colors.length]
          }));
        } else if (reportType === 'income-source') {
          // Get income stats
          const incomeStats = await fetchIncomeStats();
          const sources = incomeStats?.sourceStats || [];

          data = sources.map((item, index) => ({
            label: item._id,
            value: item.total,
            color: colors[index % colors.length]
          }));
        } else if (reportType === 'monthly-comparison') {
          // Get cash flow data
          const cashFlowData = await fetchCashFlow();
          const months = cashFlowData.labels || [];
          const datasets = Array.isArray(cashFlowData.datasets) ? cashFlowData.datasets : [];

          const incomeDataset = datasets.find(ds => ds.label === 'Income');
          const expenseDataset = datasets.find(ds => ds.label === 'Expenses');

          const incomeData = incomeDataset?.data || [];
          const expenseData = expenseDataset?.data || [];

          data = months.map((month, index) => ({
            month,
            income: incomeData[index] || 0,
            expenses: expenseData[index] || 0
          }));
        }

        setReportData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching report data:', error);
        setLoading(false);
      }
    };

    fetchReportData();
  }, [reportType, timeRange]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: user?.currency || 'INR'
    }).format(amount);
  };

  // Calculate percentage for pie chart segments
  const calculatePercentage = (value) => {
    const total = reportData.reduce((sum, item) => sum + item.value, 0);
    return total > 0 ? ((value / total) * 100).toFixed(1) : 0;
  };

  if (loading) {
    return <div className="loading-spinner">Loading report data...</div>;
  }

  return (
    <div className="reports-container">
      <h1>Financial Reports</h1>

      <div className="card mb-4">
        <div className="card-body">
          <div className="flex justify-between align-center">
            <div>
              <label htmlFor="report-type" className="form-label">Report Type:</label>
              <select
                id="report-type"
                className="form-control"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="expense-category">Expenses by Category</option>
                <option value="income-source">Income by Source</option>
                <option value="monthly-comparison">Monthly Comparison</option>
              </select>
            </div>
            <div>
              <label htmlFor="time-range" className="form-label">Time Range:</label>
              <select
                id="time-range"
                className="form-control"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="card summary-card">
          <div className="card-body">
            <h3>Total Income</h3>
            <h2 className="text-secondary">{formatCurrency(summary.totalIncome)}</h2>
          </div>
        </div>

        <div className="card summary-card">
          <div className="card-body">
            <h3>Total Expenses</h3>
            <h2 className="text-danger">{formatCurrency(summary.totalExpenses)}</h2>
          </div>
        </div>

        <div className="card summary-card">
          <div className="card-body">
            <h3>Balance</h3>
            <h2 className="text-primary">{formatCurrency(summary.balance)}</h2>
          </div>
        </div>

        <div className="card summary-card">
          <div className="card-body">
            <h3>Savings Rate</h3>
            <h2 className="text-success">{summary.savingsRate}%</h2>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>
            {reportType === 'expense-category' && 'Expenses by Category'}
            {reportType === 'income-source' && 'Income by Source'}
            {reportType === 'monthly-comparison' && 'Monthly Income vs Expenses'}
          </h3>
        </div>
        <div className="card-body">
          {(reportType === 'expense-category' || reportType === 'income-source') && (
            <div className="flex">
              <div className="chart-placeholder">
                {/* In a real app, this would be a Chart.js pie chart */}
                <div className="mock-pie-chart">
                  <div className="mock-pie-center">Chart</div>
                </div>
              </div>
              <div className="chart-legend">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Amount</th>
                      <th>%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <div className="flex align-center">
                            <span
                              className="color-indicator"
                              style={{ backgroundColor: item.color }}
                            ></span>
                            {item.label}
                          </div>
                        </td>
                        <td>{formatCurrency(item.value)}</td>
                        <td>{calculatePercentage(item.value)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {reportType === 'monthly-comparison' && (
            <div>
              {/* In a real app, this would be a Chart.js bar chart */}
              <div className="chart-placeholder">
                <div className="mock-bar-chart">
                  {reportData.map((item, index) => (
                    <div key={index} className="mock-bar-group">
                      <div className="mock-bar-label">{item.month}</div>
                      <div className="mock-bars">
                        <div
                          className="mock-bar income-bar"
                          style={{ height: `${(item.income / 6000) * 100}%` }}
                          title={`Income: ${formatCurrency(item.income)}`}
                        ></div>
                        <div
                          className="mock-bar expense-bar"
                          style={{ height: `${(item.expenses / 6000) * 100}%` }}
                          title={`Expenses: ${formatCurrency(item.expenses)}`}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mock-chart-legend">
                  <div className="legend-item">
                    <span className="legend-color income-color"></span> Income
                  </div>
                  <div className="legend-item">
                    <span className="legend-color expense-color"></span> Expenses
                  </div>
                </div>
              </div>

              <table className="table mt-4">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Income</th>
                    <th>Expenses</th>
                    <th>Balance</th>
                    <th>Savings Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((item, index) => {
                    const balance = item.income - item.expenses;
                    const savingsRate = ((balance / item.income) * 100).toFixed(1);

                    return (
                      <tr key={index}>
                        <td>{item.month}</td>
                        <td>{formatCurrency(item.income)}</td>
                        <td>{formatCurrency(item.expenses)}</td>
                        <td className={balance >= 0 ? 'text-secondary' : 'text-danger'}>
                          {formatCurrency(balance)}
                        </td>
                        <td>{savingsRate}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;