import './App.css';
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap/dist/css/bootstrap.min.css";
import ProfilePage from './components/ProfilePage/ProfilePage';
import Navbar from './components/Navbar/Navbar';
import Notification from './components/Notification/Notification';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>      
       <Route path = "/profile" element = {<ProfilePage/>} />
        <Route path="/notifications" element={<Notification currentUserPublicKey={1}/>} />
      </Routes>
    </Router>
  );
}

export default App;
