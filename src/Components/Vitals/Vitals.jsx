import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { handleAPIRequest } from "../../helper/ApiHandler";

// Modal component using Tailwind CSS for styling
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
      <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-3xl w-full z-50">
        <div className="flex justify-between items-center bg-gray-200 px-4 py-2">
          <h2 className="text-xl font-bold">Add Vitals</h2>
          <button className="text-red-500 hover:text-red-700" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

const AppButton = ({ title, onClick, ...rest }) => (
  <button
    onClick={onClick}
    className="bg-[#524494]  hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
    {...rest}
  >
    {title}
  </button>
);

const Layout = ({ title, children }) => (
  <div className="container mx-auto mt-4 p-4 bg-white rounded">
    <h1 className="text-2xl font-bold mb-4">{title}</h1>
    {children.length === 0 ? (
      <p className="text-gray-500 text-center">No vitals added yet.</p>
    ) : (
      children
    )}
  </div>
);

const HealthVitals = ({ route }) => {
  const location = useLocation();
  const { appointment } = location?.state; // Adjust how route.params are accessed based on your routing setup
  const [openAddModal, setOpenAddModal] = useState(false);
  const [appointmentVitals, setAppointmentVitals] = useState([]);
  const [serverAppointmentVitals, setServerAppointmentVitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vitals, setVitals] = useState([]);
  const [vital, setVital] = useState({
    name: "",
    id: "",
    value: "",
    comment: "",
  });

  const userData = useSelector((state) => state.user); // Replace with your actual selector logic

  const fetchData = async () => {
    console.log(appointment);
    try {
      setLoading(true);
      const { data } = await handleAPIRequest(
        "get",
        `get-vitals-by/${appointment.id}`,
        null,
        null
      );

      console.log(data, "TestingFaraz");

      setServerAppointmentVitals(
        data.map((item) => ({
          comment: item?.comments,
          value: item?.value,
          name: item?.get_medical?.name,
          isServer: true,
          id: item?.id,
        }))
      );
      setLoading(false);
    } catch (error) {
      console.error(error.message);
      setLoading(false);
    }
  };

  const fetchVitals = async () => {
    try {
      const response = await handleAPIRequest(
        "get",
        `get-vital-list`,
        null,
        null
      );

      if (response.data) {
        console.log(response.data, "ffafrfafzf");
        setVitals(response.data);
      } else {
        console.log("No data assigned");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchData();
    fetchVitals();
  }, []);

  const toggleAddModal = () => {
    setOpenAddModal(!openAddModal);
  };

  const handleVitalAdd = async () => {
    if (!vital.name || !vital.value) {
      console.log("All fields required.");
      return;
    }

    let newArray = [...appointmentVitals];

    const isDuplicate = newArray.some(
      (item) => Number(item.id) === Number(vital.id)
    );

    if (!isDuplicate) {
      newArray.push(vital);
      setAppointmentVitals(newArray);

      setVital({
        name: "",
        value: "",
        id: "",
        comment: "",
      });

      toggleAddModal();
    } else {
      console.log("Duplicate vital detected. Not adding to the list.");
      // Optionally, show an alert or toast message here
    }
  };

  const updateVitals = async () => {
    setLoading(true);
    let data = {
      doctor_id: appointment.doctor_id,
      patient_id: appointment.patient_id,
      type: "vitals",
      appointmentId: appointment.id,
      symptoms: "testing",
      medical_id: appointmentVitals.map((item) => item.id),
      value: appointmentVitals.map((item) => item.value),
      unit: ["as", "DB", "as"], // Adjust as per your data structure
      description: appointmentVitals.map((item) => item.comment), // Correct typo here
      comments: appointmentVitals.map((item) => item.comment),
    };

    console.log(data);

    handleAPIRequest("post", "add-vital-record", data)
      .then((res) => {
        console.log(JSON.stringify(res));
        setLoading(false);
      })
      .catch((e) => setLoading(false));
  };

  return (
    <>
      <Layout title="Health Vitals">
        {!loading && (
          <div className="mb-12">
            {serverAppointmentVitals.length || appointmentVitals.length ? (
              <div className="space-y-6">
                {serverAppointmentVitals
                  .concat(appointmentVitals)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-300 rounded-md p-4 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-bold mb-2">{item.name}</p>
                        <p className="text-gray-700">{item.value}</p>
                      </div>
                      <button
                        onClick={() => {
                          if (item.isServer) {
                            setLoading(true);
                            // Example API request, replace with your own logic
                            fetch(`delete-vitals/${item.id}`, {
                              method: "DELETE",
                            })
                              .then((response) => response.json())
                              .then(() => {
                                let newArray = [...serverAppointmentVitals];
                                setServerAppointmentVitals(
                                  newArray.filter((vit) => vit.id !== item.id)
                                );
                                setLoading(false);
                              })
                              .catch((error) => {
                                console.error("Error deleting vital:", error);
                                setLoading(false);
                              });
                          } else {
                            let newArray = [...appointmentVitals];
                            setAppointmentVitals(
                              newArray.filter((vit) => vit.name !== item.name)
                            );
                          }
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                  ))}
                <div className="text-center">
                  <AppButton title="Update" onClick={updateVitals} />
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center">No vitals added yet.</p>
            )}
          </div>
        )}
      </Layout>

      {!loading && (
        <button
          className="bg-[#524494]  hover:bg-[#524494]  text-white font-bold py-2 px-4 rounded-full fixed bottom-8 right-8"
          onClick={toggleAddModal}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      )}

      {/* Modal for adding vitals */}
      <Modal isOpen={openAddModal} onClose={toggleAddModal}>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Vital</label>
          <select
            className="border border-gray-300 rounded-md p-2 w-full"
            value={vital.name}
            onChange={(e) =>
              setVital({
                ...vital,
                name: e.target.value,
                id: vitals.filter((item) => item.name === e.target.value)[0]
                  ?.id,
              })
            }
          >
            <option value="" disabled selected>
              Select a vital
            </option>
            {vitals?.map((item) => (
              <option key={item.value} value={item.value}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Value</label>
          <input
            type="text"
            className="border border-gray-300 rounded-md p-2 w-full"
            value={vital.value}
            onChange={(e) => setVital({ ...vital, value: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Comment</label>
          <textarea
            className="border border-gray-300 rounded-md p-2 w-full"
            value={vital.comment}
            onChange={(e) => setVital({ ...vital, comment: e.target.value })}
          ></textarea>
        </div>
        <div className="text-center">
          <AppButton title="Add" onClick={handleVitalAdd} />
        </div>
      </Modal>
    </>
  );
};

export default HealthVitals;
