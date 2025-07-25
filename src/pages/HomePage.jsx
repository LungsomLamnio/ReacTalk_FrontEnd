import { Container, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <Card className="p-4 shadow" style={{ width: "100%", maxWidth: "600px" }}>
        <h2 className="text-center mb-4">Welcome to ReacTalk</h2>
        <p className="text-center text-muted">
          Start chatting with your friends in real time.
        </p>
        <div className="d-flex justify-content-center mt-4 gap-3">
          <Button variant="primary" onClick={() => navigate("/universal-chat")}>
            Go to chat
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() => navigate("/user-login")}
          >
            Logout
          </Button>
        </div>
      </Card>
    </Container>
  );
}
