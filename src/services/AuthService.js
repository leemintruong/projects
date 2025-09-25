import axios from "axios";

axios.defaults.withCredentials = true;

export const signin = async (email, password) => {
  const { data } = await axios.post("http://localhost:5000/api/auth/signin", { email, password });
  return data.user;
};

export const signup = async (fullName, email, password, role) => {
  const { data } = await axios.post("http://localhost:5000/api/auth/signup", { fullName, email, password, role });
  return data.user;
};

export const signout = async () => {
  await axios.post("http://localhost:5000/api/auth/signout");
};

export const getMe = async () => {
  try {
    const { data } = await axios.get("http://localhost:5000/api/auth/me");
    return data.user;
  } catch {
    return null;
  }
};
