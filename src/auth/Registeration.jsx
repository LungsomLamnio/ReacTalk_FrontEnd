import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { useState } from "react";

export default function Registeration() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (event) => {
    setFormData((prevValue) => {
      return { ...prevValue, [event.target.name]: event.target.value };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
  };
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="p-4 shadow-sm">
            <h3 className="text-center mb-4">User Registeration</h3>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formName">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  onChange={handleChange}
                  value={formData.name}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  onChange={handleChange}
                  value={formData.email}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  onChange={handleChange}
                  value={formData.password}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formConfirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  onChange={handleChange}
                  value={formData.confirmPassword}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                Register
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
