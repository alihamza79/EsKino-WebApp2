import React, { useState, useEffect } from "react";
import { Table, Modal, Button } from "antd";
import { Link } from "react-router-dom";
import Header from "../Header";
import Sidebar from "../Sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import { blogimg2, imagesend, refreshicon, searchnormal } from "../imagepath";
import { db } from "../../config/firebase";
import { getDoc, doc } from "firebase/firestore";
import { updateDoc } from "firebase/firestore";
import {
  deleteDocument,
  fetchDocumentsWithQuery,
  getAllDocuments,
} from "../../services/dbService";

const ParticipantList = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const meetingId = searchParams.get("meetingid");
  const [participentToDele, setParticipentToDele] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const [filteredParticipants, setFilteredParticipants] = useState([]);

  const initialParticipentData = {
    sectionId: "",
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    persons: 4,
    personNames: "",
    gender: "",
    FIELD9: "",
  };

  const handleDelete = async (participantId) => {
    const participantIndex = participentData.findIndex(
      (p) => p.id === participantId
    );
    if (participantIndex === -1) return;

    const participant = participentData[participantIndex];
    const numberOfPersons = parseInt(participant.persons, 10);
    const meetingId = participant.sectionId;

    try {
      const meetingRef = doc(db, "meetings", meetingId);
      const meetingSnap = await getDoc(meetingRef);

      if (meetingSnap.exists()) {
        const meetingData = meetingSnap.data();
        const currentCapacity = parseInt(meetingData.capacity, 10) || 0;
        const updatedCapacity = currentCapacity + numberOfPersons;
        const updatedCapacityStr = updatedCapacity.toString();

        await updateDoc(meetingRef, {
          capacity: updatedCapacityStr,
        });

        await deleteDocument("participants", participantId);

        const updatedParticipants = participentData.filter(
          (p) => p.id !== participantId
        );
        setParticipantData(updatedParticipants);

        setIsDeleteModalOpen(false);
      }
    } catch (error) {
      console.error(
        "Failed to delete the participant or update the meeting:",
        error
      );
    }
  };

  const [participentData, setParticipantData] = useState([]);

  useEffect(() => {
    if (meetingId) {
      fetchDocumentsWithQuery("participants", "sectionId", meetingId).then(
        (querySnapshot) => {
          const loadedParticipants = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            firstName: doc.data().firstName,
            lastName: doc.data().lastName,
            email: doc.data().email,
            address: doc.data().address,
            persons: doc.data().persons,
            personNames: doc.data().personNames,
            gender: doc.data().gender,
            sectionId: doc.data().sectionId,
          }));
          setParticipantData(loadedParticipants);
        }
      );
    } else {
      getAllDocuments("participants").then((querySnapshot) => {
        const loadedParticipants = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          firstName: doc.data().firstName,
          lastName: doc.data().lastName,
          email: doc.data().email,
          address: doc.data().address,
          persons: doc.data().persons,
          personNames: doc.data().personNames,
          gender: doc.data().gender,
          sectionId: doc.data().sectionId,
        }));
        setParticipantData(loadedParticipants);
      });
    }
  }, [meetingId]);

  useEffect(() => {
    const filtered = participentData.filter(
      (participant) =>
        participant.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        participant.lastName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredParticipants(filtered);
  }, [searchQuery, participentData]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState({});

  const showModal = (participant) => {
    setSelectedParticipant(participant);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "",
      dataIndex: "sectionId",
      render: (text) => <Link to="#"></Link>,
      sorter: (a, b) => a.sectionId.length - b.sectionId.length,
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      render: (text) => <Link to="#">{text}</Link>,
      sorter: (a, b) => a.firstName.length - b.firstName.length,
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      sorter: (a, b) => a.lastName.length - b.lastName.length,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.length - b.email.length,
    },
    {
      title: "Persons",
      dataIndex: "persons",
      sorter: (a, b) => a.persons - b.persons,
    },
    {
      title: "",
      dataIndex: "actions",
      render: (_, record) => (
        <Button className="btn btn-primary" onClick={() => showModal(record)}>
          View Details
        </Button>
      ),
    },
    {
      title: "",
      dataIndex: "FIELD9",
      render: (_, record) => (
        <div className="text-end">
          <div className="dropdown dropdown-action">
            <Link
              to="#"
              className="action-icon dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="fas fa-ellipsis-v" />
            </Link>
            <div className="dropdown-menu dropdown-menu-end">
              <Link
                className="dropdown-item"
                to={`/meetinglist/participentlist/edit?meetingid=${record.sectionId}&participentid=${record.id}`}
              >
                <i className="far fa-edit me-2" />
                Edit
              </Link>
              <Link
                className="dropdown-item"
                to="#"
                onClick={() => {
                  setParticipentToDele(record.id);
                  setIsDeleteModalOpen(true);
                }}
              >
                <i className="fa fa-trash-alt m-r-5"></i> Delete
              </Link>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <Header />
      <Sidebar id="menu-item2" activeClassName="participant-list" />
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/meetinglist">Meeting</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right">
                      <FeatherIcon icon="chevron-right" />
                    </i>
                  </li>
                  <li className="breadcrumb-item active">Participants List</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="page-table-header mb-2">
                  <div className="row align-items-center">
                    <div className="col">
                      <div className="doctor-table-blk">
                        <h3>Participant List</h3>
                        <div className="doctor-search-blk">
                          <div className="top-nav-search table-search-blk">
                            <form>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Search by first or last name"
                                value={searchQuery}
                                onChange={(e) =>
                                  setSearchQuery(e.target.value)
                                }
                              />
                              <Link className="btn">
                                <img src={searchnormal} alt="#" />
                              </Link>
                            </form>
                          </div>
                          <div className="add-group">
                            <Link
                              to="#"
                              className="btn btn-primary doctor-refresh ms-2"
                              onClick={() => window.location.reload()}
                            >
                              <img src={refreshicon} alt="#" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <Table
                    columns={columns}
                    dataSource={filteredParticipants}
                    rowKey="id"
                  />
                  {isModalOpen && (
                    <Modal
                      title="Participant Details"
                      open={isModalOpen}
                      onOk={handleOk}
                      onCancel={handleCancel}
                      footer={[
                        <Button key="close" onClick={handleCancel}>
                          Close
                        </Button>,
                        <Button key="ok" onClick={handleOk} type="primary">
                          OK
                        </Button>,
                      ]}
                    >
                      <p>
                        <strong>First Name:</strong>{" "}
                        {selectedParticipant.firstName}
                      </p>
                      <p>
                        <strong>Last Name:</strong>{" "}
                        {selectedParticipant.lastName}
                      </p>
                      <p>
                        <strong>Email:</strong> {selectedParticipant.email}
                      </p>
                      <p>
                        <strong>Persons:</strong> {selectedParticipant.persons}
                      </p>
                      <p>
                        <strong>Name of Participants:</strong>{" "}
                        {selectedParticipant.personNames}
                      </p>
                      <p>
                        <strong>Owner Address:</strong>{" "}
                        {selectedParticipant.address}
                      </p>
                      <p>
                        <strong>Gender:</strong> {selectedParticipant.gender}
                      </p>{" "}
                      {/* Display Gender here */}
                    </Modal>
                  )}

                  <div
                    className={
                      isDeleteModalOpen
                        ? "modal fade show delete-modal"
                        : "modal fade delete-modal"
                    }
                    style={{
                      display: isDeleteModalOpen ? "block" : "none",
                      backgroundColor: "rgba(0,0,0,0.5)",
                    }}
                    role="dialog"
                  >
                    <div className="modal-dialog modal-dialog-centered">
                      <div className="modal-content">
                        <div className="modal-body text-center">
                          <img src={imagesend} alt="#" width={50} height={46} />
                          <h3>Are you sure want to delete this participant?</h3>
                          <div className="m-t-20">
                            <Button
                              onClick={() => setIsDeleteModalOpen(false)}
                              className="btn btn-white me-2"
                            >
                              Close
                            </Button>
                            <Button
                              type="button"
                              className="btn btn-danger"
                              onClick={() => handleDelete(participentToDele)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ParticipantList;
