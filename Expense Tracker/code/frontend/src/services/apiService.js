/**
 * API Service for interacting with the backend
 */

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';

// Helper function to get auth token
const getToken = () => {
  return localStorage.getItem('token');
};

// Helper function for API requests
const apiRequest = async (endpoint, method = 'GET', data = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  // Add auth token if available
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Something went wrong');
    }

    return result;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// Expense API functions
export const fetchExpenses = async (filters = {}) => {
  let queryParams = '';
  if (Object.keys(filters).length > 0) {
    queryParams = '?' + new URLSearchParams(filters).toString();
  }
  const result = await apiRequest(`/expenses${queryParams}`);
  return result.data;
};

export const fetchExpense = async (id) => {
  const result = await apiRequest(`/expenses/${id}`);
  return result.data;
};

export const createExpense = async (expenseData) => {
  const result = await apiRequest('/expenses', 'POST', expenseData);
  return result.data;
};

export const updateExpense = async (id, expenseData) => {
  const result = await apiRequest(`/expenses/${id}`, 'PUT', expenseData);
  return result.data;
};

export const deleteExpense = async (id) => {
  const result = await apiRequest(`/expenses/${id}`, 'DELETE');
  return result.data;
};

export const fetchExpenseStats = async () => {
  const result = await apiRequest('/expenses/stats');
  return result.data;
};

// Income API functions
export const fetchIncomes = async (filters = {}) => {
  let queryParams = '';
  if (Object.keys(filters).length > 0) {
    queryParams = '?' + new URLSearchParams(filters).toString();
  }
  const result = await apiRequest(`/income${queryParams}`);
  return result.data;
};

export const fetchIncome = async (id) => {
  const result = await apiRequest(`/income/${id}`);
  return result.data;
};

export const createIncome = async (incomeData) => {
  const result = await apiRequest('/income', 'POST', incomeData);
  return result.data;
};

export const updateIncome = async (id, incomeData) => {
  const result = await apiRequest(`/income/${id}`, 'PUT', incomeData);
  return result.data;
};

export const deleteIncome = async (id) => {
  const result = await apiRequest(`/income/${id}`, 'DELETE');
  return result.data;
};

export const fetchIncomeStats = async () => {
  const result = await apiRequest('/income/stats');
  return result.data;
};

// Budget API functions
export const fetchBudgets = async (filters = {}) => {
  let queryParams = '';
  if (Object.keys(filters).length > 0) {
    queryParams = '?' + new URLSearchParams(filters).toString();
  }
  const result = await apiRequest(`/budgets${queryParams}`);
  return result.data;
};

export const fetchBudget = async (id) => {
  const result = await apiRequest(`/budgets/${id}`);
  return result.data;
};

export const createBudget = async (budgetData) => {
  const result = await apiRequest('/budgets', 'POST', budgetData);
  return result.data;
};

export const updateBudget = async (id, budgetData) => {
  const result = await apiRequest(`/budgets/${id}`, 'PUT', budgetData);
  return result.data;
};

export const deleteBudget = async (id) => {
  const result = await apiRequest(`/budgets/${id}`, 'DELETE');
  return result.data;
};

export const fetchBudgetProgress = async () => {
  const result = await apiRequest('/budgets/progress');
  return result.data;
};

// Report API functions
export const fetchFinancialSummary = async (period) => {
  let queryParams = '';
  if (period) {
    queryParams = `?period=${period}`;
  }
  const result = await apiRequest(`/reports/summary${queryParams}`);
  return result.data;
};

export const fetchCashFlow = async (period) => {
  let queryParams = '';
  if (period) {
    queryParams = `?period=${period}`;
  }
  const result = await apiRequest(`/reports/cashflow${queryParams}`);
  return result.data;
};

export const fetchExpenseTrends = async (period) => {
  let queryParams = '';
  if (period) {
    queryParams = `?period=${period}`;
  }
  const result = await apiRequest(`/reports/expense-trends${queryParams}`);
  return result.data;
};

// Categories
export const getCategories = () => {
  return [
    'Housing',
    'Food',
    'Transportation',
    'Utilities',
    'Entertainment',
    'Insurance',
    'Healthcare',
    'Education',
    'Shopping',
    'Personal',
    'Debt',
    'Savings',
    'Gifts',
    'Other'
  ];
};

// Income sources
export const getIncomeSources = () => {
  return [
    'Salary',
    'Freelance',
    'Business',
    'Investments',
    'Dividends',
    'Rental',
    'Interest',
    'Gifts',
    'Refunds',
    'Sale',
    'Other'
  ];
};
