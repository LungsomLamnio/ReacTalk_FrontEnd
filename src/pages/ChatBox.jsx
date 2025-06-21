import { useEffect, useState } from "react";
import io from "socket.io-client";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";

const socket = io("http://localhost:3000");

const generateRandomName = () =>
  "User_" + Math.random().toString(36).substring(2, 6);

export default function ChatBox() {
  const [username] = useState(generateRandomName());
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("send-global-message", {
        sender: username,
        content: message,
      });
      setMessage("");
    }
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("🟢 Connected as", username);
    });

    socket.on("receive-global-message", (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive-global-message");
    };
  }, [username]);

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow">
            <Card.Header>
              🌍 Global Chat - You are <strong>{username}</strong>
            </Card.Header>
            <Card.Body style={{ height: "400px", overflowY: "auto" }}>
              {chat.length === 0 && (
                <p className="text-muted">No messages yet</p>
              )}
              {chat.map((msg, index) => {
                const isSelf = msg.sender === username;
                return (
                  <div
                    key={index}
                    className={`d-flex mb-2 ${
                      isSelf ? "justify-content-end" : "justify-content-start"
                    }`}
                  >
                    <div
                      className={`p-2 rounded ${
                        isSelf
                          ? "bg-primary text-white"
                          : "bg-light border text-dark"
                      }`}
                      style={{ maxWidth: "75%" }}
                    >
                      <strong>{isSelf ? "You" : msg.sender}</strong>:{" "}
                      {msg.content}
                      <br />
                      <small className="text-muted">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </small>
                    </div>
                  </div>
                );
              })}
            </Card.Body>
            <Card.Footer>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
              >
                <Row>
                  <Col>
                    <Form.Control
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                    />
                  </Col>
                  <Col xs="auto">
                    <Button type="submit" variant="primary">
                      Send
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
