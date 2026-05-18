import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './Routes'
import ScrollToTop from '../shared/components/scrollToTop/ScrollToTop'

function App() {
  return (
    <div className="app-root">
      <BrowserRouter>
        <ScrollToTop />
        <AppRoutes />
      </BrowserRouter>
    </div>
  )
}

export default App
