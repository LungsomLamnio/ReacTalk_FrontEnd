import { Container, Card, Button, Form, Alert } from "react-bootstrap";
import { useState } from "react";

export default function UserSignup() {
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleFormData = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    console.log(formData);

    if (formData.password !== formData.confirmPassword) {
      setError("Password do not match");
      return;
    }
  };
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <Card className="p-4" style={{ width: "100%", maxWidth: "450px" }}>
        <Form onSubmit={handleFormSubmit}>
          <h2 className="text-center mb-4">Sign Up</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              name="username"
              type="text"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleFormData}
              required
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              name="email"
              type="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleFormData}
              required
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              name="password"
              type="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleFormData}
              required
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="confirm-password">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleFormData}
              required
            ></Form.Control>
          </Form.Group>
          <Button variant="primary" type="submit" style={{ width: "100%" }}>
            Sign Up
          </Button>
        </Form>
        <div className="mt-3 text-center">
          Already have an account? <a href="/user-login">Sign In</a>
        </div>
      </Card>
    </Container>
  );
}
