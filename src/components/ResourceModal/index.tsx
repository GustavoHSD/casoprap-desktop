import { ChangeEvent, FormEvent, useState } from "react";
import { invoke } from "@tauri-apps/api";
import { sendNotification } from "@tauri-apps/api/notification";
import Modal from "react-bootstrap/esm/Modal";
import { ResourceForm, ResourceRequest } from "../../types/resource";
import Form from "react-bootstrap/esm/Form";
import Button from "react-bootstrap/esm/Button";
import { VolunteerSelect } from "../volunteerSelect";

type RegisterResourceModalProps = {
  show: boolean;
  handleClose: () => void;
};

export const RegisterResourceModal = ({
  show,
  handleClose,
}: RegisterResourceModalProps) => {
  const [form, setForm] = useState<ResourceForm>({
    description: "",
    price: "",
    volunteer_id: "",
  });

  const handleFormChangeWithEvent = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

    const handleFormChangeWithoutEvent = (target: { name: string; value: string }) => {
    const { name, value } = target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formReq: ResourceRequest = {
      ...form,
      price: parseFloat(form.price),
      volunteer_id: Number(form.volunteer_id),
    };
    invoke("create_resource", { resourceReq: formReq })
      .then((response) => {
        if (response === "Success") {
          sendNotification("Recurso cadastrado com sucesso!");
          handleClose();
        } else {
          sendNotification("Algo de errado aconteceu, tente novamente!");
        }
      })
      .catch((error) => sendNotification(error));
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Adicionar Animal</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form id="resource-form" onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label>Descricao do recurso</Form.Label>
            <Form.Control
              name="description"
              type="text"
              placeholder="Digite o nome do voluntario"
              value={form.description}
              onChange={handleFormChangeWithEvent}
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Preco do recurso</Form.Label>
            <Form.Control
              name="price"
              placeholder="Digite o nome do voluntario"
              value={form.price}
              onChange={handleFormChangeWithEvent}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Voluntario Responsavel</Form.Label>
            <VolunteerSelect
              handleFormChange={handleFormChangeWithoutEvent}
              name="volunteer_id"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="submit"
          form="resource-form"
          className="mx-auto"
          variant="primary"
        >
          Cadastrar voluntario
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
