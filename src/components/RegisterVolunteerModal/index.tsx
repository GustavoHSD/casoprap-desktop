import "react";
import Modal from "react-modal";
import { FormEvent, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import "./styles.css";
import { CustomModalStyles } from "../../ModalStyles";
import { invoke } from "@tauri-apps/api";
import { sendNotification } from "@tauri-apps/api/notification";

type RegisterVolunteerModalProps = {
  isOpen: boolean;
  onRequestClose: () => void;
};

export const RegisterVolunteerModal = ({
  isOpen,
  onRequestClose,
}: RegisterVolunteerModalProps) => {
  const [name, setName] = useState<string>("");
  const [cpf, setCpf] = useState<string>("");

  const handleSubmit = () => {
    invoke("test").then((r) => console.log(r))
    invoke("create_volunteer", { name, cpf })
      .then((response) => {
        if (response === "Success") {
          sendNotification("Voluntario cadastrado com sucesso!");
          onRequestClose();
        }
      })
      .catch((error) => {
        sendNotification(error);
      });
  };
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={CustomModalStyles}
    >
      <div className="wrapper">
        <form className="form">
          <button onClick={onRequestClose} className="button">
            <IoCloseSharp size={24} />
          </button>
          <div className="row">
            <div className="cell">
              <div className="title">
                <h1>Adicionar Voluntario</h1>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="cell">
              <label className="input-field">
                Nome do voluntario
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>
            </div>
          </div>
          <div className="row">
            <div className="cell">
              <label className="input-field">
                Cpf do voluntario
                <input
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  maxLength={11}
                  minLength={11}
                  required
                />
              </label>
            </div>
          </div>
          <button className="submit-button" onClick={handleSubmit}>
            Cadastrar voluntario
          </button>
        </form>
      </div>
    </Modal>
  );
};
