import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const IssueList = lazy(() => import('./pages/IssueList'));
const IssueDetail = lazy(() => import('./pages/IssueDetail'));
const Reports = lazy(() => import('./pages/Reports'));
const ImportCSV = lazy(() => import('./pages/ImportCSV'));
const Labels = lazy(() => import('./pages/Labels'));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center h-full min-h-[50vh]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
  </div>
);

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} basename={import.meta.env.BASE_URL}>
      <Suspense fallback={<PageLoader />}>
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
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
