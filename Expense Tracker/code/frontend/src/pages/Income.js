import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { fetchIncomes, createIncome, deleteIncome, getIncomeSources } from '../services/apiService';
import { formatCurrency, formatDate } from '../utils/formatters';

const Income = () => {
  const { user } = useAuth();
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);

  // New income form state
  const [newIncome, setNewIncome] = useState({
    description: '',
    amount: '',
    source: '',
    date: new Date().toISOString().split('T')[0],
    taxable: true
  });

  useEffect(() => {
    // Fetch income data from API
    const fetchData = async () => {
      try {
        setLoading(true);
        const incomeData = await fetchIncomes();
        setIncomes(incomeData || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching income data:', error);
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

  // Filter incomes by source
  const filteredIncomes = filter === 'all'
    ? incomes
    : incomes.filter(income => income.source === filter);

  // Calculate total income
  const totalIncome = incomes.reduce((total, income) => total + income.amount, 0);

  // Get income sources for filter
  const incomeSources = getIncomeSources();
  const sources = ['all', ...incomeSources];

  if (loading) {
    return <div className="loading-spinner">Loading income data...</div>;
  }

  return (
    <div className="income-container">
      <div className="flex justify-between align-center mb-4">
        <h1>Income</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <i className="fas fa-plus"></i> Add Income
        </button>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="flex justify-between align-center">
            <div>
              <h3>Total Income</h3>
              <h2 className="text-secondary">{formatUserCurrency(totalIncome)}</h2>
            </div>
            <div>
              <label htmlFor="source-filter" className="form-label">Filter by Source:</label>
              <select
                id="source-filter"
                className="form-control"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                {sources.map(source => (
                  <option key={source} value={source}>
                    {source === 'all' ? 'All Sources' : source}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {filteredIncomes.length === 0 ? (
        <div className="card">
          <div className="card-body text-center">
            <p>No income records found. Add your first income to get started!</p>
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
                    <th>Source</th>
                    <th>Taxable</th>
                    <th>Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIncomes.map(income => (
                    <tr key={income.id}>
                      <td>{formatDate(income.date)}</td>
                      <td>{income.description}</td>
                      <td>
                        <span className="badge bg-secondary">{income.source}</span>
                      </td>
                      <td>
                        {income.taxable ?
                          <span className="badge bg-warning">Yes</span> :
                          <span className="badge bg-info">No</span>}
                      </td>
                      <td className="text-secondary">{formatUserCurrency(income.amount)}</td>
                      <td>
                        <button className="btn btn-sm btn-outline mr-2">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteIncome(income.id)}
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

      {/* Add Income Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add New Income</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddIncome}>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <input
                    type="text"
                    id="description"
                    className="form-control"
                    value={newIncome.description}
                    onChange={(e) => setNewIncome({...newIncome, description: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="amount">Amount</label>
                  <input
                    type="number"
                    id="amount"
                    className="form-control"
                    value={newIncome.amount}
                    onChange={(e) => setNewIncome({...newIncome, amount: e.target.value})}
                    step="0.01"
                    min="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="source">Source</label>
                  <select
                    id="source"
                    className="form-control"
                    value={newIncome.source}
                    onChange={(e) => setNewIncome({...newIncome, source: e.target.value})}
                    required
                  >
                    <option value="">Select a source</option>
                    <option value="Salary">Salary</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Investments">Investments</option>
                    <option value="Interest">Interest</option>
                    <option value="Gifts">Gifts</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="date">Date</label>
                  <input
                    type="date"
                    id="date"
                    className="form-control"
                    value={newIncome.date}
                    onChange={(e) => setNewIncome({...newIncome, date: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <div className="checkbox">
                    <label>
                      <input
                        type="checkbox"
                        checked={newIncome.taxable}
                        onChange={(e) => setNewIncome({...newIncome, taxable: e.target.checked})}
                      />
                      Taxable Income
                    </label>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Add Income</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Handle adding a new income
  async function handleAddIncome(e) {
    e.preventDefault();

    // Validate form
    if (!newIncome.description || !newIncome.amount || !newIncome.source) {
      return;
    }

    try {
      // Add income via API
      const addedIncome = await createIncome({
        ...newIncome,
        amount: parseFloat(newIncome.amount)
      });

      // Update state
      setIncomes([...incomes, addedIncome]);

      // Reset form and close modal
      setNewIncome({
        description: '',
        amount: '',
        source: '',
        date: new Date().toISOString().split('T')[0],
        taxable: true
      });
      setShowModal(false);
    } catch (error) {
      console.error('Error adding income:', error);
    }
  }

  // Handle deleting an income
  async function handleDeleteIncome(id) {
    if (window.confirm('Are you sure you want to delete this income record?')) {
      try {
        await deleteIncome(id);
        setIncomes(incomes.filter(income => income._id !== id));
      } catch (error) {
        console.error('Error deleting income:', error);
      }
    }
  }
};

export default Income;