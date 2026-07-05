import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastContainer } from 'react-toastify'
import { BrowserRouter } from "react-router-dom"
import GlobalContextProvider from './contexts/GlobalContext'
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <GlobalContextProvider>
      <App />
      <ToastContainer />
    </GlobalContextProvider>
  </BrowserRouter>
)
