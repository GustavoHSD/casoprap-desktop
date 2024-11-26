import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export const AppNavBar = () => {
  return (
    <Navbar sticky="top" fixed="top" style={{ marginBottom: "200px" }}>
      <Container fluid>
        <Navbar.Brand href="/">CASOPRAP</Navbar.Brand>
        <Nav defaultActiveKey="home" fill variant="tabs">
          <Nav.Item>
            <NavLink
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              to="/volunteers"
            >
              Voluntaios
            </NavLink>
          </Nav.Item>
          <Nav.Item>
            <NavLink
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              to="/animals"
            >
              Animais
            </NavLink>
          </Nav.Item>
          <Nav.Item>
            <NavLink
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              to="/resources"
            >
              Recursos
            </NavLink>
          </Nav.Item>
        </Nav>
      </Container>
    </Navbar>
  );
};
