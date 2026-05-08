import React, { useEffect, useState } from "react";
import Loading from "./Loading.jsx";
import { useAppContext } from "../context/useContext";
import toast from "react-hot-toast";

const Credits = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { axios, token ,currancy} = useAppContext();

  const fetchPlans = async () => {
    try {
      const { data } = await axios.get("/api/credits/plan");
      if (data.success) {
        setPlans(data.plans);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const creditPurchase = async (planId) => {
    try {
      const { data } = await axios.post(
        "/api/credits/purchase",
        { planId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        window.location.href = data.url;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  if (loading) return <Loading />;
  return (
    <div className="w-full min-w-0 px-4 sm:px-6 overflow-x-hidden">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-3 mt-6 sm:mt-10">Credits</h1>
      <div className="flex flex-wrap justify-center gap-4 p-3 sm:p-4 mt-6 sm:mt-10">
        {plans &&
          plans.map((plan, i) => (
            <div
              key={i}
              className={
                `border p-4 sm:p-5 flex flex-col justify-between rounded-md min-h-[300px] sm:h-[330px] w-full max-w-[300px] min-w-0 ` +
                (i % 2 === 0
                  ? "border-[#A0522D]"
                  : "dark:bg-[#980ffa]/40  border-white/20  bg-[#99a1b0]/30")
              }
            >
              <h3 className=" text-xl">
                <b>{plan.name}</b>
              </h3>
              <p>
                <span className="text-[#980ffa] text-2xl font-semibold">
                  {currancy}
                  {plan.price}
                </span>{" "}
                / {plan.credits}credits
              </p>
              <ul className="list-disc ml-6  ">
                {plan.features.map((item, i) => (
                  <li key={i} className="mt-1">
                    {item}
                  </li>
                ))}
              </ul>
              <button
                className="text-white  bg-[#980ffa]  rounded-md   px-8 py-2 w-full text-center cursor-pointer"
                onClick={() => toast.promise(creditPurchase(plan._id), {loading:'Processing...'})}
              >
                Buy Now
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Credits;
