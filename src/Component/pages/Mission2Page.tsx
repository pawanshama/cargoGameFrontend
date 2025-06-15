import Header from "../includes/Header";
import Footer from "../includes/Footer";
import Button from "../common/Button";
import CustomInput from "../common/Input";

const Mission2Page = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#160028] to-[#2b1048] text-white pb-28">
      <Header pageHeading={<span className="text-[22px] font-bold text-white">MISSION 2: INVITE YOUR FRIENDS AND GET UP TO 150$</span>} />

      <div className="px-4 text-center">
        <p className="text-sm text-white opacity-80 mt-2">
          Invite friends and earn cashback on your bets and their bets!
        </p>

        <img
          src="/assets/handshake.png"
          alt="Handshake"
          className="w-[120px] h-[120px] mx-auto my-6"
        />

        <p className="text-[17px] font-bold text-white">
          <span className="text-[#00FFB2]">INVITE</span> FRIENDS NOW!
        </p>

        <div className="mt-6 border border-[#a855f7] rounded-xl px-4 py-5 text-left flex flex-col gap-3">
          <p className="text-sm font-lato">
            <span className="inline-flex items-center gap-2">
              <img src="/assets/humansicon.png" alt="invite" className="w-4 h-4" />
              Invite friends to <span className="font-designer">CORGINSPACE</span>
            </span>
            <span className="float-right font-bold text-white">0/3</span>
          </p>

          <div className="flex items-center gap-2">
            <CustomInput
              type="text"
              value="https://dfjkzfnbkjzbf/..."
              name="invite-url"
              disabled
              copy
            />
            <Button label="Invite" type="button" small handleButtonClick={() => {}} />
          </div>
        </div>
      </div>

      <div className="mt-10 px-4">
        <div className="border border-[#a855f7] rounded-xl p-4">
          <h3 className="font-bold text-white text-lg mb-2">STEP 1</h3>
          <p className="text-sm text-white opacity-80">
            Once your friends sign up, you become eligible for cashback.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Mission2Page;
