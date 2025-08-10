import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Form, Card, Alert, Spinner, Button } from "react-bootstrap";

export default function SearchUsers() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchedUser, setSearchedUser] = useState(null);
  const [btnMssg, setBtnMssg] = useState("follow");
  const navigate = useNavigate();

  const handleSearch = async (event) => {
    event.preventDefault();
    console.log("handle search function called");
    setLoading(true);
    setError("");

    if (!username.trim()) {
      setError("Please enter a username");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3000/api/users/search/${username}`
      );
      setSearchedUser(response.data.user);
      console.log(response.data.user);
    } catch (err) {
      setSearchedUser(null);
      setError(err.response?.data?.message || "User not found");
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      setError("Please login to follow the user");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/api/users/follow/${searchedUser._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBtnMssg("unfollow");
      setMessage("User followed successfully");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to follow the user");
    }
  };
  return (
    <Container style={{ maxWidth: "600px", marginTop: "40px" }}>
      <h3>Search Users</h3>
      <Form className="d-flex mb-3">
        <Form.Control
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Button className="ms-3" onClick={handleSearch}>
          Search
        </Button>
      </Form>
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {message && <Alert variant="success">{message}</Alert>}

      {searchedUser && (
        <Card className="p-3 shadow-sm" style={{ cursor: "pointer" }}>
          <h5>{searchedUser.username}</h5>
          <Button variant="primary" onClick={handleFollow}>
            {btnMssg}
          </Button>
        </Card>
      )}
    </Container>
  );
}
