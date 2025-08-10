import { Card, ListGroup, Spinner, Alert } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ChatList() {
  const [followings, setFollowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchFollowings() {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          setError("Please log in to see your followings");
          setLoading(false);
          return;
        }

        const response = await fetch(
          "http://localhost:3000/api/users/followings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const data = await response.json();
        setFollowings(data.followings || []);
      } catch (err) {
        console.error(err.message);
        setError("failed to load followings");
      } finally {
        setLoading(false);
      }
    }

    fetchFollowings();
  }, []);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Card className="p-3 mx-auto" style={{ maxWidth: "600px" }}>
      <h3>Users you follow</h3>

      {error && <Alert variant="danger">{error}</Alert>}

      {followings.length === 0 && !error ? (
        <p>You are not following anyone yet</p>
      ) : (
        <ListGroup>
          {followings.map((user) => (
            <ListGroup.Item
              key={user._id}
              action
              onClick={() => navigate("/chat-window")}
            >
              {user.username}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Card>
  );
}
