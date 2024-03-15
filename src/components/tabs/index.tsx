import { Container, Nav, Navbar } from "react-bootstrap";

export const AppNavBar = () => {
  return (
    <Navbar expand="lg" variant="dark">
      <Container fluid>
        <Navbar.Brand href="#">CASOPRAP</Navbar.Brand>
        <Nav fill variant="tabs">
          <Nav.Item>
            <Nav.Link href="/voluntarios">Voluntaios</Nav.Link>
          </Nav.Item>
          <Nav.Link href="/animais">Animais</Nav.Link>
          <Nav.Link href="/recursos">Recursos</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};
