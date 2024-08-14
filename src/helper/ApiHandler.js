import axios from "axios";
// import { BASE_URL } from "../Api/BaseUrl";
import { setAppLoading } from "../Store/Actions/Actions";
import store from "../Store/Store";

const BASE_URL = "https://brightspace.health/api/";

export const handleAPIRequest = async (method, url, data, params, base) => {
  const state = store.getState();
  const token = localStorage.getItem("token");
  // store.dispatch(setAppLoading(true));

  let header = null;

  if (method === "post" || method === "put") {
    header = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${state?.user?.token}`,
      // Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NzBmYzQzZS0zNjdlLTQ5YzMtYTIzNS02ZGU4MjAxY2QxMmMiLCJqdGkiOiIxYjBkNjg4NWMwNzRlNDNjNzdiZGYwMjE2Mjk3NWU1NzlhMGVmMDBjNzM0NzczYmVlMWI0NzQyMTRlMTdmMmNhN2QxMGIyMDI2MjliMDJkMyIsImlhdCI6MTcxNDQxMjU3My44NzkzNDQ5NDAxODU1NDY4NzUsIm5iZiI6MTcxNDQxMjU3My44NzkzNDcwODU5NTI3NTg3ODkwNjI1LCJleHAiOjE3NDU5NDg1NzMuODc2NDQxOTU1NTY2NDA2MjUsInN1YiI6IjE2MyIsInNjb3BlcyI6W119.xhJ9W0i7igB59wzvhcA9M7C9L12NFgp4xy5WT8UdU9vVtl8j89aUBT4dWPppXaMitGwE9FCM2BKW6rFbZTE53oY8ZXb5CItVD-_20HCKiY6R3BYSEsGXKcD4TgZJ_6eNwQxDdn78aLMWEIii5wfnJd4mNm2BZFNiaByMjAFqnlr_HlhzU0AMKqG1srHzH9zNvFlHzjXmivULvqclmyHi2SaRWH-x9qfg6oUYLJknAzRQSG5iJsv5pxVeHtC1vrjwppPcjNvCSKrzDsZB8wWNpRloY-zbIazKUcrP6hqyRW4lHa9eK1ifYYW_jqUgDVyHq5z5dfhYwkBY-ErolyPbOzOD0JVBz8Aw2arvW_Az4rkn1T4u3io6W2bTD3AXBlJ4dSaK72eQWjA-HWcsoJMGqd-4Ox9pZ7-7KHAAYs1v5Hi_e47ihIgQ525Ez3Cz7rlSw7E9h6FaA0Y-rEifx_rvESk8PO6QQJWgyJAdpJLQN9q-GqY7vLwdwhlrOhnCiH8dHGOrUxJgLjK4yGuOt3LGrfw0RdKQnasrnVUAuziJlafcqn_Xy4PjSDRSl0BkAk6zo0dcYPQQKX2Kf1ioZ7AmzgBXsXAinyh3WXljn1O-m8LlFHm727JbJUXrtGnr9-s6VM2RWekt5iaSim0Z09mMBOMm6zxQEPVFNUMEFRixVlA`,
    };
  } else {
    header = {
      Authorization: `Bearer ${state?.user?.token}`,
      // Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NzBmYzQzZS0zNjdlLTQ5YzMtYTIzNS02ZGU4MjAxY2QxMmMiLCJqdGkiOiIxYjBkNjg4NWMwNzRlNDNjNzdiZGYwMjE2Mjk3NWU1NzlhMGVmMDBjNzM0NzczYmVlMWI0NzQyMTRlMTdmMmNhN2QxMGIyMDI2MjliMDJkMyIsImlhdCI6MTcxNDQxMjU3My44NzkzNDQ5NDAxODU1NDY4NzUsIm5iZiI6MTcxNDQxMjU3My44NzkzNDcwODU5NTI3NTg3ODkwNjI1LCJleHAiOjE3NDU5NDg1NzMuODc2NDQxOTU1NTY2NDA2MjUsInN1YiI6IjE2MyIsInNjb3BlcyI6W119.xhJ9W0i7igB59wzvhcA9M7C9L12NFgp4xy5WT8UdU9vVtl8j89aUBT4dWPppXaMitGwE9FCM2BKW6rFbZTE53oY8ZXb5CItVD-_20HCKiY6R3BYSEsGXKcD4TgZJ_6eNwQxDdn78aLMWEIii5wfnJd4mNm2BZFNiaByMjAFqnlr_HlhzU0AMKqG1srHzH9zNvFlHzjXmivULvqclmyHi2SaRWH-x9qfg6oUYLJknAzRQSG5iJsv5pxVeHtC1vrjwppPcjNvCSKrzDsZB8wWNpRloY-zbIazKUcrP6hqyRW4lHa9eK1ifYYW_jqUgDVyHq5z5dfhYwkBY-ErolyPbOzOD0JVBz8Aw2arvW_Az4rkn1T4u3io6W2bTD3AXBlJ4dSaK72eQWjA-HWcsoJMGqd-4Ox9pZ7-7KHAAYs1v5Hi_e47ihIgQ525Ez3Cz7rlSw7E9h6FaA0Y-rEifx_rvESk8PO6QQJWgyJAdpJLQN9q-GqY7vLwdwhlrOhnCiH8dHGOrUxJgLjK4yGuOt3LGrfw0RdKQnasrnVUAuziJlafcqn_Xy4PjSDRSl0BkAk6zo0dcYPQQKX2Kf1ioZ7AmzgBXsXAinyh3WXljn1O-m8LlFHm727JbJUXrtGnr9-s6VM2RWekt5iaSim0Z09mMBOMm6zxQEPVFNUMEFRixVlA`,
    };
  }
  try {
    const response = await axios({
      method: method,
      url: base ? base : `${BASE_URL}${url}`,
      headers: header,
      data: data,
      params: params,
    });

    // store.dispatch(setAppLoading(false));
    return response.data;
  } catch (error) {
    console.error(error);
    // store.dispatch(setAppLoading(false));

    throw new Error(error);
  }
};
