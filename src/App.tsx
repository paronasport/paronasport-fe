import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/general/ProtectedRoute'
import { Login } from './pages/Login'
import { SendData } from './pages/SendData'
import { AdminDashboard } from './pages/AdminDashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SendData />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/login/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
