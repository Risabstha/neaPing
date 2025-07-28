import React, { useEffect, useState } from "react";
import { CiGrid32 } from "react-icons/ci";
import { motion } from "framer-motion";
import { jwtDecode } from 'jwt-decode';
const Heatmap = ({ collapsed }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvince, setSelectedProvince] = useState("");

   const [showSessionAlert, setShowSessionAlert] = useState(false);
  
      // Session expiration check
      useEffect(() => {
          const checkTokenExpiration = () => {
              const token = localStorage.getItem("token");
              if (!token) return;
  
              try {
                  const decodedToken = jwtDecode(token);
                  const currentTime = Date.now() / 1000;
  
                  if (decodedToken.exp < currentTime) {
                      handleSessionExpiration();
                  }
              } catch (error) {
                  console.error("Token decoding error:", error);
              }
          };
  
          // Initial check
          checkTokenExpiration();
  
          // Check every 60 seconds
          const interval = setInterval(checkTokenExpiration, 60000);
  
          return () => clearInterval(interval);
      }, []);
  
      const handleSessionExpiration = () => {
          localStorage.removeItem("token");
          setShowSessionAlert(true);
      };
  

  useEffect(() => {
    let isMounted = true;

    const fetchIp = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5001/api/ip", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch ip");

        let data = await response.json();

        if (selectedProvince) {
          data = data.filter((d) => d.province === selectedProvince);
        }

        if (isMounted) {
          setData(data);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching ip:", error);
          setData([]);
          setLoading(false);
        }
      }
    };

    fetchIp();
    const interval = setInterval(fetchIp, 1200000); // 20 minutes

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [selectedProvince]);

  const handleSelectProvince = (e) => {
    setSelectedProvince(e.target.value);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 0, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div
      className={`${collapsed ? "ml-[4.5rem]" : " ml-[4.5rem] md:ml-[14rem]"
        } relative transition-all duration-300 w-screen mt-6 p-10 justify-center`}
    >
      
      <div>
         {/* Session Expiration Modal */}
         {showSessionAlert && (
                <div className="fixed inset-0 bg-gray-500/50 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
                        <div className="text-center">
                            <h3 className="text-lg font-medium mb-4">⏳ Session Expired</h3>
                            <p className="mb-4">Your session has expired. Please log in again.</p>
                            <button
                                onClick={() => {
                                    localStorage.removeItem("token");
                                    window.location.href = "/";
                                }}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                Go to Login
                            </button>
                        </div>
                    </div>
                </div>
            )}
        <div className="text-sm md:text-xl font-bold text-gray-300 mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center">
            <CiGrid32 className="mr-2 text-gray-400 text-3xl" />
            <p>Heatmap</p>
          </div>

          <div>
            <select
              name="provinceFilter"
              aria-label="Select Province"
              className="outline-none bg-[#0B101B] text-sm md:text-base text-white w-full md:w-[20rem] px-2 py-1 rounded"
              onChange={handleSelectProvince}
            >
              <option value="">Select Province</option>
              <option value="province-1">Province 1 - (Koshi)</option>
              <option value="province-2">Province 2 - (Madesh)</option>
              <option value="province-3">Province 3 - (Bagmati)</option>
              <option value="province-4">Province 4 - (Gandaki)</option>
              <option value="province-5">Province 5 - (Lumbini)</option>
              <option value="province-6">Province 6 - (Karnali)</option>
              <option value="province-7">Province 7 - (Sudurpashchim)</option>
            </select>
          </div>
        </div>


        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 mt-4"
        >
          {data.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center">
              No data available
            </p>
          ) : (
            data.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="p-4 bg-gray-800 text-white rounded-lg shadow-md flex flex-col items-center justify-center"
              >
                <p className="text-lg font-semibold">{item.name}</p>
                <p className="text-sm text-gray-400">{item.ip}</p>
                <p className="text-xs text-gray-500">{item.province}</p>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Heatmap;
