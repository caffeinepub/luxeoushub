import { useState } from 'react';
import HomePage from './pages/HomePage';
import SellerDashboardPage from './pages/SellerDashboardPage';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'dashboard'>('home');

  return (
    <>
      {currentPage === 'home' && <HomePage onNavigateToDashboard={() => setCurrentPage('dashboard')} />}
      {currentPage === 'dashboard' && <SellerDashboardPage onNavigateToHome={() => setCurrentPage('home')} />}
    </>
  );
}

export default App;
