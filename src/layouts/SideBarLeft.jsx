// SidebarLeft.jsx
import { Form, ListGroup } from "react-bootstrap";

export default function SideBarLeft() {
  return (
    <div className="bg-light border-end p-3 h-100">
      <h5>Chats</h5>
      <Form.Control
        type="text"
        placeholder="Search or start new chat"
        className="mb-3"
      />
      <ListGroup
        variant="flush"
        className="chat-list overflow-auto"
        style={{ maxHeight: "80vh" }}
      >
        {[
          "Swati - THN",
          "Chintu Voda",
          "Pinder whatzap",
          "Priyanshu",
          "Harash",
          "Jiten",
        ].map((user, idx) => (
          <ListGroup.Item key={idx} action>
            <strong>{user}</strong>
            <br />
            <small className="text-muted">Typing...</small>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}
