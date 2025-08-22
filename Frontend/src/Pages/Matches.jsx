import { useEffect, lazy, Suspense } from "react";
import useMatchedStore from "../../Stores/useMatchedStore";
import axios from "axios";
import { API_URL } from "../config";

const MatchedCard = lazy(() => import("../Components/MatchedCard"));

function Matches() {
  const matchedProfiles = useMatchedStore((state) => state.matchedProfiles);
  const setMatchedProfiles = useMatchedStore((state) => state.setMatchedProfiles);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/api/connections/matches`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMatchedProfiles(res.data.matches);
      } catch (error) {
        console.error("Failed to fetch matches:", error);
      }
    };
    fetchMatches();
  }, [setMatchedProfiles]);

  return (
    <div className="pt-8 min-h-screen px-4">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 md:max-w-6xl max-w-4xl mx-auto mt-10">
        {Array.isArray(matchedProfiles) &&
          matchedProfiles.map((user, idx) => (
            <Suspense
              key={idx}
              fallback={
                <div className="w-full flex flex-col jusitfy-center items-center gap-4   h-48 bg-zinc-800 animate-pulse rounded-2xl" >
                  <div className="w-32 h-32  rounded-full bg-black">
                  </div>
                  <div className="w-40 rounded  bg-black h-10 ">

                  </div>
                  <div className=" flex gap-4">
                    <div className="w-40 rounded  bg-black h-10"></div>
                    <div className="w-40 rounded  bg-black h-10"></div>
                  </div>
                  </div>
              }
            >
              <MatchedCard {...user} />
            </Suspense>
          ))}
      </div>
    </div>
  );
}

export default Matches;
