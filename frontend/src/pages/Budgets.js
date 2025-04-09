import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getBudgetProgress, addBudget, deleteBudget, getCategories } from '../services/dataService';
import { formatCurrency, formatDate } from '../utils/formatters';

const Budgets = () => {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);

  // New budget form state
  const [newBudget, setNewBudget] = useState({
    category: '',
    amount: '',
    period: 'Monthly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
  });

  useEffect(() => {
    // Fetch budgets from data service
    const fetchData = () => {
      try {
        const budgetsData = getBudgetProgress();
        const categoriesData = getCategories();

        // Assign colors to budgets
        const colors = [
          '#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6',
          '#1abc9c', '#d35400', '#34495e', '#16a085', '#c0392b'
        ];

        const budgetsWithColors = budgetsData.map((budget, index) => ({
          ...budget,
          color: colors[index % colors.length],
          name: budget.category // Use category as name for display
        }));

        setBudgets(budgetsWithColors);
        setCategories(categoriesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching budgets:', error);
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

  // Calculate total budget and spent
  const totalBudget = budgets.reduce((total, budget) => total + budget.amount, 0);
  const totalSpent = budgets.reduce((total, budget) => total + budget.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const overallProgress = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  if (loading) {
    return <div className="loading-spinner">Loading budgets...</div>;
  }

  return (
    <div className="budgets-container">
      <div className="flex justify-between align-center mb-4">
        <h1>Budgets</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <i className="fas fa-plus"></i> Create Budget
        </button>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="flex justify-between align-center">
            <div>
              <h3>Monthly Budget Overview</h3>
              <div className="flex gap-3 mt-2">
                <div>
                  <p>Total Budget</p>
                  <h4>{formatUserCurrency(totalBudget)}</h4>
                </div>
                <div>
                  <p>Total Spent</p>
                  <h4 className="text-danger">{formatUserCurrency(totalSpent)}</h4>
                </div>
                <div>
                  <p>Remaining</p>
                  <h4 className="text-secondary">{formatUserCurrency(totalRemaining)}</h4>
                </div>
              </div>
            </div>
            <div>
              <p>Overall Progress</p>
              <div className="progress-bar-container">
                <div
                  className="progress-bar"
                  style={{
                    width: `${Math.min(overallProgress, 100)}%`,
                    backgroundColor: overallProgress > 100 ? '#e74c3c' : '#3498db'
                  }}
                ></div>
              </div>
              <p className="text-right">{overallProgress.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {budgets.length === 0 ? (
        <div className="card">
          <div className="card-body text-center">
            <p>No budgets found. Create your first budget to get started!</p>
          </div>
        </div>
      ) : (
        <div className="budget-cards">
          {budgets.map(budget => {
            const progress = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
            const remaining = budget.amount - budget.spent;

            return (
              <div key={budget.id} className="card budget-card">
                <div className="card-header">
                  <div className="flex justify-between align-center">
                    <h3>{budget.name}</h3>
                    <span
                      className="budget-category-indicator"
                      style={{ backgroundColor: budget.color }}
                    ></span>
                  </div>
                  <p>{budget.period} • {formatDate(budget.startDate)} to {formatDate(budget.endDate)}</p>
                </div>
                <div className="card-body">
                  <div className="budget-progress">
                    <div className="flex justify-between mb-1">
                      <span>Progress</span>
                      <span>{progress.toFixed(1)}%</span>
                    </div>
                    <div className="progress-bar-container">
                      <div
                        className="progress-bar"
                        style={{
                          width: `${Math.min(progress, 100)}%`,
                          backgroundColor: progress > 100 ? '#e74c3c' : budget.color
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="budget-details mt-3">
                    <div className="flex justify-between">
                      <div>
                        <p>Budget</p>
                        <h4>{formatUserCurrency(budget.amount)}</h4>
                      </div>
                      <div>
                        <p>Spent</p>
                        <h4 className="text-danger">{formatUserCurrency(budget.spent)}</h4>
                      </div>
                      <div>
                        <p>Remaining</p>
                        <h4 className={remaining >= 0 ? 'text-secondary' : 'text-danger'}>
                          {formatUserCurrency(remaining)}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <div className="flex justify-between">
                    <button className="btn btn-sm btn-outline">
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteBudget(budget.id)}
                    >
                      <i className="fas fa-trash"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Budget Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Create New Budget</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddBudget}>
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    className="form-control"
                    value={newBudget.category}
                    onChange={(e) => setNewBudget({...newBudget, category: e.target.value})}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="amount">Budget Amount</label>
                  <input
                    type="number"
                    id="amount"
                    className="form-control"
                    value={newBudget.amount}
                    onChange={(e) => setNewBudget({...newBudget, amount: e.target.value})}
                    step="0.01"
                    min="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="period">Period</label>
                  <select
                    id="period"
                    className="form-control"
                    value={newBudget.period}
                    onChange={(e) => setNewBudget({...newBudget, period: e.target.value})}
                    required
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Yearly">Yearly</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="startDate">Start Date</label>
                  <input
                    type="date"
                    id="startDate"
                    className="form-control"
                    value={newBudget.startDate}
                    onChange={(e) => setNewBudget({...newBudget, startDate: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="endDate">End Date</label>
                  <input
                    type="date"
                    id="endDate"
                    className="form-control"
                    value={newBudget.endDate}
                    onChange={(e) => setNewBudget({...newBudget, endDate: e.target.value})}
                    required
                  />
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Create Budget</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Handle adding a new budget
  function handleAddBudget(e) {
    e.preventDefault();

    // Validate form
    if (!newBudget.category || !newBudget.amount) {
      return;
    }

    // Add budget to storage
    const addedBudget = addBudget({
      ...newBudget,
      amount: parseFloat(newBudget.amount)
    });

    // Assign a color to the new budget
    const colors = [
      '#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6',
      '#1abc9c', '#d35400', '#34495e', '#16a085', '#c0392b'
    ];

    const budgetWithColor = {
      ...addedBudget,
      color: colors[budgets.length % colors.length],
      name: addedBudget.category,
      spent: 0,
      remaining: addedBudget.amount,
      progress: 0
    };

    // Update state
    setBudgets([...budgets, budgetWithColor]);

    // Reset form and close modal
    setNewBudget({
      category: '',
      amount: '',
      period: 'Monthly',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
    });
    setShowModal(false);
  }

  // Handle deleting a budget
  function handleDeleteBudget(id) {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      deleteBudget(id);
      setBudgets(budgets.filter(budget => budget.id !== id));
    }
  }
};

export default Budgets;