import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import IssueList from './pages/IssueList';
import IssueDetail from './pages/IssueDetail';
import Reports from './pages/Reports';

import ImportCSV from './pages/ImportCSV';
import Labels from './pages/Labels';

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="issues" element={<IssueList />} />
          <Route path="issues/:id" element={<IssueDetail />} />
          <Route path="import" element={<ImportCSV />} />
          <Route path="reports" element={<Reports />} />
          <Route path="labels" element={<Labels />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
