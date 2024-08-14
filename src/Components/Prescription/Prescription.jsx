import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { handleAPIRequest } from "../../helper/ApiHandler";

const Prescription = ({ navigation }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSelectedTime, setIsSelectedTime] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [medicine, setMedicines] = useState([]);

  const location = useLocation();
  const { appointment } = location.state;

  const [medication, setMedication] = useState({
    name: "",
    mg: "",
    duration: "",
    time: "",
    whentotake: "",
    note: "",
  });

  const optionsForMg = [
    "100mg",
    "200mg",
    "300mg",
    "400mg",
    "500mg",
    "600mg",
    "700mg",
    "800mg",
    "900mg",
    "1000mg",
  ];

  const optionsForDuration = [
    "1 Day",
    "2 Days",
    "3 Days",
    "4 Days",
    "5 Days",
    "6 Days",
    "1 Week",
    "2 Week",
    "3 Week",
    "1 Month",
    "2 Month",
    "3 Month",
    "4 Month",
    "5 Month",
    "6 Month",
  ];

  const data = ["Morning", "Noon", "Evening", "Night"];

  const handlePress = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((i) => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const getMedicines = () => {
    handleAPIRequest("get", "get-medicine", null).then((response) => {
      console.log(response);

      if (response?.data) {
        setMedicines(response.data);
      }
    });
  };

  useEffect(() => {
    getAllPres();
    getMedicines();
  }, []);

  const getAllPres = () => {
    setLoading(true);
    handleAPIRequest("get", `get-prescription/${appointment?.id}`)
      .then((res) => {
        if (res?.data) {
          setPrescriptions(
            res?.data?.map((item) => ({
              name: item?.name,
              mg: item?.mg,
              duration: item?.duration,
              time: item?.medication?.split(","),
              whentotake: item?.tobetaken,
              note: item?.note,
              fromServer: true,
            }))
          );
        }

        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const sendToServer = () => {
    setLoading(true);

    handleAPIRequest("post", "add-prescription", {
      doctor_id: appointment?.doctor_id,
      patient_id: appointment?.patient_id,
      appointment_id: appointment?.id,
      name: prescriptions.map((item) => item.name),
      mg: prescriptions.map((item) => item.mg),
      duration: prescriptions.map((item) => item.duration),
      tobetaken: prescriptions.map((item) => item.whentotake),
      note: prescriptions.map((item) => item.note),
      medication: prescriptions.map((item) => item.time.toString()),
    })
      .then((res) => {
        setLoading(false);

        console.log(res);
      })
      .catch((e) => {
        setLoading(false);

        console.log(e);
      });
  };

  const handleCreateOrUpdate = () => {
    const newPrescription = {
      ...medication,
      time: selectedItems,
      whentotake: isSelectedTime,
    };

    if (editingIndex !== null) {
      const updatedPrescriptions = [...prescriptions];
      updatedPrescriptions[editingIndex] = newPrescription;
      setPrescriptions(updatedPrescriptions);
      setEditingIndex(null);
    } else {
      setPrescriptions([...prescriptions, newPrescription]);
    }

    console.log(prescriptions, "faraz");

    setMedication({
      name: "",
      mg: "",
      duration: "",
      time: "",
      whentotake: "",
      note: "",
    });
    setSelectedItems([]);
    setIsSelectedTime(null);
  };

  const handleEdit = (index) => {
    const prescription = prescriptions[index];
    setMedication(prescription);
    setSelectedItems(prescription.time);
    setIsSelectedTime(prescription.whentotake);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const updatedPrescriptions = prescriptions.filter((_, i) => i !== index);
    setPrescriptions(updatedPrescriptions);
  };

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  console.log(JSON.stringify(prescriptions), "mapmapmap");
  return (
    <div className="flex flex-wrap justify-center">
      <div className="w-full md:w-1/3 p-4">
        <h1 className="text-xl font-bold mb-4">Prescriptions List</h1>
        {prescriptions.length > 0 ? (
          <ul>
            {prescriptions.map((prescription, index) => (
              <li key={index} className="mb-2 border p-2 rounded relative">
                <button
                  className="absolute top-2 right-2 text-red-600"
                  onClick={() => handleDelete(index)}
                >
                  ✕
                </button>
                <div
                  onClick={() => handleEdit(index)}
                  className="cursor-pointer"
                >
                  <strong>Medicine:</strong> {prescription.name},{" "}
                  {prescription.mg} <br />
                  <strong>Duration:</strong> {prescription.duration} <br />
                  <strong>Time:</strong> {prescription.time.join(", ")} <br />
                  <strong>When to take:</strong> {prescription.whentotake}{" "}
                  <br />
                  <strong>Note:</strong> {prescription.note}
                </div>
              </li>
            ))}

            <button
              className="p-2 bg-green-600 text-white rounded"
              onClick={sendToServer}
            >
              {"Update List"}
            </button>
          </ul>
        ) : (
          <p>No prescriptions added yet</p>
        )}
      </div>
      <div className="w-full md:w-1/2 p-4">
        <h1 className="text-xl font-bold mb-4">Prescription</h1>
        <div className="mb-4">
          <label className="block mb-2">Medicine Name</label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={medication.name}
            onChange={(e) =>
              setMedication({ ...medication, name: e.target.value })
            }
          >
            <option value="">Select Medicine</option>
            {medicine.map((option, index) => (
              <option key={index} value={option.name}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Mg</label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={medication.mg}
            onChange={(e) =>
              setMedication({ ...medication, mg: e.target.value })
            }
          >
            <option>Select Mg</option>
            {optionsForMg.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Duration</label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={medication.duration}
            onChange={(e) =>
              setMedication({ ...medication, duration: e.target.value })
            }
          >
            <option>Select Duration</option>
            {optionsForDuration.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Medication Time</label>
          <div className="flex space-x-2 flex-wrap">
            {data.map((item, index) => (
              <button
                key={index}
                onClick={() => handlePress(item)}
                className={`p-2 rounded ${
                  selectedItems.includes(item)
                    ? "bg-green-600 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-2">To be Taken</label>
          <div className="flex space-x-2">
            {["After Food", "Before Food"].map((item, index) => (
              <button
                key={index}
                onClick={() => setIsSelectedTime(item)}
                className={`p-2 rounded ${
                  isSelectedTime === item
                    ? "bg-green-600 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Important Note</label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded"
            value={medication.note}
            onChange={(e) =>
              setMedication({ ...medication, note: e.target.value })
            }
          />
        </div>
        <div className="flex space-x-2">
          {editingIndex === null && (
            <button
              className="p-2 bg-white border border-gray-300 rounded"
              onClick={() =>
                setMedication({
                  name: "",
                  mg: "",
                  duration: "",
                  time: "",
                  whentotake: "",
                  note: "",
                })
              }
            >
              Another Medicine
            </button>
          )}
          <button
            className="p-2 bg-[#524494] text-white rounded"
            onClick={handleCreateOrUpdate}
          >
            {editingIndex !== null ? "Update" : "Create"}
          </button>
        </div>
        {loading && <div className="loader">Loading...</div>}
      </div>
    </div>
  );
};

export default Prescription;
