import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import "./styles.css";
import { Volunteer } from "../../types/volunteer";
import { invoke } from "@tauri-apps/api";
import { sendNotification } from "@tauri-apps/api/notification";
import Form from "react-bootstrap/esm/Form";
import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/esm/Modal";
import Select from "react-select";

type VolunteerForm = {
  name: string;
  race: string;
  a_type: string;
  age: number | undefined;
  rescue_location: string;
  is_castrado: boolean;
  responsible_volunteer: number | undefined;
};

type RegisterAnimalModalProps = {
  show: boolean;
  handleClose: () => void;
};

type Option = {
  label: string;
  value: number;
};
export const RegisterAnimalModal = ({
  show,
  handleClose,
}: RegisterAnimalModalProps) => {
  const [volunteerOption, setVolunteerOption] = useState<Option[]>([]);
  const [selectedOption, setSelectedOption] = useState<number>();

  const [form, setForm] = useState<VolunteerForm>({
    name: "",
    race: "",
    a_type: "",
    age: 0,
    rescue_location: "",
    is_castrado: false,
    responsible_volunteer: -1,
  });

  const handleFormChange = (
    event:
      | ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = event.target;
    let parsedValue: number | boolean | undefined;

    if (name === "age") {
      parsedValue = parseInt(value);
    } else if (name === "responsible_volunteer") {
      parsedValue = parseInt(value);
    } else if (name === "is_castrado") {
      parsedValue = value === "yes" ? true : false;
    }

    setForm((prev) => ({
      ...prev,
      [name]: parsedValue ?? value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    invoke("create_animal", { animalReq: form })
      .then((response) => {
        if (response === "Success") {
          sendNotification("Animal cadastrado com sucesso!");
          handleClose();
        }
      })
      .catch((error) => sendNotification(error));
  };

  useEffect(() => {
    const fetchVolunteers = async () => {
      invoke("get_all_volunteers").then((response) => {
        const volunteers = response as Volunteer[];
        setVolunteerOption(
          volunteers.map((volunteer) => ({
            label: `${volunteer.id} - Nome: ${volunteer.name}, CPF: ${volunteer.cpf}`,
            value: volunteer.id,
          }))
        );
      });
    };

    fetchVolunteers();
  }, []);

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
                name="a_type"
                value="cat"
                onChange={handleFormChange}
              />
              <Form.Check
                inline
                label="cachorro"
                type="radio"
                name="a_type"
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
