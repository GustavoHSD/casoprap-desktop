import { useEffect, useState } from "react";
import { Volunteer } from "../../types/volunteer";
import "./styles.css";
import { MdOutlineDeleteForever } from "react-icons/md";
import { MdOutlineEdit } from "react-icons/md";
import { invoke } from "@tauri-apps/api";
import { Button, Col, Container, Row, Stack, Table } from "react-bootstrap";
import { RegisterVolunteerModal } from "../RegisterVolunteerModal";
import { IoPersonAdd } from "react-icons/io5";

export const VolunteerTable = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>();
  const [deletedVolunteer, setDeletedVolunteer] = useState(false);
  const [show, setShow] = useState(false);

  const handleOpenModal = () => setShow(true);
  const handleCloseModal = () => setShow(false);

  useEffect(() => {
    const fetchData = () => {
      invoke("get_all_volunteers")
        .then((response) => {
          setVolunteers(response as Volunteer[]);
        })
        .catch((error) => console.error(error));
    };

    fetchData();
  }, [show, deletedVolunteer]);

  const handleDeleteVolunteer = (id: number) => {
    invoke("delete_volunteer", { id });
    setDeletedVolunteer(!deletedVolunteer);
  };

  return (
    <div>
      <Button variant="dark" onClick={handleOpenModal}>
        <IoPersonAdd />
      </Button>
      <Table striped hover>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Cpf</th>
            <th>Esta ativo</th>
            <th>Acoes</th>
          </tr>
        </thead>
        <tbody>
          {volunteers &&
            volunteers.map((volunteer: Volunteer) => (
              <tr key={volunteer.id}>
                <td>{volunteer.name}</td>
                <td>{volunteer.cpf}</td>
                <td>{volunteer.is_active ? "Sim" : "Nao"}</td>
                <td>
                  <Button
                    onClick={() => handleDeleteVolunteer(volunteer.id)}
                    className="action-button"
                  >
                    <MdOutlineDeleteForever size={32} />
                  </Button>
                  <Button
                    onClick={() => handleDeleteVolunteer(volunteer.id)}
                    className="action-button"
                  >
                    <MdOutlineEdit size={32} />
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      <RegisterVolunteerModal show={show} handleClose={handleCloseModal} />
    </div>
  );
};
