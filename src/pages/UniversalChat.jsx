import { useState, useEffect, useRef } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import { io } from "socket.io-client";

export default function UniversalChat() {
  const [messages, setMessages] = useState([]);
  const [newMssg, setNewMssg] = useState("");
  const [loading, setLoading] = useState(false);
  const token = sessionStorage.getItem("token");
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io("http://localhost:3000");

    socket.current.on("receiveMessage", (message) => {
      setMessages((prevMssg) => [...prevMssg, message]);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchedMessages = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/messages", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data.messages);
        setMessages(response.data.messages || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchedMessages();
  }, [token]);

  const sendMessage = async () => {
    if (!newMssg.trim()) {
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/messages",
        { content: newMssg },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      socket.current.emit("sendMessage", response.data.message);
      setNewMssg("");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Container className="py-4">
      <Card className="shadow p-3">
        <h4 className="text-center mb-4">Universal Chat</h4>
        <div
          style={{
            maxHeight: "400px",
            overflow: "auto",
            border: "1px solid #ddd",
            borderRadius: "5px",
            padding: "10px",
          }}
        >
          {loading ? (
            <Spinner animation="border" />
          ) : (
            <ListGroup variant="flush">
              {messages.map((mssg) => (
                <ListGroup.Item key={mssg._id}>
                  <strong>{mssg.sender?.username || "Anonymous"}: </strong>{" "}
                  {mssg.content}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </div>

        <Form className="d-flex mt-3" onSubmit={(e) => e.preventDefault()}>
          <Form.Control
            type="text"
            placeholder="Type a message..."
            value={newMssg}
            onChange={(e) => setNewMssg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <Button onClick={sendMessage}>send</Button>
        </Form>
      </Card>
    </Container>
  );
}
