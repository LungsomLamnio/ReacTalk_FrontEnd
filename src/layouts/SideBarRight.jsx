// SidebarRight.jsx
import { ListGroup, Button } from "react-bootstrap";

export default function SideBarRight() {
  return (
    <div className="bg-light border-start p-3 h-100">
      <h6>Suggestions</h6>
      <ListGroup variant="flush">
        {["alex", "chantou", "mishka", "gwangu", "thecomet"].map(
          (user, idx) => (
            <ListGroup.Item
              key={idx}
              className="d-flex justify-content-between align-items-center"
            >
              @{user}
              <Button variant="link" size="sm">
                Follow
              </Button>
            </ListGroup.Item>
          )
        )}
      </ListGroup>
    </div>
  );
}
