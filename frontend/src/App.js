import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Pages & Components
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyOTP from './pages/VerifyOTP';
import { AuthContextProvider } from './context/AuthContext';

function App() {
  return (
    <div className="App">
      <AuthContextProvider>
        <BrowserRouter>
          <Navbar/>
          <div className="pages">
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/login" element={<Login/>}/>
              <Route path="/signup" element={<Signup/>}/>
              <Route path="/verify-otp" element={<VerifyOTP/>}/>
            </Routes>
          </div>
          <ToastContainer position="top-right" autoClose={3000} />
        </BrowserRouter>
      </AuthContextProvider>
    </div>
  );
}

export default App;
