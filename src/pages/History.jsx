import axios from "axios";
import { useEffect, useState } from "react";

export default function History() {
  const [history, setHistory] = useState(null);

  useEffect(() => {
    getHistory();
  }, []);

  const getHistory = async () => {
    // Fetch data from API
    const response = await axios.get("http://localhost:8000/api/history/");
    console.log("History API Response:", response.data);
    setHistory(response.data);
  };

  return (
    <div>
      <div className="container mx-auto max-w-[1280px] flex flex-col gap-6 p-[2rem]">
        {history?.length &&
          history.map((trip) => (
            <div className="shadow-md rounded-2xl p-6 bg-green-50/20">
              <div className="flex items-center gap-4">
                <div className="w-20 min-w-20 aspect-square h-20 rounded-full bg-green-50 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-map-icon lucide-map w-[2rem] h-[2rem] text-green-500"
                  >
                    <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" />
                    <path d="M15 5.764v15" />
                    <path d="M9 3.236v15" />
                  </svg>
                </div>

                <div className="">
                  <div>
                    <h3 className="text-xl font-bold">
                      <div className="inline-flex gap-2 items-center justify-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="lucide lucide-map-pin-icon lucide-map-pin text-slate-500 min-w-6 aspect-square h-6"
                        >
                          <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        From: {trip.pickup_location_name}
                      </div>
                    </h3>
                    <p className="text-gray-500">
                      {" "}
                      To: {trip.dropoff_location_name}
                    </p>
                  </div>

                  <div></div>
                </div>
              </div>
              <div className="flex w-full justify-end items-end ">
                <div className="bg-green-700 py-4 px-6 no-underline mt-4 rounded-md">
                  <a
                    href={`http://localhost:8000/api${trip.log_pdf}`}
                    target="_blank"
                    rel="noreferrer"
                    className="block no-underline text-white font-bold"
                  >
                    View Log PDF
                  </a>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
