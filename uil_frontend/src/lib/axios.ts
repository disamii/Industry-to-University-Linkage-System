import axios from "axios";

const apiProxy = axios.create({
  baseURL: `/api`,
  withCredentials: true,
});

export default apiProxy;
