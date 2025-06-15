import Header from "../includes/Header";
import Footer from "../includes/Footer";

const Mission1Page = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#160028] to-[#2b1048] text-white pb-28">
      <Header pageHeading={<span className="text-[22px] font-bold text-white">MISSION 1: DOUBLE YOUR FIRST DEPOSIT!</span>} />

      <div className="px-4 text-center">
        <p className="text-sm text-white opacity-80 mt-2">
          Deposit your first amount and get the same amount in free bets! Achieve milestones to unlock your rewards.
        </p>

        <img
          src="/assets/missOutBag.png"
          alt="missOutBag"
          className="w-[120px] h-[120px] mx-auto my-6"
        />

        <p className="text-[17px] font-bold text-white font-lato">
          <span className="text-white">DOUBLE THE FUN,</span><br />
          <span className="text-[#00FFB2]">DOUBLE THE REWARDS!</span>
        </p>

        <button className="mt-6 bg-gradient-to-r from-[#00FFB2] to-[#00D68F] text-black font-bold font-designer px-6 py-3 rounded-full active:scale-95 transition">
          MAKE FIRST DEPOSIT
        </button>
      </div>

      <div className="mt-10 px-4">
        <div className="border border-[#a855f7] rounded-xl p-4">
          <h3 className="font-bold text-white text-lg mb-2">STEP 1</h3>
          <p className="text-sm text-white opacity-80">
            Deposit your first amount. For example, deposit $100.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Mission1Page;