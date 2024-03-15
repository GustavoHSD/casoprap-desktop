import { FormEvent, useState } from "react";
import "./styles.css";
import { invoke } from "@tauri-apps/api";
import { sendNotification } from "@tauri-apps/api/notification";
import Modal from "react-bootstrap/esm/Modal";
import { Button, Form } from "react-bootstrap";

type RegisterVolunteerModalProps = {
  show: boolean;
  handleClose: () => void;
};

export const RegisterVolunteerModal = ({
  show,
  handleClose,
}: RegisterVolunteerModalProps) => {
  const [name, setName] = useState<string>("");
  const [cpf, setCpf] = useState<string>("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    invoke("create_volunteer", { volunteerReq: { name, cpf, is_active: true } })
      .then((response) => {
        if (response === "Success") {
          sendNotification("Voluntario cadastrado com sucesso!");
          handleClose();
        }
      })
      .catch((error) => {
        sendNotification(error);
      });
  };
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Adicionar Voluntario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Nome do voluntario</Form.Label>
            <Form.Control
              type="text"
              placeholder="Digite o nome do voluntario"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Cpf do voluntario</Form.Label>
            <Form.Control
              type="number"
              placeholder="Digite o cpf do voluntario"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleSubmit}>
          Cadastrar voluntario
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
