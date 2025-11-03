import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import '../styles/Goals.css';

const Goals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    currentAmount: 0,
    deadline: '',
    category: 'Savings'
  });

  useEffect(() => {
    // Load goals from localStorage for demo
    const savedGoals = localStorage.getItem('financialGoals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  const saveGoals = (updatedGoals) => {
    localStorage.setItem('financialGoals', JSON.stringify(updatedGoals));
    setGoals(updatedGoals);
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    
    const goal = {
      id: Date.now(),
      ...newGoal,
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: 0,
      createdAt: new Date().toISOString()
    };

    saveGoals([...goals, goal]);
    setNewGoal({ name: '', targetAmount: '', currentAmount: 0, deadline: '', category: 'Savings' });
    setShowModal(false);
  };

  const handleAddMoney = (goalId, amount) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        return { ...goal, currentAmount: goal.currentAmount + parseFloat(amount) };
      }
      return goal;
    });
    saveGoals(updatedGoals);
  };

  const handleDeleteGoal = (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      saveGoals(goals.filter(goal => goal.id !== goalId));
    }
  };

  const getProgress = (goal) => {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  };

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Savings': '💰',
      'Vacation': '✈️',
      'Emergency Fund': '🏥',
      'Car': '🚗',
      'House': '🏠',
      'Education': '🎓',
      'Retirement': '🌴',
      'Other': '🎯'
    };
    return icons[category] || '🎯';
  };

  return (
    <div className="goals-container">
      <div className="flex justify-between align-center mb-4">
        <h1>Financial Goals</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <i className="fas fa-plus"></i> Add Goal
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="card">
          <div className="card-body text-center">
            <div className="empty-state">
              <i className="fas fa-bullseye fa-3x mb-3" style={{color: 'var(--primary-color)'}}></i>
              <h3>No Goals Yet</h3>
              <p>Set your first financial goal and start saving!</p>
              <button className="btn btn-primary mt-3" onClick={() => setShowModal(true)}>
                Create Your First Goal
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="goals-grid">
          {goals.map(goal => {
            const progress = getProgress(goal);
            const daysRemaining = getDaysRemaining(goal.deadline);
            const isCompleted = progress >= 100;
            
            return (
              <div key={goal.id} className={`goal-card ${isCompleted ? 'completed' : ''}`}>
                <div className="goal-header">
                  <div className="goal-icon">{getCategoryIcon(goal.category)}</div>
                  <div className="goal-info">
                    <h3>{goal.name}</h3>
                    <span className="goal-category">{goal.category}</span>
                  </div>
                  <button 
                    className="btn-icon btn-danger-icon"
                    onClick={() => handleDeleteGoal(goal.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>

                <div className="goal-progress">
                  <div className="progress-info">
                    <span className="current-amount">${goal.currentAmount.toFixed(2)}</span>
                    <span className="target-amount">of ${goal.targetAmount.toFixed(2)}</span>
                  </div>
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar-fill" 
                      style={{width: `${progress}%`}}
                    ></div>
                  </div>
                  <div className="progress-percentage">{progress.toFixed(0)}%</div>
                </div>

                {!isCompleted && (
                  <div className="goal-deadline">
                    <i className="fas fa-calendar"></i>
                    {daysRemaining > 0 ? (
                      <span>{daysRemaining} days remaining</span>
                    ) : daysRemaining === 0 ? (
                      <span className="text-warning">Due today!</span>
                    ) : (
                      <span className="text-danger">{Math.abs(daysRemaining)} days overdue</span>
                    )}
                  </div>
                )}

                {isCompleted && (
                  <div className="goal-completed">
                    <i className="fas fa-check-circle"></i>
                    <span>Goal Achieved! 🎉</span>
                  </div>
                )}

                {!isCompleted && (
                  <div className="goal-actions">
                    <button 
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        const amount = prompt('How much would you like to add?');
                        if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
                          handleAddMoney(goal.id, amount);
                        }
                      }}
                    >
                      <i className="fas fa-plus"></i> Add Money
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Goal Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Goal</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddGoal}>
                <div className="form-group">
                  <label htmlFor="goal-name">Goal Name</label>
                  <input
                    type="text"
                    id="goal-name"
                    className="form-control"
                    value={newGoal.name}
                    onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                    placeholder="e.g., Vacation to Hawaii"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="goal-category">Category</label>
                  <select
                    id="goal-category"
                    className="form-control"
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                  >
                    <option value="Savings">💰 Savings</option>
                    <option value="Vacation">✈️ Vacation</option>
                    <option value="Emergency Fund">🏥 Emergency Fund</option>
                    <option value="Car">🚗 Car</option>
                    <option value="House">🏠 House</option>
                    <option value="Education">🎓 Education</option>
                    <option value="Retirement">🌴 Retirement</option>
                    <option value="Other">🎯 Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="goal-target">Target Amount</label>
                  <input
                    type="number"
                    id="goal-target"
                    className="form-control"
                    value={newGoal.targetAmount}
                    onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
                    placeholder="0.00"
                    step="0.01"
                    min="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="goal-deadline">Target Date</label>
                  <input
                    type="date"
                    id="goal-deadline"
                    className="form-control"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Goal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;
