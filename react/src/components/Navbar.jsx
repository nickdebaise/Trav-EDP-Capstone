import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useAuth } from '../useAuth.jsx';
import { Link } from 'react-router-dom';

export default function TravNavbar() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>

        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px', maxWidth: '100%' }}
            navbarScroll
          >
            <Nav.Link as={Link} to="/employees" className="btn btn-outline-primary">Employees</Nav.Link>
            <Nav.Link as={Link} to="/prediction" className="btn btn-outline-primary">Predict Salary</Nav.Link>
            <Nav.Link as={Link} to="/profile" className="btn btn-outline-primary">Profile</Nav.Link>


          </Nav>

          <Nav className="ms-auto">
            {user ? (
              <>
                <Navbar.Text className="me-3">
                  Welcome, {user.name}!
                </Navbar.Text>
                <Nav.Link as="button" onClick={handleLogout} className="btn btn-outline-primary">
                  Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/" className="btn btn-outline-primary">Sign In</Nav.Link>
                <Nav.Link as={Link} to="/register" className="btn btn-outline-primary">Sign Up</Nav.Link>
              </>
            )}
          </Nav>
          <Navbar.Brand href="/" >
            <img className="img-responsive" src="/src/assets/Travelers-Emblem.jpg"></img>
          </Navbar.Brand>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}