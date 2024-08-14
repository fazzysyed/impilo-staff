import axios from "axios";
import { BASE_URL } from "./BaseUrl";
import { REGISTER } from "./EndPoints";

export const POST = (data, endPoint, method) => {
  const token = localStorage.getItem("token");
  return new Promise((resolve, reject) => {
    var config = {
      method: method,
      url: `${BASE_URL}${endPoint}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.stringify(JSON.parse(token))}`,
      },
      data: JSON.stringify(data),
    };

    axios(config)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
