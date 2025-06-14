// Home.jsx
import { Container, Row, Col } from "react-bootstrap";
import SideBarLeft from "../layouts/SideBarLeft";
import SideBarRight from "../layouts/SideBarRight";
import FeedCenter from "../layouts/FeedCenter";

export default function Home() {
  return (
    <Container fluid className="vh-100 overflow-hidden">
      <Row className="h-100">
        <Col md={3} className="p-0">
          <SideBarLeft />
        </Col>
        <Col md={6} className="p-0">
          <FeedCenter />
        </Col>
        <Col md={3} className="p-0 d-none d-md-block">
          <SideBarRight />
        </Col>
      </Row>
    </Container>
  );
}
