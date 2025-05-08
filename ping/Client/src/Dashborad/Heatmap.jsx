import React, { useEffect, useState } from "react";
import axios from "axios";
import { CiGrid32 } from "react-icons/ci";

const Heatmap = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5001/api/ip", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* <h1 className="text-2xl font-bold text-center text-white mb-6">
        IP Address/Website Heatmap
      </h1> */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {data.map((item, index) => (
          <div
            key={index}
            className="p-4 bg-gray-800 text-white rounded-lg shadow-md flex flex-col items-center justify-center"
          >
            <p className="text-lg font-semibold">{item.name}</p>
            <p className="text-sm text-gray-400">{item.ip}</p>
            <p className="text-xs text-gray-500">{item.province}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Heatmap;