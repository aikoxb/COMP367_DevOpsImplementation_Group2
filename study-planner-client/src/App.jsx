// study-planner-client/src/App.jsx
// Handles routing & navigation  
// & decides which pages to show based on user login state (via useAuth + ProtectedRoute).

import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom'; // react-router-dom for client-side routing
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap base styles
import './App.css' // App-specific styles
import api from "./api/client"; // API client to make requests to the server

// react-bootstrap components for styling
import {Navbar, Nav, Container, Button} from 'react-bootstrap';

// authentication hooks and components
import useAuth from "./auth/useAuth";
import ProtectedRoute from "./auth/ProtectedRoute";

//Page components used in the routing
import Login from './pages/Login';
import Register from "./pages/Register";
import Home from "./pages/Home";
import Courses from "./pages/Courses";

function App() {
  // Get authentication state from useAuth hook (provides user information & loading state)
  const { user, setUser, loading } = useAuth();

  // logout user by sending POST request to backend and clear user state on frontend
  function handleLogout() {
    api.post("/auth/signout")
    .then(() => {
      setUser(null);
    })
    .catch((err) => {
      console.error("Logout failed:", err);
      setUser(null); 
    });
  }

  // Set up the Router, Navigation bar, and Routes
  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className="navbar">
        <Container fluid className="px-0">

          {/* Title of the app which links to the home page */}
          <Navbar.Brand as={Link} to="/">
            <span className="navbar-brand-container">Study Planner</span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="me-auto">

              {/* Home page link */}
              <Nav.Link className="nav-link-container" as={Link} to="/">Home</Nav.Link> 

              {/* Only show Login & Register when user is not logged in */}
              {!user && <Nav.Link className="nav-link-container" as={Link} to="/login">Login</Nav.Link> } 
              {!user && <Nav.Link className="nav-link-container" as={Link} to="/register">Register</Nav.Link>}

              {/* Only show Courses link when user is logged in */}
              {user && <Nav.Link className="nav-link-container" as={Link} to="/courses">Courses</Nav.Link>}

            </Nav>

            {/* Only show Logout when user is logged in */}
            {user && (<Button className="logout-btn" onClick={handleLogout}>Logout</Button>)}
          </Navbar.Collapse>          
        </Container>
      </Navbar>

      <Routes>
        {/* Login page */}
        <Route path="/login" element={<Login setUser={setUser}/>} /> 

        {/* Register page */}
        <Route path="/register" element={<Register />} />
        
        {/* Protected Route - Home page */}
        <Route
          path="/"
          element={
            <ProtectedRoute user={user} loading={loading}>
              <Home user={user}/>
            </ProtectedRoute>
          }
        />

        {/* Protected Route - Courses page */}
        <Route
          path="/courses"
          element={
            <ProtectedRoute user={user} loading={loading}>
              <Courses />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
