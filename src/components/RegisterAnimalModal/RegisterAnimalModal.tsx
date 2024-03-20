import Modal from "react-modal";
import { FormEvent, useEffect, useState } from "react";
import { Volunteer } from "../../types/volunteer";
import { invoke } from "@tauri-apps/api";
import { sendNotification } from "@tauri-apps/api/notification";
import Form from "react-bootstrap/esm/Form";
import { RegisterAnimalModalProps, VolunteerOption } from ".";


export const RegisterAnimalModal = ({
    isOpen, onRequestClose,
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
        <Modal show={show} onHide={handleClose} centered>
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
                            onChange={(e) => setName(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Cpf do voluntario</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Digite o cpf do voluntario"
                            value={cpf}
                            onChange={(e) => setCpf(e.target.value)} />
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

