import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

export const AppNavBar = () => {
  return (
    <Navbar  sticky="top" fixed="top" style={{ marginBottom: '200px'}}>
      <Container fluid>
        <Navbar.Brand href="#">CASOPRAP</Navbar.Brand>
        <Nav defaultActiveKey="volunteers" fill variant="tabs">
          <Nav.Item>
            <Nav.Link as="div" eventKey={"volunteers"}>
              <Link to="/volunteers">Voluntaios</Link>
            </Nav.Link>
          </Nav.Item>
          <Nav.Link as="div" eventKey={"animal"}>
            <Link to="/animals">Animais</Link>
          </Nav.Link>
          <Nav.Link as="div" eventKey={"resources"}>
            <Link to="/resources">Recursos</Link>
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};
