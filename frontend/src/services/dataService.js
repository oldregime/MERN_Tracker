// Data service for managing expenses, income, and budgets
// Using localStorage for persistence during development

// Helper to generate unique IDs
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

// Initialize storage with default data if empty
const initializeStorage = () => {
  if (!localStorage.getItem('expenses')) {
    localStorage.setItem('expenses', JSON.stringify([]));
  }

  if (!localStorage.getItem('income')) {
    localStorage.setItem('income', JSON.stringify([]));
  }

  if (!localStorage.getItem('budgets')) {
    localStorage.setItem('budgets', JSON.stringify([
      {
        id: generateId(),
        category: 'Groceries',
        amount: 5000, // Updated to more appropriate INR values
        period: 'Monthly',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
      },
      {
        id: generateId(),
        category: 'Transportation',
        amount: 3000, // Updated to more appropriate INR values
        period: 'Monthly',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
      },
      {
        id: generateId(),
        category: 'Entertainment',
        amount: 2000, // Updated to more appropriate INR values
        period: 'Monthly',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
      }
    ]));
  }

  if (!localStorage.getItem('categories')) {
    localStorage.setItem('categories', JSON.stringify([
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
    ]));
  }
};

// Initialize on service import
initializeStorage();

// Expense functions
export const getExpenses = () => {
  return JSON.parse(localStorage.getItem('expenses')) || [];
};

export const addExpense = (expense) => {
  const expenses = getExpenses();
  const newExpense = {
    id: generateId(),
    ...expense,
    date: expense.date || new Date().toISOString().split('T')[0]
  };

  expenses.push(newExpense);
  localStorage.setItem('expenses', JSON.stringify(expenses));
  return newExpense;
};

export const updateExpense = (id, updatedExpense) => {
  const expenses = getExpenses();
  const index = expenses.findIndex(expense => expense.id === id);

  if (index !== -1) {
    expenses[index] = { ...expenses[index], ...updatedExpense };
    localStorage.setItem('expenses', JSON.stringify(expenses));
    return expenses[index];
  }

  return null;
};

export const deleteExpense = (id) => {
  const expenses = getExpenses();
  const filteredExpenses = expenses.filter(expense => expense.id !== id);
  localStorage.setItem('expenses', JSON.stringify(filteredExpenses));
  return id;
};

// Income functions
export const getIncome = () => {
  return JSON.parse(localStorage.getItem('income')) || [];
};

export const addIncome = (income) => {
  const incomeList = getIncome();
  const newIncome = {
    id: generateId(),
    ...income,
    date: income.date || new Date().toISOString().split('T')[0]
  };

  incomeList.push(newIncome);
  localStorage.setItem('income', JSON.stringify(incomeList));
  return newIncome;
};

export const updateIncome = (id, updatedIncome) => {
  const incomeList = getIncome();
  const index = incomeList.findIndex(income => income.id === id);

  if (index !== -1) {
    incomeList[index] = { ...incomeList[index], ...updatedIncome };
    localStorage.setItem('income', JSON.stringify(incomeList));
    return incomeList[index];
  }

  return null;
};

export const deleteIncome = (id) => {
  const incomeList = getIncome();
  const filteredIncome = incomeList.filter(income => income.id !== id);
  localStorage.setItem('income', JSON.stringify(filteredIncome));
  return id;
};

// Budget functions
export const getBudgets = () => {
  return JSON.parse(localStorage.getItem('budgets')) || [];
};

export const addBudget = (budget) => {
  const budgets = getBudgets();
  const newBudget = {
    id: generateId(),
    ...budget
  };

  budgets.push(newBudget);
  localStorage.setItem('budgets', JSON.stringify(budgets));
  return newBudget;
};

export const updateBudget = (id, updatedBudget) => {
  const budgets = getBudgets();
  const index = budgets.findIndex(budget => budget.id === id);

  if (index !== -1) {
    budgets[index] = { ...budgets[index], ...updatedBudget };
    localStorage.setItem('budgets', JSON.stringify(budgets));
    return budgets[index];
  }

  return null;
};

export const deleteBudget = (id) => {
  const budgets = getBudgets();
  const filteredBudgets = budgets.filter(budget => budget.id !== id);
  localStorage.setItem('budgets', JSON.stringify(filteredBudgets));
  return id;
};

// Category functions
export const getCategories = () => {
  return JSON.parse(localStorage.getItem('categories')) || [];
};

export const addCategory = (category) => {
  const categories = getCategories();
  if (!categories.includes(category)) {
    categories.push(category);
    localStorage.setItem('categories', JSON.stringify(categories));
  }
  return categories;
};

// Summary and statistics functions
export const getFinancialSummary = () => {
  const expenses = getExpenses();
  const income = getIncome();

  const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  const totalIncome = income.reduce((sum, income) => sum + parseFloat(income.amount), 0);
  const currentBalance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  return {
    totalExpenses,
    totalIncome,
    currentBalance,
    savingsRate
  };
};

export const getExpensesByCategory = () => {
  const expenses = getExpenses();
  const categories = getCategories();

  const expensesByCategory = categories.map(category => {
    const categoryExpenses = expenses.filter(expense => expense.category === category);
    const total = categoryExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

    return {
      category,
      total
    };
  }).filter(item => item.total > 0);

  return expensesByCategory;
};

export const getMonthlyData = () => {
  const expenses = getExpenses();
  const income = getIncome();

  // Get last 6 months
  const months = [];
  const today = new Date();

  for (let i = 5; i >= 0; i--) {
    const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthStr = month.toLocaleString('default', { month: 'short', year: 'numeric' });
    months.push(monthStr);
  }

  // Calculate monthly expenses and income
  const monthlyExpenses = months.map(month => {
    const [monthName, year] = month.split(' ');
    const monthIndex = new Date(Date.parse(`${monthName} 1, ${year}`)).getMonth();
    const yearNum = parseInt(year);

    const monthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === monthIndex && expenseDate.getFullYear() === yearNum;
    });

    return {
      month,
      total: monthExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0)
    };
  });

  const monthlyIncome = months.map(month => {
    const [monthName, year] = month.split(' ');
    const monthIndex = new Date(Date.parse(`${monthName} 1, ${year}`)).getMonth();
    const yearNum = parseInt(year);

    const monthIncome = income.filter(income => {
      const incomeDate = new Date(income.date);
      return incomeDate.getMonth() === monthIndex && incomeDate.getFullYear() === yearNum;
    });

    return {
      month,
      total: monthIncome.reduce((sum, income) => sum + parseFloat(income.amount), 0)
    };
  });

  return {
    months,
    expenses: monthlyExpenses,
    income: monthlyIncome
  };
};

// Budget progress
export const getBudgetProgress = () => {
  const expenses = getExpenses();
  const budgets = getBudgets();

  return budgets.map(budget => {
    const startDate = new Date(budget.startDate);
    const endDate = new Date(budget.endDate);

    const budgetExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return (
        expense.category === budget.category &&
        expenseDate >= startDate &&
        expenseDate <= endDate
      );
    });

    const spent = budgetExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    const remaining = budget.amount - spent;
    const progress = (spent / budget.amount) * 100;

    return {
      ...budget,
      spent,
      remaining,
      progress
    };
  });
};
