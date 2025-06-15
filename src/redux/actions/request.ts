import axios from "axios";

export const postRequest = async (
  URL: string,
  body: any,
  requireToken: boolean = true
) => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  if (!baseUrl) {
    throw new Error("VITE_BACKEND_URL is not defined");
  }

  const Url = `${baseUrl}/${URL}`;

  try {
    const headers: { [key: string]: string } = {};

    if (requireToken) {
      const token = localStorage.getItem("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }
    const response = await axios.post(Url, body, { headers });
    return response.data;
  } catch (err) {
    console.error("postRequest error:", err);
    throw err;
  }
};
