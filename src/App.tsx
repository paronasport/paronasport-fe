import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/general/ProtectedRoute'
import { Login } from './pages/Login'
import { SendData } from './pages/SendData'

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
              <>ggg</>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
