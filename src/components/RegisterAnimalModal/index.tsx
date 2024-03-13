import Modal from "react-modal";
import { FormEvent, useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { CustomModalStyles } from "../../ModalStyles";
import Select from "react-select";
import "./styles.css";
import { Volunteer } from "../../types/volunteer";
import { invoke } from "@tauri-apps/api";
import { sendNotification } from "@tauri-apps/api/notification";

type VolunteerOption = {
  value: number;
  label: string;
};

type RegisterAnimalModalProps = {
  isOpen: boolean;
  onRequestClose: () => void;
};

export const RegisterAnimalModal = ({
  isOpen,
  onRequestClose,
}: RegisterAnimalModalProps) => {
  const [name, setName] = useState<string>("");
  const [race, setRace] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [rescueLocation, setRescueLocation] = useState<string>("");
  const [isCastrado, setIsCastrado] = useState<boolean>();
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
    invoke("create_animal", {
      name,
      race,
      a_type: type,
      age: Number(age),
      rescue_location: rescueLocation,
      is_castrado: isCastrado,
      responsible_volunteer: volunteerId,
    })
      .then((response) => {
        if (response === "Success") {
          sendNotification("Animal cadastrado com sucesso!");
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
      shouldCloseOnEsc={false}
    >
      <div className="wrapper">
        <form className="form" onSubmit={handleSubmit}>
          <div className="row">
            <div className="cell">
              <button onClick={onRequestClose} className="button">
                <IoCloseSharp size={24} />
              </button>
            </div>
          </div>
          <div className="row">
            <div className="cell">
              <h1 className="title">Cadastrar Animal</h1>
            </div>
          </div>
          <div className="row">
            <div className="cell">
              <div className="input-field">
                Nome do animal
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="cell">
              <div className="input-field">
                Raca do animal
                <input
                  value={race}
                  onChange={(e) => setRace(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="cell">Tipo do animal</div>
          </div>
          <div className="row">
            <div className="cell">
              <div className="input-field align-center">
                Gato
                <input
                  className="radio"
                  type="radio"
                  value="cat"
                  checked={type === "cat"}
                  onChange={() => setType("cat")}
                />
              </div>
            </div>
            <div className="cell">
              <div className="input-field align-center">
                Cachorro
                <input
                  className="radio"
                  type="radio"
                  value="dog"
                  checked={type === "dog"}
                  onChange={() => setType("dog")}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="cell">
              <div className="input-field">
                Idade do animal
                <input
                  value={age}
                  type="text"
                  inputMode="numeric"
                  onChange={(e) => setAge(e.target.value)}
                  required
                  pattern="[0-9]{2}"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="cell">O animal e castrado?</div>
          </div>
          <div className="row">
            <div className="cell">
              <div className="input-field align-center">
                Sim
                <input
                  className="radio"
                  type="radio"
                  value="true"
                  checked={isCastrado}
                  onChange={() => setIsCastrado(true)}
                />
              </div>
            </div>
            <div className="cell">
              <div className="input-field align-center">
                Nao
                <input
                  className="radio"
                  type="radio"
                  value="false"
                  checked={!isCastrado}
                  onChange={() => setIsCastrado(false)}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="cell">
              <div className="input-field">
                Local de resgate do animal
                <input
                  value={rescueLocation}
                  onChange={(e) => setRescueLocation(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="cell">
              <div className="input-field">
                Voluntario Responsavel
                <Select
                  required
                  options={volunteerOptions}
                  onChange={(selected) => setVolunteerId(selected?.value)}
                />
              </div>
            </div>
          </div>
          <button className="submit-button">Cadastrar animal</button>
        </form>
      </div>
    </Modal>
  );
};
