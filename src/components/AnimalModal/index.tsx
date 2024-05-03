import { ChangeEvent, FormEvent, useState } from "react";
import { invoke } from "@tauri-apps/api";
import { sendNotification } from "@tauri-apps/api/notification";
import Form from "react-bootstrap/esm/Form";
import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/esm/Modal";
import { AnimalForm, AnimalRequest } from "../../types/animal";
import { VolunteerSelect } from "../volunteerSelect";

type RegisterAnimalModalProps = {
  id?: number;
  show: boolean;
  handleClose: () => void;
};

export const AnimalModal = ({
  id,
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

  if (id) {
    invoke("get_animal", { id })
      .then((response) => {
        setForm(response as AnimalForm);
      })
      .catch((error) => sendNotification(error));
  }

  const handleFormChangeWithEvent = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, files } = event.target;
    let finalValue: string | ArrayBuffer | null = value;
    let reader = new FileReader();
    if (name === "profile_picture" && files && files[0]) {
      reader.onloadend = () => {
        finalValue = reader.result;
        setForm((prev) => ({
          ...prev,
          profile_picture: finalValue,
        }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: finalValue,
      }));
    }
  };

  const handleFormChangeWithoutEvent = (target: {
    name: string;
    value: string;
  }) => {
    const { name, value } = target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formReq: AnimalRequest = {
      ...form,
      age: parseInt(form.age),
      profile_picture: form.profile_picture as string ?? "",
      responsible_volunteer: parseInt(form.responsible_volunteer),
      is_castrado: form.is_castrado === "yes" ? true : false,
    };
    if (id) {
      invoke("update_animal", { id: id, animalReq: formReq })
        .then((response) => {
          if (response === "Success") {
            sendNotification("Animal editado com sucesso!");
            handleClose();
          } else {
            sendNotification("Algo de errado aconteceu, tente novamente!");
          }
        })
        .catch((error) => sendNotification(error));
    } else {
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
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Adicionar Animal</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form id="animal-form" onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label>
              {form.profile_picture !== null ? (
                <div className="picture-container">
                  <img
                    className="picture"
                    src={form.profile_picture as string}
                    alt="Animal Picture"
                  />
                </div>
              ) : (
                ""
              )}
              Foto do animal
            </Form.Label>
            <Form.Control
              name="profile_picture"
              placeholder="Digite o nome do voluntario"
              type="file"
              accept="image/*"
              onChange={handleFormChangeWithEvent}
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Nome do animal</Form.Label>
            <Form.Control
              name="name"
              type="text"
              placeholder="Digite o nome do voluntario"
              value={form.name}
              onChange={handleFormChangeWithEvent}
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Raca do animal</Form.Label>
            <Form.Control
              name="race"
              type="text"
              placeholder="Digite a raca do animal"
              value={form.race}
              onChange={handleFormChangeWithEvent}
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
                onChange={handleFormChangeWithEvent}
              />
              <Form.Check
                inline
                label="cachorro"
                type="radio"
                name="animal_type"
                value="dog"
                onChange={handleFormChangeWithEvent}
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
              onChange={handleFormChangeWithEvent}
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Local de resgate do animal</Form.Label>
            <Form.Control
              name="rescue_location"
              type="text"
              placeholder="Digite o local de resgate do animal"
              value={form.rescue_location}
              onChange={handleFormChangeWithEvent}
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
                onChange={handleFormChangeWithEvent}
              />
              <Form.Check
                inline
                label="nao"
                type="radio"
                name="is_castrado"
                value="no"
                onChange={handleFormChangeWithEvent}
              />
            </div>
          </Form.Group>
          <Form.Group>
            <Form.Label>Voluntario Responsavel</Form.Label>
            <VolunteerSelect
              handleFormChange={handleFormChangeWithoutEvent}
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
