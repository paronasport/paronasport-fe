import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/general/ProtectedRoute'
import { TournamentAdminLogin } from './pages/TournamentAdminLogin'
import { TournamentHome } from './pages/TournamentHome'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TournamentHome />} />
        <Route path="/login" element={<TournamentAdminLogin />} />
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
