import { FormEvent, useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { Volunteer } from "../../types/volunteer";
import Select from "react-select";
import { invoke } from "@tauri-apps/api";
import { sendNotification } from "@tauri-apps/api/notification";
import Modal from "react-bootstrap/esm/Modal";
import { ResourceRequest } from "../../types/resource";

type Option = {
  value: number;
  label: string;
};

type RegisterResourceModalProps = {
  show: boolean;
  handleClose: () => void;
};

export const RegisterResourceModal = ({
  show,
  handleClose,
}: RegisterResourceModalProps) => {
  const [volunteerOption, setVolunteerOption] = useState<Option[]>([]);
  const [selectedOption, setSelectedOption] = useState<number>();
  const [form, setForm] = useState<ResourceRequest>({
    description: "",
    price: 0,
    volunteer_id: -1,
  });

  useEffect(() => {
    const fetchVolunteers = async () => {
      invoke("find_all_volunteers").then((response) => {
        const volunteers = response as Volunteer[];
        setVolunteerOptions(
          volunteers.map((volunteer: Volunteer) => ({
            value: volunteer.id,
            label: volunteer.name + "/" + volunteer.cpf,
          }))
        );
      });
    };

    fetchVolunteers();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    invoke("create_resource", {
      description,
      price: Number(price),
      volunteer_id: volunteerId,
    })
      .then((response) => {
        if (response === "Success") {
          sendNotification("Recurso cadastrado com sucesso!");
        } else {
          sendNotification("Algo de errado aconteceu");
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
            <Select
              name="responsible_volunteer"
              options={volunteerOption}
              onChange={(o) => {
                setSelectedOption(o?.value);
                handleFormChange({
                  target: {
                    name: "responsible_volunteer",
                    value: selectedOption?.toString() ?? "",
                  },
                });
              }}
            />
          </Form.Group>
          <Button
            type="submit"
            form="animal-form"
            className="mx-auto"
            variant="primary"
          >
            Cadastrar voluntario
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};
