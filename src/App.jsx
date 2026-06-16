import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { QueryProvider } from './context/QueryContext.jsx'
import Home from './pages/Home'

const App = () => {
  return (
    <BrowserRouter>
      <QueryProvider>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </QueryProvider>
    </BrowserRouter>
  )
}

export default App
