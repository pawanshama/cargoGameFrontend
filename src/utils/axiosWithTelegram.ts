// src/utils/axiosWithTelegram.ts
import axios from "axios";

export const axiosWithTelegram = () => {
  const initData = window.Telegram?.WebApp?.initData;

  if (!initData) {
    throw new Error("❌ initData Telegram introuvable");
  }

  return axios.create({
    baseURL: "https://corgi-in-space-backend-production.up.railway.app/api",
    headers: {
      Authorization: `tma ${initData}`,
    },
  });
};
