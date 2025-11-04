import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Households from './pages/Households'
import Expenses from './pages/Expenses'
import Chores from './pages/Chores'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/households" element={<Households />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/chores" element={<Chores />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App

