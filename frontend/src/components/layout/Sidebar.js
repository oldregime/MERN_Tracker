import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSidebar } from '../../contexts/SidebarContext';

const Sidebar = () => {
  const { sidebarOpen } = useSidebar();

  return (
    <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
      <nav className="sidebar-menu">
        <NavLink to="/" className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"} end>
          <i className="fas fa-home"></i>
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/expenses" className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"}>
          <i className="fas fa-credit-card"></i>
          <span>Expenses</span>
        </NavLink>

        <NavLink to="/income" className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"}>
          <i className="fas fa-money-bill-wave"></i>
          <span>Income</span>
        </NavLink>

        <NavLink to="/budgets" className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"}>
          <i className="fas fa-piggy-bank"></i>
          <span>Budgets</span>
        </NavLink>

        <NavLink to="/reports" className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"}>
          <i className="fas fa-chart-pie"></i>
          <span>Reports</span>
        </NavLink>

        <NavLink to="/profile" className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"}>
          <i className="fas fa-user"></i>
          <span>Profile</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
