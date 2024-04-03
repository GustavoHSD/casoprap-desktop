import { useEffect, useState } from "react";
import { Volunteer } from "../../types/volunteer";
import { MdOutlineDeleteForever } from "react-icons/md";
import { MdOutlineEdit } from "react-icons/md";
import { invoke } from "@tauri-apps/api";
import { OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import { RegisterVolunteerModal } from "../VolunteerModal";
import { IoPersonAdd } from "react-icons/io5";
import { ActionButton } from "../button";
import { sendNotification } from "@tauri-apps/api/notification";

export const VolunteerTable = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>();
  const [tableHasChanged, setTableHasChanged] = useState(false);
  const [show, setShow] = useState(false);

  const handleOpenModal = () => setShow(true);
  const handleCloseModal = () => setShow(false);

  useEffect(() => {
    const fetchData = () => {
      invoke("get_all_volunteers")
        .then((response) => {
          setVolunteers(response as Volunteer[]);
        })
        .catch((error) => sendNotification(error));
    };

    fetchData();
  }, [show, tableHasChanged]);

  const handleSetActive = (volunteer: Volunteer) => {
    volunteer.is_active = !volunteer.is_active;
    invoke("update_volunteer", { id: volunteer.id, volunteerReq: volunteer })
      .then(() => {
        setTableHasChanged(!tableHasChanged);
      })
      .catch((error) => sendNotification(error));
  };

  const handleDeleteVolunteer = (id: number) => {
    invoke("delete_volunteer", { id });
    setTableHasChanged(!tableHasChanged);
  };

  return (
    <div className="table-container">
      <ActionButton
        action={handleOpenModal}
        icon={<IoPersonAdd />}
        title="adicionar"
      />
      <div className="table-wrapper">
        <Table striped responsive="xxl" hover>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col" style={{ width: "50%" }}>
                Nome
              </th>
              <th scope="col" style={{ width: "30%" }}>
                Cpf
              </th>
              <th scope="col">Esta ativo</th>
              <th scope="col" style={{ width: "15%" }}>
                Acoes
              </th>
            </tr>
          </thead>
          <tbody className="align-middle">
            {volunteers &&
              volunteers.map((volunteer: Volunteer) => (
                <tr key={volunteer.id}>
                  <td scope="row">{volunteer.id}</td>
                  <td>{volunteer.name}</td>
                  <td>{volunteer.cpf}</td>
                  <td>
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip>
                          {volunteer.is_active
                            ? "Clique para marcar este voluntario como INATIVO"
                            : "Clique para marcar este voluntario como ATIVO"}
                        </Tooltip>
                      }
                    >
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() => handleSetActive(volunteer)}
                      >
                        {volunteer.is_active ? "sim" : "nao"}
                      </div>
                    </OverlayTrigger>
                  </td>
                  <td>
                    <ActionButton
                      action={() => handleDeleteVolunteer(volunteer.id)}
                      icon={
                        <MdOutlineDeleteForever
                          className="icon"
                          size={32}
                          color="black"
                        />
                      }
                      title="deletar"
                    />
                    <ActionButton
                      action={() => {}}
                      icon={
                        <MdOutlineEdit
                          className="icon"
                          size={32}
                          color="black"
                        />
                      }
                      title="editar"
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
      <RegisterVolunteerModal show={show} handleClose={handleCloseModal} />
    </div>
  );
};
