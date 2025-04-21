import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { fetchFinancialSummary, fetchExpenses, fetchIncomes, fetchExpenseStats, fetchCashFlow } from '../services/apiService';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { formatCurrency, formatDate } from '../utils/formatters';

// Register ChartJS components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    savingsRate: 0
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [chartData, setChartData] = useState({
    expensesByCategory: { labels: [], datasets: [] },
    monthlyComparison: { labels: [], datasets: [] }
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Get financial summary from API
        const summary = await fetchFinancialSummary();
        if (summary && summary.summary) {
          setStats({
            totalIncome: summary.summary.totalIncome || 0,
            totalExpenses: summary.summary.totalExpenses || 0,
            balance: summary.summary.balance || 0,
            savingsRate: summary.summary.savingsRate || 0
          });
        } else {
          setStats({
            totalIncome: 0,
            totalExpenses: 0,
            balance: 0,
            savingsRate: 0
          });
        }

        // Get expenses by category for pie chart
        const expenseStats = await fetchExpenseStats();
        const expenseCategories = expenseStats?.categoryStats || [];

        const pieChartData = {
          labels: expenseCategories.map(item => item._id),
          datasets: [
            {
              data: expenseCategories.map(item => item.total),
              backgroundColor: [
                '#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6',
                '#1abc9c', '#d35400', '#34495e', '#16a085', '#c0392b',
                '#8e44ad', '#27ae60', '#e67e22', '#2980b9'
              ],
              borderWidth: 1
            }
          ]
        };

        // Get monthly data for bar chart
        const cashFlowData = await fetchCashFlow();
        // Ensure datasets is an array
        const barChartData = {
          labels: cashFlowData.labels || [],
          datasets: Array.isArray(cashFlowData.datasets) ? cashFlowData.datasets : []
        };

        setChartData({
          expensesByCategory: pieChartData,
          monthlyComparison: barChartData
        });

        // Get recent transactions (combine expenses and income)
        const [expenses, incomes] = await Promise.all([
          fetchExpenses({ limit: 10 }),
          fetchIncomes({ limit: 10 })
        ]);

        const expenseItems = (expenses || []).map(expense => ({
          id: expense._id,
          type: 'expense',
          category: expense.category,
          description: expense.description,
          amount: expense.amount,
          date: expense.date
        }));

        const incomeItems = (incomes || []).map(income => ({
          id: income._id,
          type: 'income',
          source: income.source,
          description: income.description,
          amount: income.amount,
          date: income.date
        }));

        // Combine and sort by date (most recent first)
        const allTransactions = [...expenseItems, ...incomeItems].sort((a, b) =>
          new Date(b.date) - new Date(a.date)
        );

        // Take only the 5 most recent transactions
        setRecentTransactions(allTransactions.slice(0, 5));

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Use the user's currency preference if available
  const userCurrency = user?.currency || 'INR';

  // Format currency with user's preferred currency
  const formatUserCurrency = (amount) => {
    return formatCurrency(amount, userCurrency);
  };

  if (loading) {
    return <div className="loading-spinner">Loading dashboard data...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>Welcome back, {user?.name}! Here's your financial summary.</p>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon bg-primary">
            <i className="fas fa-money-bill-wave"></i>
          </div>
          <div className="stat-info">
            <h3>{formatUserCurrency(stats.totalIncome)}</h3>
            <p>Total Income</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-danger">
            <i className="fas fa-credit-card"></i>
          </div>
          <div className="stat-info">
            <h3>{formatUserCurrency(stats.totalExpenses)}</h3>
            <p>Total Expenses</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-secondary">
            <i className="fas fa-wallet"></i>
          </div>
          <div className="stat-info">
            <h3>{formatUserCurrency(stats.balance)}</h3>
            <p>Current Balance</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-warning">
            <i className="fas fa-piggy-bank"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.savingsRate.toFixed(1)}%</h3>
            <p>Savings Rate</p>
          </div>
        </div>
      </div>

      <div className="dashboard-charts">
        <div className="card">
          <div className="card-header">
            <h3>Expenses by Category</h3>
          </div>
          <div className="card-body">
            {chartData.expensesByCategory.labels.length > 0 ? (
              <div style={{ height: '300px', position: 'relative' }}>
                <Pie
                  data={chartData.expensesByCategory}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${formatUserCurrency(value)} (${percentage}%)`;
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            ) : (
              <p className="text-center">No expense data available</p>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Income vs Expenses</h3>
          </div>
          <div className="card-body">
            {chartData.monthlyComparison.labels.length > 0 ? (
              <div style={{ height: '300px', position: 'relative' }}>
                <Bar
                  data={chartData.monthlyComparison}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            const label = context.dataset.label || '';
                            const value = context.raw || 0;
                            return `${label}: ${formatUserCurrency(value)}`;
                          }
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: function(value) {
                            return formatUserCurrency(value);
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            ) : (
              <p className="text-center">No data available</p>
            )}
          </div>
        </div>
      </div>

      <div className="recent-transactions">
        <div className="card-header">
          <div className="flex justify-between align-center">
            <h3>Recent Transactions</h3>
            <div className="flex gap-2">
              <Link to="/expenses" className="btn btn-sm btn-outline">View Expenses</Link>
              <Link to="/income" className="btn btn-sm btn-outline">View Income</Link>
            </div>
          </div>
        </div>

        <div className="transaction-list">
          {recentTransactions.length === 0 ? (
            <p>No recent transactions found.</p>
          ) : (
            recentTransactions.map(transaction => (
              <div key={transaction.id} className="transaction-item">
                <div className="transaction-info">
                  <div className={`transaction-icon ${transaction.type === 'expense' ? 'bg-danger' : 'bg-secondary'}`}>
                    <i className={transaction.type === 'expense' ? 'fas fa-arrow-down' : 'fas fa-arrow-up'}></i>
                  </div>
                  <div className="transaction-details">
                    <h4>{transaction.description}</h4>
                    <p>{transaction.type === 'expense' ? transaction.category : transaction.source} • {formatDate(transaction.date)}</p>
                  </div>
                </div>
                <div className={`transaction-amount ${transaction.type}`}>
                  {transaction.type === 'expense' ? '-' : '+'}{formatUserCurrency(transaction.amount)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
