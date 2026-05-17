import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './Routes'

function App() {
  return (
    <div className="app-root">
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </div>
  )
}

export default App
