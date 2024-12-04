import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TaskList from './components/TaskList';
import Dashboard from './pages/DashBoard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="p-4 bg-blue-500 text-white">
          <div className="container mx-auto flex justify-between">
            <Link to="/" className="font-bold">Task Management</Link>
            <div className="space-x-4">
              <Link to="/" className="hover:underline">Tasks</Link>
              <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<TaskList />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
