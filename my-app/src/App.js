import './App.css';
import Sidebar from './components/Sidebar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import Insights from './pages/Insights';
import ManageTasks from './pages/ManageTasks';
import Profile from './pages/Profile.jsx';


function App() {
  return (
    <Router>
      <div className="flex h-screen"> 
        <Sidebar /> 
        <main className="w-full p-4">
            <Routes>
              <Route path="/dashboard" element={<Dashboard/>} />
                <Route path="/insights" element={<Insights/>} />
                <Route path="/manage-tasks" element={<ManageTasks/>} />
                <Route path="/profile" element={<Profile/>} />
                <Route path="/" element={<Dashboard/>} />
            </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
