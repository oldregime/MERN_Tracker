import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getExpenses, addExpense, deleteExpense, getCategories } from '../services/dataService';
import { formatCurrency, formatDate } from '../utils/formatters';

const Expenses = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);

  // New expense form state
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Credit Card'
  });

  useEffect(() => {
    // Fetch expenses from data service
    const fetchData = () => {
      try {
        const expensesData = getExpenses();
        const categoriesData = getCategories();

        setExpenses(expensesData);
        setCategories(categoriesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Use the user's currency preference if available
  const userCurrency = user?.currency || 'INR';

  // Format currency with user's preferred currency
  const formatUserCurrency = (amount) => {
    return formatCurrency(amount, userCurrency);
  };

  // Filter expenses by category
  const filteredExpenses = filter === 'all'
    ? expenses
    : expenses.filter(expense => expense.category === filter);

  // Calculate total expenses
  const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);

  // Get unique categories for filter
  const filterCategories = ['all', ...new Set(expenses.map(expense => expense.category))];

  if (loading) {
    return <div className="loading-spinner">Loading expenses...</div>;
  }

  return (
    <div className="expenses-container">
      <div className="flex justify-between align-center mb-4">
        <h1>Expenses</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <i className="fas fa-plus"></i> Add Expense
        </button>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="flex justify-between align-center">
            <div>
              <h3>Total Expenses</h3>
              <h2 className="text-danger">{formatUserCurrency(totalExpenses)}</h2>
            </div>
            <div>
              <label htmlFor="category-filter" className="form-label">Filter by Category:</label>
              <select
                id="category-filter"
                className="form-control"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                {filterCategories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="card">
          <div className="card-body text-center">
            <p>No expenses found. Add your first expense to get started!</p>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Payment Method</th>
                    <th>Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map(expense => (
                    <tr key={expense.id}>
                      <td>{formatDate(expense.date)}</td>
                      <td>{expense.description}</td>
                      <td>
                        <span className="badge bg-primary">{expense.category}</span>
                      </td>
                      <td>{expense.paymentMethod}</td>
                      <td className="text-danger">{formatUserCurrency(expense.amount)}</td>
                      <td>
                        <button className="btn btn-sm btn-outline mr-2">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteExpense(expense.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add New Expense</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddExpense}>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <input
                    type="text"
                    id="description"
                    className="form-control"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="amount">Amount</label>
                  <input
                    type="number"
                    id="amount"
                    className="form-control"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                    step="0.01"
                    min="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    className="form-control"
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="date">Date</label>
                  <input
                    type="date"
                    id="date"
                    className="form-control"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="paymentMethod">Payment Method</label>
                  <select
                    id="paymentMethod"
                    className="form-control"
                    value={newExpense.paymentMethod}
                    onChange={(e) => setNewExpense({...newExpense, paymentMethod: e.target.value})}
                    required
                  >
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="Mobile Payment">Mobile Payment</option>
                  </select>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Add Expense</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Handle adding a new expense
  function handleAddExpense(e) {
    e.preventDefault();

    // Validate form
    if (!newExpense.description || !newExpense.amount || !newExpense.category) {
      return;
    }

    // Add expense to storage
    const addedExpense = addExpense({
      ...newExpense,
      amount: parseFloat(newExpense.amount)
    });

    // Update state
    setExpenses([...expenses, addedExpense]);

    // Reset form and close modal
    setNewExpense({
      description: '',
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Credit Card'
    });
    setShowModal(false);
  }

  // Handle deleting an expense
  function handleDeleteExpense(id) {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(id);
      setExpenses(expenses.filter(expense => expense.id !== id));
    }
  }
};

export default Expenses;