"use client";
import SiteImage from "@/components/SiteImage";


import {
  useEffect,
  useRef,
  useMemo,
  useState,
} from "react";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { decideSellRequest } from "@/lib/sellRequestDecision";
import { db } from "@/firebase/firebase";

import {
  Check,
  X,
  Search,
} from "lucide-react";

type SellRequest = {
  id: string;
  name: string;
  mobile: string;
  brand: string;
  model: string;
  year: string;
  km: string;
  price: string;
  location: string;
  description: string;
  images?: string[];
  status: string;
};

export default function SellRequestsPage() {

  const [requests, setRequests] = useState<SellRequest[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const inFlight = useRef(new Set<string>());
  const [processing, setProcessing] = useState<string[]>([]);

  /*
   * IMPORTANT:
   *
   * Default filter is Pending.
   *
   * This means approved/rejected requests
   * won't appear when admin opens the page.
   */
  const [statusFilter, setStatusFilter] = useState("Pending");

  /*
   * ----------------------------------------------------
   * FETCH SELL REQUESTS
   * ----------------------------------------------------
   */

  const fetchRequests = () => getDocs(collection(db, "sellRequests"))
    .then((snapshot) => setRequests(snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<SellRequest, "id">) }))))
    .catch((error: unknown) => console.error("Failed to fetch sell requests:", error))
    .finally(() => setLoading(false));

  /*
   * ----------------------------------------------------
   * INITIAL LOAD
   * ----------------------------------------------------
   */

  useEffect(() => {

    fetchRequests();

  }, []);

  /*
   * ----------------------------------------------------
   * APPROVE BIKE
   * ----------------------------------------------------
   */

  const processRequest = async (id: string, decision: "Approved" | "Rejected") => {
    if (inFlight.current.has(id)) return;
    inFlight.current.add(id);
    setProcessing((current) => [...current, id]);
    try {
      await decideSellRequest(db, id, decision);
      setRequests((current) => current.filter((request) => request.id !== id));
    } catch (error) {
      console.error("Sell request update failed:", error);
      alert(error instanceof Error ? error.message : "Unable to process this request. Please try again.");
    } finally {
      inFlight.current.delete(id);
      setProcessing((current) => current.filter((requestId) => requestId !== id));
    }
  };
  const approveBike = (bike: SellRequest) => processRequest(bike.id, "Approved");
  const rejectBike = (id: string) => processRequest(id, "Rejected");

  /*
   * ----------------------------------------------------
   * SEARCH + STATUS FILTER
   * ----------------------------------------------------
   */

  const filteredRequests = useMemo(() => {

    return requests.filter(
      (bike) => {

        const text =
          search
            .toLowerCase()
            .trim();

        const searchMatch =
          !text ||
          bike.name
            ?.toLowerCase()
            .includes(text) ||
          bike.brand
            ?.toLowerCase()
            .includes(text) ||
          bike.model
            ?.toLowerCase()
            .includes(text) ||
          bike.mobile
            ?.includes(search);

        /*
         * Status filtering
         */

        const statusMatch =
          statusFilter === "All"
            ? bike.status !== "Approved" &&
              bike.status !== "Rejected"

            : bike.status ===
              statusFilter;

        return (
          searchMatch &&
          statusMatch
        );

      }
    );

  }, [
    requests,
    search,
    statusFilter,
  ]);

  /*
   * ----------------------------------------------------
   * LOADING
   * ----------------------------------------------------
   */

  if (loading) {

    return (
      <div
        className="
        flex
        min-h-screen
        items-center
        justify-center
        bg-gray-100
        "
      >

        <h1
          className="
          text-3xl
          font-black
          text-gray-900
          "
        >
          Loading Requests...
        </h1>

      </div>
    );

  }

  /*
   * ----------------------------------------------------
   * PAGE
   * ----------------------------------------------------
   */

  return (

    <main
      className="
      min-h-screen
      bg-gray-100
      p-6
      md:p-8
      "
    >

      {/* PAGE TITLE */}

      <div className="mb-8">

        <h1
          className="
          text-3xl
          font-black
          text-gray-900
          md:text-4xl
          "
        >
          🏍️ Sell Bike Requests
        </h1>

        <p
          className="
          mt-2
          text-sm
          text-gray-500
          "
        >
          Manage incoming bike selling requests
        </p>

      </div>

      {/* SEARCH + FILTER */}

      <div
        className="
        mb-8
        grid
        gap-4
        rounded-3xl
        bg-white
        p-6
        shadow-xl
        md:grid-cols-2
        "
      >

        {/* SEARCH */}

        <div className="relative">

          <Search
            size={20}
            className="
            absolute
            left-4
            top-4
            text-gray-400
            "
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="
            Search seller, bike, mobile...
            "
            className="
            w-full
            rounded-xl
            border
            border-gray-200
            py-3
            pl-12
            pr-4
            outline-none
            transition
            focus:border-orange-500
            focus:ring-2
            focus:ring-orange-500/20
            "
          />

        </div>

        {/* STATUS FILTER */}

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
          className="
          rounded-xl
          border
          border-gray-200
          px-4
          py-3
          outline-none
          focus:border-orange-500
          "
        >

          <option value="Pending">
            Pending Requests
          </option>

          <option value="All">
            Active Requests
          </option>

          <option value="Approved">
            Approved
          </option>

          <option value="Rejected">
            Rejected
          </option>

        </select>

      </div>

      {/* REQUEST CARDS */}

      <div
        className="
        grid
        gap-8
        lg:grid-cols-2
        "
      >

        {filteredRequests.length === 0 && (

          <div
            className="
            rounded-3xl
            bg-white
            p-10
            text-center
            shadow-xl
            lg:col-span-2
            "
          >

            <div
              className="
              mx-auto
              mb-4
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              bg-gray-100
              text-2xl
              "
            >
              📭
            </div>

            <h2
              className="
              text-2xl
              font-black
              text-gray-900
              "
            >
              No Requests Found
            </h2>

            <p
              className="
              mt-2
              text-gray-500
              "
            >
              There are no requests matching
              your current filter.
            </p>

          </div>

        )}

        {filteredRequests.map(
          (bike) => (

            <div
              key={bike.id}
              className="
              rounded-3xl
              bg-white
              p-6
              shadow-xl
              transition
              hover:shadow-2xl
              "
            >

              {/* IMAGES */}

              {bike.images &&
                bike.images.length > 0 && (

                  <div
                    className="
                    grid
                    grid-cols-3
                    gap-3
                    "
                  >

                    {bike.images.map(
                      (
                        img,
                        index
                      ) => (

                        <SiteImage width={320} height={256} sizes="(max-width: 768px) 50vw, 25vw"
                          key={index}
                          src={img}
                          alt={`${bike.brand} ${bike.model}`}
                          className="
                          h-32
                          w-full
                          rounded-xl
                          object-cover
                          "
                        />

                      )
                    )}

                  </div>

                )}

              {/* BIKE NAME */}

              <h2
                className="
                mt-6
                text-2xl
                font-black
                text-gray-900
                "
              >
                {bike.brand}{" "}
                {bike.model}
              </h2>

              {/* PRICE */}

              <p
                className="
                mt-3
                text-3xl
                font-black
                text-orange-500
                "
              >
                ₹
                {Number(
                  bike.price
                ).toLocaleString(
                  "en-IN"
                )}
              </p>

              {/* DETAILS */}

              <div
                className="
                mt-5
                space-y-2
                text-gray-600
                "
              >

                <p>
                  👤 {bike.name}
                </p>

                <p>
                  📞 {bike.mobile}
                </p>

                <p>
                  📍 {bike.location}
                </p>

                <p>
                  📅 {bike.year}
                </p>

                <p>
                  ⚡ {bike.km} KM
                </p>

              </div>

              {/* DESCRIPTION */}

              <p
                className="
                mt-5
                rounded-xl
                bg-gray-100
                p-4
                text-gray-700
                "
              >
                {bike.description ||
                  "No description"}
              </p>

              {/* ACTIONS */}

              <div
                className="
                mt-6
                flex
                gap-4
                "
              >

                {/* APPROVE */}

                <button
                  disabled={processing.includes(bike.id) || bike.status !== "Pending"}
                  onClick={() =>
                    approveBike(
                      bike
                    )
                  }
                  className="
                  flex-1
                  rounded-xl
                  bg-green-500
                  py-3
                  font-bold
                  text-white
                  transition
                  hover:bg-green-600
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  "
                >

                  <span
                    className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    "
                  >

                    <Check
                      size={18}
                    />

                    Approve

                  </span>

                </button>

                {/* REJECT */}

                <button
                  disabled={processing.includes(bike.id) || bike.status !== "Pending"}
                  onClick={() =>
                    rejectBike(
                      bike.id
                    )
                  }
                  className="
                  flex-1
                  rounded-xl
                  bg-red-500
                  py-3
                  font-bold
                  text-white
                  transition
                  hover:bg-red-600
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  "
                >

                  <span
                    className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    "
                  >

                    <X
                      size={18}
                    />

                    Reject

                  </span>

                </button>

              </div>

              {/* STATUS */}

              <div
                className="
                mt-5
                font-bold
                "
              >

                Status:

                <span
                  className={`
                  ml-2
                  ${
                    bike.status ===
                    "Pending"
                      ? "text-orange-600"
                      : bike.status ===
                        "Approved"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                  `}
                >
                  {bike.status}
                </span>

              </div>

            </div>

          )
        )}

      </div>

    </main>

  );
}