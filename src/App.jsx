import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import CoverPage from './pages/CoverPage';
import AddProductPage from './pages/AddProductPage';
import ShoppingPage from './pages/ShoppingPage';
import HistoryPage from './pages/HistoryPage';
import { ListTodo, ListChecks, PlusSquare } from 'lucide-react';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<CoverPage />} />
          <Route path="/add" element={<AddProductPage />} />
          <Route path="/shopping" element={<ShoppingPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
        
        {/* Navigation Bar - only show if not on cover page */}
        <Routes>
          <Route path="/" element={null} />
          <Route path="*" element={<BottomNav />} />
        </Routes>
      </div>
    </Router>
  );
}

function BottomNav() {
  const location = useLocation();
  
  const getStyle = (path) => {
    const isActive = location.pathname === path;
    return {
      color: isActive ? 'var(--primary)' : 'var(--text)',
      fontWeight: isActive ? 'bold' : 'normal'
    };
  };

  return (
    <nav className="bottom-nav neo-box">
      <Link to="/add" className="nav-item" style={getStyle('/add')}>
        <PlusSquare size={24} color={getStyle('/add').color} />
        <span>添加商品</span>
      </Link>
      <Link to="/shopping" className="nav-item" style={getStyle('/shopping')}>
        <ListTodo size={24} color={getStyle('/shopping').color} />
        <span>购物车</span>
      </Link>
      <Link to="/history" className="nav-item" style={getStyle('/history')}>
        <ListChecks size={24} color={getStyle('/history').color} />
        <span>购物记录</span>
      </Link>
      
      <style>{`
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          justify-content: space-around;
          padding: 8px 0;
          background: #fff;
          z-index: 100;
          border-bottom: none;
          border-left: none;
          border-right: none;
          max-width: 600px;
          margin: 0 auto;
        }
        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-decoration: none;
          font-size: 12px;
          gap: 4px;
        }
      `}</style>
    </nav>
  );
}

export default App;
