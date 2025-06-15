import { useNavigate } from "react-router-dom";
import LogoBig from "../../assets/images/logoBig.png";
import AlternateButton from "../common/AlternateButton";

const Congratulations = () => {
  const navigate = useNavigate();
  return (
      <div className="w-full bet-bg h-[100dvh]">
        <div className="flex items-center justify-center h-full flex-col px-2 max-w-[350px] w-full mx-auto">
          <img src={LogoBig} alt="logo" loading="lazy" className="w-[19rem] h-[19rem]" />
          <h2 className="h2 text-center text-textColor mb-8">
            congratulations! you won{" "}
            <span className="text-primary">40 free bets!</span>
          </h2>
          <AlternateButton handleButtonClick={() => navigate("/bet")} />
        </div>
      </div>
  );
};

export default Congratulations;
