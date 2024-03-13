import Modal from "react-modal";
import { FormEvent, useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { Volunteer } from "../../types/volunteer";
import Select from "react-select";
import { CustomModalStyles } from "../../ModalStyles";
import { invoke } from "@tauri-apps/api";
import { sendNotification } from "@tauri-apps/api/notification";

type VolunteerOption = {
  value: number;
  label: string;
};

type RegisterResourceModalProps = {
  isOpen: boolean;
  onRequestClose: () => void;
};

export const RegisterResourceModal = ({
  isOpen,
  onRequestClose,
}: RegisterResourceModalProps) => {
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [volunteerId, setVolunteerId] = useState<number>();
  const [volunteerOptions, setVolunteerOptions] = useState<VolunteerOption[]>(
    []
  );

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
        onRequestClose();
      } else {
        sendNotification("Algo de errado aconteceu");
      }
    })
    .catch((error) => sendNotification(error));
  };
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={CustomModalStyles}
    >
      <form onSubmit={handleSubmit} className="form">
        <div className="row">
          <div className="cell">
            <button onClick={onRequestClose} className="button">
              <IoCloseSharp size={24} />
            </button>
          </div>
        </div>
        <div className="row">
          <div className="cell">
            <h1 className="title">Adicionar Recurso(Medicamento/Comida)</h1>
          </div>
        </div>
        <div className="row">
          <div className="cell">
            <div className="input-field">
              Descriçao do recurso
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="cell">
            <div className="input-field">
              Preço do recurso
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                id="price"
                name="price"
                step="0.01"
                min="0.01"
                required
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="cell">
            <div className="input-field">
              Voluntario associado ao recurso
              <Select
                required
                options={volunteerOptions}
                onChange={(selected) => setVolunteerId(selected?.value ?? "")}
              />
            </div>
          </div>
        </div>

        <button className="submit-button" type="submit">
          Cadastrar recurso
        </button>
      </form>
    </Modal>
  );
};
