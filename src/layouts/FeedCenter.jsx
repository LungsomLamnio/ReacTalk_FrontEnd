// FeedCenter.jsx
import { Card, Button } from "react-bootstrap";

export default function FeedCenter() {
  return (
    <div
      className="bg-white p-3 overflow-auto h-100"
      style={{ maxHeight: "100vh" }}
    >
      <div className="d-flex overflow-auto mb-4" style={{ gap: "10px" }}>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="rounded-circle border p-2 text-center"
            style={{ width: 70, height: 70, fontSize: 12 }}
          >
            Story {i + 1}
          </div>
        ))}
      </div>

      {[...Array(3)].map((_, i) => (
        <Card className="mb-4" key={i}>
          <Card.Header>
            <strong>@user{i + 1}</strong>
          </Card.Header>
          <Card.Img
            variant="top"
            src={`https://source.unsplash.com/600x300/?food,${i}`}
          />
          <Card.Body>
            <Card.Text>This is a caption for post #{i + 1}.</Card.Text>
            <Button variant="outline-primary" size="sm">
              Like
            </Button>{" "}
            <Button variant="outline-secondary" size="sm">
              Comment
            </Button>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}
