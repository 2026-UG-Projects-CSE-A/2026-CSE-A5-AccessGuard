import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { ToastProvider } from './context/ToastContext'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}
