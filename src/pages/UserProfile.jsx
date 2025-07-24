import {
  Container,
  Card,
  Alert,
  Spinner,
  Row,
  Col,
  Image,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProfilePicture from "../assets/pfp.jpg";

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
        <h3 className="text-center mb-4">User Profile</h3>
        {error && <Alert variant="danger">{error}</Alert>}

        {!profileData && !alert && (
          <Spinner animation="border" className="mx-auto d-block" />
        )}

        {profileData && (
          <Row>
            {/* Profile Picture */}
            <Col xs={12} md={4} className="text-center mb-md-0">
              <Image
                src={ProfilePicture}
                alt="profile-picture"
                roundedCircle
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
            </Col>
            {/* Profile Info */}
            <Col xs={12} md={8}>
              <h4>{profileData.username}</h4>
              <p>
                <strong>Email: </strong>
                {profileData.email}
              </p>
              <p>
                <strong>Bio: </strong>
                {profileData.bio || "No Bio Yet"}
              </p>
              <p>
                <strong>Followers: </strong>
                {profileData.followers?.length || 0}
              </p>
              <p>
                <strong>Followings: </strong>
                {profileData.followings?.length || 0}
              </p>
            </Col>
          </Row>
        )}
      </Card>
    </Container>
  );
}
