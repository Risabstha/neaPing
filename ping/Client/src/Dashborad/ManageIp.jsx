import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';
import { IoMdClose, IoMdAdd } from "react-icons/io";
import { GrPrevious, GrNext } from "react-icons/gr";
import { FaEdit } from "react-icons/fa";
import { MdOutlineDeleteForever } from "react-icons/md";

const ManageIp = ({ collapsed }) => {

    // state for sucess message
    const [successMessage, setSuccessMessage] = useState("");

    const [isFormVisible, setIsFormVisible] = useState(true);
    const [selectedProvince, setSelectedProvince] = useState("");      // for table select option 

    // State for Ip
    const [ip, setIp] = useState([]);
    const [newIp, setNewIp] = useState({ ip: "", name: "", province: "" });
    const [editingId, setEditingId] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc"); // State for sorting order
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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    const handleChange = (e) => {
        setNewIp({ ...newIp, [e.target.name]: e.target.value });
    };

    const handleAddOrEditIp = async () => {

        if (!newIp.ip || !newIp.province || !newIp.name) {
            alert("Please fill in all required fields.");
            return;
        }

        const payload = {
            ip: newIp.ip.trim(),
            name: newIp.name.trim(),
            province: newIp.province.trim(),
        };

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Token is missing or invalid. Please log in again.");
            return;
        }

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            let response;
            if (editingId) {
                // Update existing ip
                response = await axios.put(`http://localhost:5001/api/ip/${editingId}`, payload, config);

                setIp((prevIp) =>
                    prevIp.map((ip) =>
                        ip._id === editingId ? response.data : ip
                    )
                );


                setEditingId(null);
            } else {
                // Create new ip
                response = await axios.post("http://localhost:5001/api/ip", payload, config);
                setIp((prevIp) => [response.data, ...prevIp]); // New ip on top
            }

            setNewIp({
                ip: "",
                name: "",
                province: "",

            });
            // Assuming the API call is successful
            setSuccessMessage("IP added successfully");

            // Reset the form
            setNewIp({ ip: "", name: "", province: "" });

            // Hide the message after 2 seconds
            setTimeout(() => {
                setSuccessMessage("");
            }, 2000);


        } catch (error) {
            console.error("Error saving ip:", error.response?.data || error.message);
            if (error.response?.status === 400) {
                alert("An entry with the same IP or name already exists.");
            }
        }

    };


    // fetching ip data 
    useEffect(() => {
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

                // Ensure valid ip are sorted properly
                if (selectedProvince) {
                    data = data.filter((ipData) => ipData.province === selectedProvince);
                }



                setIp(data);

            } catch (error) {
                console.error("Error fetching ip:", error);
                setIp([]); // Prevent blank page
            }
        };

        fetchIp();
        const interval = setInterval(fetchIp, 12000000); // Fetch every 20min

        return () => clearInterval(interval); // Cleanup on unmount
    }, [selectedProvince]);

    const handleEdit = (ip) => {
        setNewIp({
            ...ip,
        });
        setEditingId(ip._id);
        setIsFormVisible(true);
    };

    const handleDelete = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this IP?");

        if (!isConfirmed) return; // Stop execution if user cancels

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Token is missing or invalid. Please log in again.");
                return;
            }

            await axios.delete(`http://localhost:5001/api/ip/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setIp((prevIp) => prevIp.filter((ip) => ip._id !== id));
            console.log("Ip deleted successfully");
        } catch (error) {
            console.error("Error deleting meeting:", error.response?.data || error.message);
        }
    };

    const handleSelectProvince = (e) => {
        setSelectedProvince(e.target.value);
    };


    // Pagination logic
    const [currentPage, setCurrentPage] = useState(1);
    const ipPerPage = 10;

    const indexOfLastIp = currentPage * ipPerPage;
    const indexOfFirstIp = indexOfLastIp - ipPerPage;
    const currentIp = ip.slice(indexOfFirstIp, indexOfLastIp);

    const totalPages = Math.ceil(ip.length / ipPerPage);
    const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

    return (
        <div className={`  ${collapsed ? 'ml-[4.5rem]' : ' ml-[4.5rem] md:ml-[14rem]'} relative  transition-all duration-300 w-full h-full mt-14 flex  flex-wrap justify-center`}>   {/* 'h-screen items-center', flex-1 allows dashboard component to occupy remaining spaces */}
           
            <div className="mb-6 w-full flex justify-center">

                <h1 className="text-3xl font-bold  text-white ">
                    Add IP Address
                </h1>
            </div>
            {successMessage && (
                <div className="text-green-500 text-lg text-center mb-4 animate-pulse w-full">
                    {successMessage}
                </div>
            )}
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

            {isFormVisible && (
                <div className="w-full flex justify-center">

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={itemVariants}>
                            <div className={`   rounded-xl
                                p-[1rem] md:p-[2rem]
                                w-[75vw] md:w-[50vw] lg:w-[40vw] xl:w-[26vw]
                                bg-gray-800 border-1 relative`}>

                                {/* <div className="text-xl pb-4 justify-center font-sans text-white  mb-4">Add IP </div> */}
                                <button
                                    onClick={() => setIsFormVisible(false)}
                                    className="absolute top-2 right-2  text-2xl bg-red-700  text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600"
                                >
                                    <IoMdClose />
                                </button>
                                <div  >
                                    <div className="text-white pb-1 mt-2">Ip Address</div>
                                    <input
                                        type="text"
                                        name="ip"
                                        placeholder="xxx.xxx.xxx.xxx"
                                        value={newIp.ip}
                                        onChange={handleChange}
                                        autoComplete="off"
                                        className="outline-blue-600  bg-gray-700 text-white p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    />
                                </div>

                                <div>
                                    <div className="text-white pb-1">Name</div>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Name"
                                        value={newIp.name}
                                        onChange={handleChange}
                                        autoComplete="off"
                                        className="outline-blue-600  bg-gray-700 text-white p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    />
                                </div>

                                <div>
                                    <div className="text-white pb-1">Province</div>
                                    <select
                                        name="province"
                                        value={newIp.province}
                                        className="outline-blue-600  bg-gray-700 text-white p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        onChange={handleChange}
                                    >
                                        <option value="">-- Select Province --</option>
                                        <option value="province-1">Province 1 - (Koshi)</option>
                                        <option value="province-2">Province 2 - (Madesh)</option>
                                        <option value="province-3">Province 3 - (Bagmati)</option>
                                        <option value="province-4">Province 4 - (Gandaki)</option>
                                        <option value="province-5">Province 5 - (Lumbini)</option>
                                        <option value="province-6">Province 6 - (Karnali)</option>
                                        <option value="province-7">Province 7 - (Sudurpashchim)</option>
                                    </select>

                                </div>


                                <button
                                    onClick={handleAddOrEditIp}
                                    disabled={!newIp.name || !newIp.ip || !newIp.province}
                                    className={`px-4 py-2 mt-4 rounded-md w-full ${!newIp.ip || !newIp.name || !newIp.province
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : editingId !== null
                                            ? "bg-yellow-400 hover:bg-yellow-500" // Update ip (Yellow)
                                            : "bg-green-500 hover:bg-green-600" // Add ip (Green)
                                        }`}
                                >
                                    {editingId !== null ? "Update Ip" : "Add Ip"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            )}
            {!isFormVisible && (
                <div className="flex justify-center p-1  w-full">
                    <button
                        onClick={() => setIsFormVisible(true)}
                        className="bg-green-600 text-white h-12 w-12 text-4xl flex justify-center items-center  rounded-full hover:bg-green-500"
                    >
                        <IoMdAdd />
                    </button>
                </div>
            )}


            <div className="p-2 md:p-0 overflow-x-auto w-full max-w-[60rem]">
                {/* Show "No IP" when there are no IPs */}
                {!isFormVisible && (
                    <div>
                        <div className="flex justify-center">
                            <select
                                name="provinceFilter"
                                className="border border-white bg-gray-700 text-white p-2 w-[12rem] md:w-[30rem] lg:w-[60rem] mt-4 focus:outline-none focus:ring-2 focus:ring-white"
                                onChange={handleSelectProvince}
                            >
                                <option value="">-- Select Province --</option>
                                <option value="province-1">Province 1 - (Koshi)</option>
                                <option value="province-2">Province 2 - (Madesh)</option>
                                <option value="province-3">Province 3 - (Bagmati)</option>
                                <option value="province-4">Province 4 - (Gandaki)</option>
                                <option value="province-5">Province 5 - (Lumbini)</option>
                                <option value="province-6">Province 6 - (Karnali)</option>
                                <option value="province-7">Province 7 - (Sudurpashchim)</option>
                            </select>
                        </div>

                        {ip.length === 0 ? (
                            <div className="text-center text-lg font-semibold text-white p-4">
                                No IP Yet!
                            </div>
                        ) : (
                            <div className={`p-2 sm:p-4 ${isFormVisible ? 'mt-[1vh]' : 'mt-[2vh]'}`}>
                                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                                    <motion.div variants={itemVariants}>
                                        <div className="p-4 w-full overflow-x-auto max-h-[calc(100vh-4rem)]">
                                            <table className="min-w-[500px] w-full border-collapse border text-white text-sm sm:text-base">
                                                <thead>
                                                    <tr>
                                                        <th className="border p-2">SN</th>
                                                        <th className="border p-2">IP Address</th>
                                                        <th className="border p-2">Name</th>
                                                        <th className="border p-2">Province</th>
                                                        <th className="border p-2">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {currentIp.map((ip, index) => (
                                                        <tr
                                                            key={index}
                                                            className="text-center hover:bg-gray-700 odd:bg-[#0f1626]"
                                                        >
                                                            <td className="border p-2">
                                                                {(currentPage - 1) * ipPerPage + index + 1}
                                                            </td>
                                                            <td className="border p-2">{ip.ip}</td>
                                                            <td className="border p-2">{ip.name}</td>
                                                            <td className="border p-2">{ip.province}</td>
                                                            <td className="border p-2 flex justify-center items-center space-x-2">
                                                                <button
                                                                    onClick={() => handleEdit(ip)}
                                                                    className="text-yellow-400 text-xl sm:text-2xl hover:text-yellow-600"
                                                                >
                                                                    <FaEdit />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(ip._id)}
                                                                    className="text-red-500 text-2xl sm:text-3xl hover:text-red-600"
                                                                >
                                                                    <MdOutlineDeleteForever />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </div>
                        )}

                        {/* Pagination */}
                        {ip.length > ipPerPage && (
                            <div className="flex justify-center items-center text-white space-x-3 w-full mb-4 mt-2">
                                <button
                                    onClick={goToPrevPage}
                                    disabled={currentPage === 1}
                                    className={`px-2 py-1 text-white rounded-full ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"
                                        }`}
                                >
                                    <GrPrevious />
                                </button>
                                <span className="text-sm sm:text-base font-sans">
                                    {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={goToNextPage}
                                    disabled={currentPage === totalPages}
                                    className={`px-2 py-1 text-white rounded-full ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"
                                        }`}
                                >
                                    <GrNext />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>


        </div >
    );


};

export default ManageIp;
