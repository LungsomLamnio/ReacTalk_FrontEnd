import { Form, Card, Alert, Button, Container } from "react-bootstrap";
import { useState } from "react";

export default function UserLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleFormData = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    console.log("Form Submitted Successfully");
    console.log(formData);
    setFormData({
      email: "",
      password: "",
    });
  };
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <Card style={{ width: "100%", maxWidth: "400px" }} className="p-4 shadow">
        <Form onSubmit={handleFormSubmit}>
          <h2 className="text-center mb-4">Login</h2>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter email"
              onChange={handleFormData}
              required
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter password"
              onChange={handleFormData}
              required
            ></Form.Control>
          </Form.Group>
          <Button type="submit" variant="primary" className="w-100">
            Log In
          </Button>
        </Form>
        <div className="text-center mt-3">
          Don't have an account? <a href="/user-signup">Sign Up</a>
        </div>
      </Card>
    </Container>
  );
}
