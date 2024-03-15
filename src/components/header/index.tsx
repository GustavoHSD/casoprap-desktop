import { Col, Container } from "react-bootstrap";
import { AppTabs } from "../tabs";

export const Header = () => {
  return (
    <Container>
      <Col>
        <h1>Casaprap - Sistema de cadastro soprap</h1>
      </Col>
      <Col>
        <AppTabs />
      </Col>
    </Container>
  );
};
