import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/login'
import Dashboard from '../pages/dashboard'
import { useAuth } from './hooks/useAuth'


export default function App() {
const { token } = useAuth()


return (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route
      path="/dashboard"
      element={token ? <Dashboard /> : <Navigate to="/login" replace />}
    />
    <Route path="/" element={<Navigate to={token ? '/dashboard' : '/login'} replace />} />
  </Routes>
  )
}