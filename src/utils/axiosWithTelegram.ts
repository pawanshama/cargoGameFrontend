// src/utils/axiosWithTelegram.ts
import axios from "axios";

export const axiosWithTelegram = () => {
  const initData = window.Telegram?.WebApp?.initData;

  if (!initData) {
    throw new Error("❌ initData Telegram introuvable");
  }

  return axios.create({
    baseURL: "https://e780-2402-e280-230d-3ff-f9e1-6449-ba90-46df.ngrok-free.app/api",
    headers: {
      Authorization: `tma ${initData}`,
    },
  });
};
