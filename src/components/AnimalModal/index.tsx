import { ChangeEvent, FormEvent, useState } from "react";
import { invoke } from "@tauri-apps/api";
import { sendNotification } from "@tauri-apps/api/notification";
import Form from "react-bootstrap/esm/Form";
import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/esm/Modal";
import { AnimalForm, AnimalRequest } from "../../types/animal";
import { VolunteerSelect } from "../volunteerSelect";

type RegisterAnimalModalProps = {
  show: boolean;
  handleClose: () => void;
};

export const RegisterAnimalModal = ({
  show,
  handleClose,
}: RegisterAnimalModalProps) => {
  const [form, setForm] = useState<AnimalForm>({
    name: "",
    race: "",
    animal_type: "",
    age: "",
    rescue_location: "",
    is_adopted: false,
    is_castrado: "",
    responsible_volunteer: "",
  });

  const handleFormChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value ?? files[0],
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formReq: AnimalRequest = {
      ...form,
      age: parseInt(form.age),
      responsible_volunteer: parseInt(form.responsible_volunteer),
      is_castrado: form.is_castrado === "yes" ? true : false,
    };
    invoke("create_animal", { animalReq: formReq })
      .then((response) => {
        if (response === "Success") {
          sendNotification("Animal cadastrado com sucesso!");
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
        <Form id="animal-form" onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label>Foto do animal</Form.Label>
            <Form.Control
              name="profile-picture"
              placeholder="Digite o nome do voluntario"
              type="file"
              accept="image/*"
              onChange={handleFormChange}
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Nome do animal</Form.Label>
            <Form.Control
              name="name"
              type="text"
              placeholder="Digite o nome do voluntario"
              value={form.name}
              onChange={handleFormChange}
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Raca do animal</Form.Label>
            <Form.Control
              name="race"
              type="text"
              placeholder="Digite a raca do animal"
              value={form.race}
              onChange={handleFormChange}
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Tipo do animal</Form.Label>
            <div className="d-flex justify-content-evenly">
              <Form.Check
                inline
                label="gato"
                type="radio"
                name="animal_type"
                value="cat"
                onChange={handleFormChange}
              />
              <Form.Check
                inline
                label="cachorro"
                type="radio"
                name="animal_type"
                value="dog"
                onChange={handleFormChange}
              />
            </div>
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Idade do animal (Deixe 0 se nao souber)</Form.Label>
            <Form.Control
              name="age"
              type="number"
              placeholder="Digite a idade do animal"
              value={form.age}
              onChange={handleFormChange}
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Local de resgate do animal</Form.Label>
            <Form.Control
              name="rescue_location"
              type="text"
              placeholder="Digite o local de resgate do animal"
              value={form.rescue_location}
              onChange={handleFormChange}
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>O animal e castrado?</Form.Label>
            <div className="d-flex justify-content-evenly">
              <Form.Check
                inline
                label="sim"
                type="radio"
                name="is_castrado"
                value="yes"
                onChange={handleFormChange}
              />
              <Form.Check
                inline
                label="nao"
                type="radio"
                name="is_castrado"
                value="no"
                onChange={handleFormChange}
              />
            </div>
          </Form.Group>
          <Form.Group>
            <Form.Label>Voluntario Responsavel</Form.Label>
            <VolunteerSelect
              handleFormChange={handleFormChange}
              name="responsible_volunteer"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="submit"
          form="animal-form"
          className="mx-auto"
          variant="primary"
        >
          Cadastrar animal
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
