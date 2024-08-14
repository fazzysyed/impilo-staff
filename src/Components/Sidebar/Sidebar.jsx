import React, { useState } from "react";
import "./Sidebar.css";
import FilterIcon from "../../assets/images/filter-solid.png";

import Slider from "@mui/material/Slider";
import CommonPrimaryButton from "../CommonPrimaryButton";
import { getAllPros } from "../../Store/Actions/Actions";
import { handleAPIRequest } from "../../helper/ApiHandler";
import { useDispatch } from "react-redux";

export default function Sidebar({
  data,
  filteredData,
  setFilteredData,
  zipCodeUser,
  licenseTypes,
}) {
  const [value, setValue] = useState([20, 37]);
  const [filter, setFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [listOpen, setListOpen] = useState(false); // State to control list open/closed

  const licenses = data
    ?.flatMap((item) => item?.licenses || [])
    .filter(
      (license, index, self) =>
        index === self.findIndex((l) => l && l.id === license.id)
    );

  const [filterConditions, setFilterConditions] = useState({
    // You can store selected tags here
    license: "", // You can store selected licenses here
    searchBase: zipCodeUser, // You can store selected
    rateBase: "", // You can store selected
  });

  const filterData = (reset) => {
    if (reset) {
      setSearchTerm("");
      handleAPIRequest("get", "pros", null, {
        filters: {
          license: "",
          zip: zipCodeUser,
          rateType: "",
          rate: "",
        },
      })
        .then((response) => {
          if (response) {
            dispatch(getAllPros(response));
            setFilteredData(response);
            setLoading(false);
          }
        })
        .catch((e) => {
          setLoading(false);
        });
      setFilterConditions((prevFilterConditions) => {
        return {
          ...prevFilterConditions,
          license: [],
          searchBase: "",
        };
      });
      setValue([0, 0]);

      return;
    }
    setFilter(true);

    handleAPIRequest("get", "pros", null, {
      filters: {
        license: filterConditions.license
          ? Number(filterConditions.license.id)
          : "",
        zip: zipCodeUser,
        rateType: "",
        rate: "",
      },
    })
      .then((response) => {
        if (response) {
          dispatch(getAllPros(response));
          setFilteredData(response);
          setFilter(false);
        }
      })
      .catch((e) => {
        setFilter(false);
      });
  };

  function valuetext(value) {
    return `${value}°C`;
  }

  const handleChangeRate = (e) => {
    setFilterConditions((prevFilterConditions) => {
      return {
        ...prevFilterConditions,
        rateBase: !e.target.checked,
      };
    });

    // ({
    //   ...filterConditions,
    //   rateBase: e.target.checked == true ? "hourly_rate" : "daily_rate",
    // });
  };

  const filteredLicenseTypes = searchTerm.length
    ? licenseTypes.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="w-full md:w-[250px] 2xl:min-w-[330px]">
      <div className="flex md:pb-3 items-center gap-2 pb-3">
        <img className="w-4 h-4" src={FilterIcon} alt="filter icon" />
        <p className=" text-lg">Filters</p>
      </div>

      <div className="border-b"></div>

      <div className="pt-4 md:pt-8">
        <p className="text-lg pb-2">Zip Code</p>
        <input
          className="text-lg placeholder-[#B8C0CB] text-neutral-800 py-3 px-4 border border-[#C2C9D4] rounded w-full"
          label="nickname"
          variant="outlined"
          placeholder="Enter Zip Code here..."
          value={filterConditions.searchBase}
          onChange={(e) => {
            setFilterConditions({
              ...filterConditions,
              searchBase: e.target.value,
            });
          }}
        />
      </div>

      <div className="pt-4 md:pt-8">
        <p className="text-lg pb-2">License Type</p>

        <div className="w-full">
          <input
            type="text"
            className="text-lg placeholder-[#B8C0CB] text-neutral-800 py-3 px-4 border border-[#C2C9D4] rounded w-full"
            placeholder="Search license types"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setListOpen(true); // Open the list when typing
            }}
          />
          {listOpen && ( // Render the list only if it's open
            <ul className="max-h-64 overflow-y-auto divide-y divide-gray-200">
              {filteredLicenseTypes.map((item, index) => (
                <li
                  key={index}
                  className={`p-4 cursor-pointer hover:bg-gray-100 ${
                    filterConditions.license === item
                      ? "bg-gray-100"
                      : "bg-white"
                  }`}
                  onClick={() => {
                    setSearchTerm(item.name);
                    setFilterConditions({ ...filterConditions, license: item });
                    setListOpen(false); // Close the list when an item is selected
                  }}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* <div className="flex items-center gap-2">
          <label className="switch">
            <input type="checkbox" onChange={(e) => handleChangeRate(e)} />
            <span className="slider"></span>
          </label>
          <p className="text-lg">
            {filterConditions.rateBase ? "Hourly" : "Daily"} Rate
          </p>
        </div> */}
      {/* <Slider
          getAriaLabel={() => "Temperature range"}
          value={value}
          onChange={handleChange}
          valueLabelDisplay="auto"
          getAriaValueText={valuetext}
          sx={{
            width: "90%",
            marginTop: "20px",
            "& .MuiSlider-thumb": {
              borderRadius: "4px",
            },
          }}
        /> */}

      <div className="pt-4 flex gap-4 justify-center md:justify-end md:pt-8">
        <CommonPrimaryButton
          onClick={() => filterData(true)}
          loading={loading}
          text={"Clear Filters"}
        />
        <CommonPrimaryButton
          onClick={() => filterData()}
          loading={filter}
          text={"Apply Filters"}
        />
      </div>
    </div>
  );
}
