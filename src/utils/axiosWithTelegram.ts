// src/utils/axiosWithTelegram.ts
import axios from "axios";

export const axiosWithTelegram = () => {
  const initData = window.Telegram?.WebApp?.initData;

  if (!initData) {
    throw new Error("❌ initData Telegram introuvable");
  }

  return axios.create({
    baseURL: "https://ae0e-2402-e280-230d-3ff-945-fd4e-1470-53f8.ngrok-free.app/api",
    headers: {
      Authorization: `tma ${initData}`,
    },
  });
};
