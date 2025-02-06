import { useState } from 'react'
import './App.css'
import FaceRecognition from './components/FaceRecognition'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from './Pages/Dashboard';
import FaceExpressionCanvas from './components/FaceExpressionCanvas';
import RegisterFace from './Pages/RegisterFace';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Dashboard/>} />
          <Route path='/register' element={<RegisterFace/>} />
          <Route path='/register' element={<FaceExpressionCanvas/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
