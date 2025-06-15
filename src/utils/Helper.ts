import CryptoJS from "crypto-js";

const encryptionKey =
  "c0fd2fb6fda9c94cde1cb9bfd7762e8eef5dbd2a32ec3f6e374d397639f2b8a4";

// Ensure the encryption key is 32 bytes
if (encryptionKey.length !== 64) {
  console.log("Encryption key Error: " + encryptionKey);
  throw new Error("Encryption key must be a 64-character hexadecimal string.");
}

const encryptData = (data: any) => {
  const iv = CryptoJS.lib.WordArray.random(16); // generate a new IV for each encryption
  const encrypted = CryptoJS.AES.encrypt(
    data,
    CryptoJS.enc.Hex.parse(encryptionKey),
    {
      iv: iv,
      mode: CryptoJS.mode.CTR,
      padding: CryptoJS.pad.NoPadding,
    }
  );
  return `${iv.toString()}:${encrypted.toString()}`;
};

const decryptData = (data: string) => {
  const [ivHex, encryptedData] = data.split(":");
  const iv = CryptoJS.enc.Hex.parse(ivHex);
  const decrypted = CryptoJS.AES.decrypt(
    encryptedData,
    CryptoJS.enc.Hex.parse(encryptionKey),
    {
      iv: iv,
      mode: CryptoJS.mode.CTR,
      padding: CryptoJS.pad.NoPadding,
    }
  );
  return decrypted.toString(CryptoJS.enc.Utf8);
};

const urlEncodedData = (data: string) => {
  const params = new URLSearchParams(data);
  // Extract the user data and decode it
  const userDataEncoded = params.get("user");
  // @ts-ignore
  const userDataDecoded = decodeURIComponent(userDataEncoded);
  // Parse the JSON string
  const userData = JSON.parse(userDataDecoded);
  return userData;
};

const validateFullName = (value: string) => {
  if (!value.trim()) {
    return {
      isValid: false,
      message: "Value cannot be empty or contain only spaces",
    };
  } else if (/[^a-zA-Z ']/.test(value)) {
    return {
      isValid: false,
      message: "Value cannot contain special characters or numbers",
    };
  } else if ((value.match(/'/g) || []).length > 1) {
    return {
      isValid: false,
      message: "Value can contain only one ' character",
    };
  } else if (value.length > 30) {
    return {
      isValid: false,
      message: "Value cannot be less than 30 characters.",
    };
  } else if (value.trim() !== value) {
    return {
      isValid: false,
      message: "Value cannot start or end with spaces",
    };
  }

  return {
    isValid: true,
    message: "Name is valid",
  };
};

const validatePhoneNumber = (value: any) => {
  if (!value.trim()) {
    return "Phone number cannot be empty or contain only spaces";
  } else if (value.length < 3 || value.length > 15) {
    return "Phone number cannot be more than 15 characters.";
  } else if (value.trim() !== value) {
    return "Phone number cannot start or end with spaces";
  } else if (/\s/.test(value)) {
    return "Phone number cannot contain spaces";
  }

  const phoneRegex = /^\d{3,15}$/;
  if (!phoneRegex.test(value)) {
    return "Phone number must contain only digits";
  }

  return null; // Indicates valid phone number
};
export {
  urlEncodedData,
  validateFullName,
  validatePhoneNumber,
  encryptData,
  decryptData,
};
