import React, { useState } from 'react';
import { createExpense } from '../services/apiService';
import '../styles/QuickAdd.css';

const QuickAddButton = () => {
  const [showModal, setShowModal] = useState(false);
  const [quickExpense, setQuickExpense] = useState({
    amount: '',
    description: '',
    category: 'Food'
  });

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    
    try {
      await createExpense({
        ...quickExpense,
        amount: parseFloat(quickExpense.amount),
        date: new Date().toISOString().split('T')[0]
      });
      
      // Reset and close
      setQuickExpense({ amount: '', description: '', category: 'Food' });
      setShowModal(false);
      
      // Show success notification
      alert('Expense added successfully!');
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Failed to add expense');
    }
  };

  return (
    <>
      <button 
        className="quick-add-fab"
        onClick={() => setShowModal(true)}
        title="Quick Add Expense"
      >
        <i className="fas fa-plus"></i>
      </button>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal quick-add-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Quick Add Expense</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleQuickAdd}>
                <div className="form-group">
                  <label htmlFor="quick-amount">Amount</label>
                  <input
                    type="number"
                    id="quick-amount"
                    className="form-control"
                    value={quickExpense.amount}
                    onChange={(e) => setQuickExpense({...quickExpense, amount: e.target.value})}
                    placeholder="0.00"
                    step="0.01"
                    min="0.01"
                    required
                    autoFocus
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="quick-description">Description</label>
                  <input
                    type="text"
                    id="quick-description"
                    className="form-control"
                    value={quickExpense.description}
                    onChange={(e) => setQuickExpense({...quickExpense, description: e.target.value})}
                    placeholder="What did you buy?"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="quick-category">Category</label>
                  <select
                    id="quick-category"
                    className="form-control"
                    value={quickExpense.category}
                    onChange={(e) => setQuickExpense({...quickExpense, category: e.target.value})}
                  >
                    <option value="Food">🍔 Food</option>
                    <option value="Transportation">🚗 Transportation</option>
                    <option value="Entertainment">🎬 Entertainment</option>
                    <option value="Shopping">🛍️ Shopping</option>
                    <option value="Bills">💡 Bills</option>
                    <option value="Healthcare">🏥 Healthcare</option>
                    <option value="Other">📦 Other</option>
                  </select>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Expense
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuickAddButton;
