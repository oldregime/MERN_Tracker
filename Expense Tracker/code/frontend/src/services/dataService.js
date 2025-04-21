// Data service for managing expenses, income, and budgets
// This file now re-exports functions from apiService.js
// to maintain backward compatibility with existing code

import * as apiService from './apiService';

// Re-export all functions from apiService
export const {
  fetchExpenses,
  fetchExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  fetchExpenseStats,
  fetchIncomes,
  fetchIncome,
  createIncome,
  updateIncome,
  deleteIncome,
  fetchIncomeStats,
  fetchBudgets,
  fetchBudget,
  createBudget,
  updateBudget,
  deleteBudget,
  fetchBudgetProgress,
  fetchFinancialSummary,
  fetchCashFlow,
  fetchExpenseTrends,
  getCategories,
  getIncomeSources
} = apiService;

// Aliases for backward compatibility
export const getExpenses = apiService.fetchExpenses;
export const getExpense = apiService.fetchExpense;
export const addExpense = apiService.createExpense;
export const getIncome = apiService.fetchIncomes;
export const addIncome = apiService.createIncome;
export const getBudgets = apiService.fetchBudgets;
export const getBudget = apiService.fetchBudget;
export const addBudget = apiService.createBudget;
export const getBudgetProgress = apiService.fetchBudgetProgress;

// Additional compatibility functions
export const getExpensesByCategory = async () => {
  try {
    const stats = await apiService.fetchExpenseStats();
    return stats.categoryStats.map(item => ({
      category: item._id,
      total: item.total
    }));
  } catch (error) {
    console.error('Error fetching expense categories:', error);
    return [];
  }
};

export const getFinancialSummary = async () => {
  try {
    const result = await apiService.fetchFinancialSummary();
    const summary = result.summary || {};
    return {
      totalExpenses: summary.totalExpenses || 0,
      totalIncome: summary.totalIncome || 0,
      currentBalance: summary.balance || 0,
      savingsRate: summary.savingsRate || 0
    };
  } catch (error) {
    console.error('Error fetching financial summary:', error);
    return {
      totalExpenses: 0,
      totalIncome: 0,
      currentBalance: 0,
      savingsRate: 0
    };
  }
};

export const getMonthlyData = async () => {
  try {
    const cashFlowData = await apiService.fetchCashFlow();

    // Extract months from labels
    const months = cashFlowData.labels || [];

    // Extract income and expense data
    const datasets = cashFlowData.datasets || [];
    // Ensure datasets is an array
    const datasetsArray = Array.isArray(datasets) ? datasets : [];

    const incomeDataset = datasetsArray.find(ds => ds.label === 'Income');
    const expenseDataset = datasetsArray.find(ds => ds.label === 'Expenses');

    const incomeData = incomeDataset?.data || [];
    const expenseData = expenseDataset?.data || [];

    // Format data to match the expected structure
    const monthlyExpenses = months.map((month, index) => ({
      month,
      total: expenseData[index] || 0
    }));

    const monthlyIncome = months.map((month, index) => ({
      month,
      total: incomeData[index] || 0
    }));

    return {
      months,
      expenses: monthlyExpenses,
      income: monthlyIncome
    };
  } catch (error) {
    console.error('Error fetching monthly data:', error);
    return {
      months: [],
      expenses: [],
      income: []
    };
  }
};
