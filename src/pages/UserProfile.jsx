import { Container, Card, Alert, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserProfile() {
  const [error, setError] = useState("");
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in");
        setTimeout(() => {
          return navigate("/user-login");
        }, 3000);
      }

      try {
        const response = await axios.get(
          "http://localhost:3000/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProfileData(response.data.user);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch profile.");

        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/user-login");
        }
      }
    };
    fetchProfile();
  }, [navigate]);
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <Card style={{ width: "100%", maxWidth: "500px" }} className="p-4 shadow">
        <h3>User Profile</h3>
        {error && <Alert variant="danger">{error}</Alert>}

        {!profileData && !alert && (
          <Spinner animation="border" className="mx-auto d-block" />
        )}

        {profileData && (
          <div>
            <p>
              <strong>Username: </strong>
              {profileData.username}
            </p>
            <p>
              <strong>Email: </strong>
              {profileData.email}
            </p>
            <p>
              <strong>ID: </strong>
              {profileData.id}
            </p>
          </div>
        )}
      </Card>
    </Container>
  );
}
