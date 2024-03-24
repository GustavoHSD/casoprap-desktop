import { ChangeEvent, FormEvent, useState } from "react";
import "./styles.css";
import { invoke } from "@tauri-apps/api";
import { sendNotification } from "@tauri-apps/api/notification";
import Modal from "react-bootstrap/esm/Modal";
import { Button, Form } from "react-bootstrap";
import { VolunteerRequest } from "../../types/volunteer";

type RegisterVolunteerModalProps = {
  show: boolean;
  handleClose: () => void;
};

export const RegisterVolunteerModal = ({
  show,
  handleClose,
}: RegisterVolunteerModalProps) => {
  const [form, setForm] = useState<VolunteerRequest>({
    volunteer_name: "",
    volunteer_cpf: "",
    volunteer_is_active: true,
  });

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    invoke("create_volunteer", { volunteerReq: form })
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
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Adicionar Voluntario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Nome do voluntario</Form.Label>
            <Form.Control
              name="volunteer_name"
              type="text"
              placeholder="Digite o nome do voluntario"
              value={form.volunteer_name}
              onChange={handleFormChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Cpf do voluntario</Form.Label>
            <Form.Control
              name="volunteer_cpf"
              type="number"
              placeholder="Digite o cpf do voluntario"
              value={form.volunteer_cpf}
              onChange={handleFormChange}
              minLength={11}
              maxLength={11}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Cadastrar voluntario
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
