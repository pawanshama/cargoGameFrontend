import { CloseIcon, UserIcon } from "../../assets/iconset";
import CustomInput from "../common/Input";
import Button from "../common/Button";

interface EditProfileNameProps {
  isEditProfileName: boolean;
  setIsEditProfileName: (value: boolean) => void;
}

const EditProfileName: React.FC<EditProfileNameProps> = ({
  isEditProfileName,
  setIsEditProfileName,
}) => {
  const handleClose = () => {
    setIsEditProfileName(!isEditProfileName);
  };

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 z-10 flex flex-col justify-between rounded-t-[10px] shadow-[0px_0px_100px_0px_rgba(0,,0,0.05)] backdrop-blur-[1.5625rem] bg-black/[0.6] h-[100dvh] w-full max-w-[640px]">
      <div className="absolute top-3 right-4">
        <button
          type="button"
          onClick={handleClose}
          className="h-[1.875rem] w-[1.875rem] bg-transparent"
        >
          <CloseIcon />
        </button>
      </div>
      <div className="flex flex-col justify-between flex-1 w-full pt-[2.625rem] pb-8 px-5 gap-4">
        <div className="flex flex-col items-center justify-center gap-8 w-full">
          <h1 className="text-center text-white h1">My Account</h1>
          <CustomInput
            label="Display Name"
            inputIcon={<UserIcon />}
            type="text"
            name="display-name"
            placeholder="Enter your name"
            helpText="This name is not valid, choose another name."
          />
        </div>
        <div className="flex items-center flex-col justify-center">
          <Button
            label="Update"
            handleButtonClick={() => handleClose}
            type="button"
            disabled
          />
        </div>
      </div>
    </div>
  );
};

export default EditProfileName;
