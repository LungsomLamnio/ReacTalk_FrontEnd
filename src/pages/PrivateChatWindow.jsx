import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { Spinner, Alert, Button, Form } from "react-bootstrap";

const SOCKET_SERVER_URL = "http://localhost:3000";
const socket = io(SOCKET_SERVER_URL);

export default function PrivateChatWindow() {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedUser = location.state?.user;

  const storedUser = sessionStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const currentUserId = currentUser?.id || null;

  useEffect(() => {
    if (!currentUserId) navigate("/user-login");
    if (!selectedUser) navigate("/chat-list");
  }, [currentUserId, selectedUser, navigate]);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!selectedUser || !currentUserId) {
      setLoading(false);
      return;
    }

    socket.emit("registerUser", currentUserId);

    async function fetchMessages() {
      setLoading(true);
      setError(null);

      try {
        const token = sessionStorage.getItem("token");
        if (!token) throw new Error("No auth token found");

        const response = await fetch(
          `${SOCKET_SERVER_URL}/api/messages/private/${selectedUser._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Failed to load messages");

        const data = await response.json();
        setMessages(data.messages || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();

    const receiveHandler = (message) => {
      if (
        (message.senderId === selectedUser._id &&
          message.receiverId === currentUserId) ||
        (message.senderId === currentUserId &&
          message.receiverId === selectedUser._id)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    };
    socket.on("receiveMessage", receiveHandler);

    return () => {
      socket.off("receiveMessage", receiveHandler);
    };
  }, [selectedUser, currentUserId]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      senderId: currentUserId,
      receiverId: selectedUser._id,
      content: newMessage.trim(),
      createdAt: new Date(),
    };

    socket.emit("sendMessage", messageData);

    setNewMessage("");
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <Spinner animation="border" />
      </div>
    );
  }

  if (!selectedUser || !currentUserId)
    return <p>Redirecting, please wait...</p>;

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 16 }}>
      <h3>Chatting with {selectedUser.username}</h3>

      {error && <Alert variant="danger">{error}</Alert>}

      <div
        style={{
          height: "60vh",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: 16,
          marginBottom: 16,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {messages.length === 0 ? (
          <p>No messages yet, start the conversation!</p>
        ) : (
          messages.map((msg, idx) => {
            const isMe =
              msg.sender?._id === currentUserId ||
              msg.senderId === currentUserId;
            const senderUsername = isMe
              ? "You"
              : msg.sender?.username || msg.senderUsername || "Unknown";

            return (
              <div
                key={idx}
                style={{
                  marginBottom: 8,
                  alignSelf: isMe ? "flex-end" : "flex-start",
                  backgroundColor: isMe ? "#dcf8c6" : "#fff",
                  padding: "8px 16px",
                  borderRadius: 15,
                  maxWidth: "70%",
                  wordBreak: "break-word",
                }}
              >
                <b>{senderUsername}:</b> {msg.content}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <Form onSubmit={sendMessage} className="d-flex">
        <Form.Control
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button type="submit" variant="primary" disabled={!newMessage.trim()}>
          Send
        </Button>
      </Form>
    </div>
  );
}
