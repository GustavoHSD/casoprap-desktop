import { useEffect, useState } from "react";
import { Volunteer } from "../../types/volunteer";
import { MdOutlineDeleteForever } from "react-icons/md";
import { MdOutlineEdit } from "react-icons/md";
import { invoke } from "@tauri-apps/api";
import { Form, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import { RegisterVolunteerModal } from "../VolunteerModal";
import { IoPersonAdd } from "react-icons/io5";
import { ActionButton } from "../button";
import { sendNotification } from "@tauri-apps/api/notification";

export const VolunteerTable = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>();
  const [tableHasChanged, setTableHasChanged] = useState(false);
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState("");
  const [filterVolunteerActive, setFilterVolunteerActive] = useState(false);

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

  const handleFilterVolunteerActive = () => {
    setFilterVolunteerActive(!filterVolunteerActive);
  };

  return (
    <div className="table-container">
      <div className="d-flex justify-content-between">
        <ActionButton
          action={handleOpenModal}
          icon={<IoPersonAdd size={24} />}
          title="adicionar"
        />
        <Form.Group className="align-self-center w-25">
          <Form.Control
            className="align-self-center"
            type="search"
            placeholder="Digite o nome ou o cpf do voluntario"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Form.Group>
      </div>
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
              <td>
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip>
                      {filterVolunteerActive
                        ? "Clique para ver todos funcionarios"
                        : "Clique para ver somente funcionarios ATIVOS"}
                    </Tooltip>
                  }
                >
                  <div
                    style={{ cursor: "pointer", fontStyle: "bold" }}
                    onClick={() => handleFilterVolunteerActive()}
                  >
                    Status
                  </div>
                </OverlayTrigger>
              </td>
              <th scope="col" style={{ width: "15%" }}>
                Acoes
              </th>
            </tr>
          </thead>
          <tbody className="align-middle">
            {volunteers &&
              volunteers
                .filter((volunteer: Volunteer) => {
                  return (
                    (volunteer.name.toLowerCase().includes(search) ||
                      volunteer.cpf.toLowerCase().includes(search)) &&
                    (filterVolunteerActive
                      ? volunteer.is_active === true
                      : true)
                  );
                })
                .map((volunteer: Volunteer) => (
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
