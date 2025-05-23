import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoReorderThreeOutline, IoHome } from "react-icons/io5";
import {
    PiNumberSquareOneFill, PiNumberSquareTwoFill, PiNumberSquareThreeFill,
    PiNumberSquareFourFill, PiNumberSquareFiveFill, PiNumberSixFill, PiNumberSquareSevenFill
} from "react-icons/pi";
import { FaMapMarkedAlt, FaAngleDown, FaAngleUp, FaUserPlus } from "react-icons/fa";
import { MdOutlineLogout } from "react-icons/md";
import { GiNetworkBars } from "react-icons/gi";

const Nav = ({ collapsed, setCollapsed ,showText, setShowText }) => {
    // const [collapsed, setCollapsed] = useState(false);
    // const [showText, setShowText] = useState(true);
    const [angleDown, setAngleDown] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const toggleSidebar = () => {
        if (!collapsed) {
            setShowText(false);
            setTimeout(() => setCollapsed(true), 100);
        } else {
            setCollapsed(false);
            setTimeout(() => setShowText(true), 200);
        }
    };

    const toggleAngleDown = () => {
        setAngleDown(prev => !prev);
        // setTimeout(() => setAngleDown(true), 100);
    };

    const Province = [
        { name: "Koshi Province", icon: <PiNumberSquareOneFill /> },
        { name: "Madhesh Province", icon: <PiNumberSquareTwoFill /> },
        { name: "Bagmati Province", icon: <PiNumberSquareThreeFill /> },
        { name: "Gandaki Province", icon: <PiNumberSquareFourFill /> },
        { name: "Lumbini Province", icon: <PiNumberSquareFiveFill /> },
        { name: "Karnali Province", icon: <PiNumberSixFill /> },
        { name: "Sudurpashchim Province", icon: <PiNumberSquareSevenFill /> },
    ];

    return (
        <div className={`bg-gray-800 z-50 ${collapsed ?'w-[4.5rem]' : 'w-[14rem]'} fixed min-h-screen  transition-all duration-300`}>
            <div className="relative text-white  flex  ">
                <div className="flex justify-start">
                    <IoReorderThreeOutline
                        className="text-4xl text-white mt-5 mx-5 cursor-pointer"
                        onClick={toggleSidebar}
                    />
                </div>
            </div>
            <div className="relative text-left my-[2vh]">
                <Link
                    to="/dashboard"
                >
                    <div className={`relative text-white px-5 py-4 border-y-1 hover:bg-gray-700 flex items-center justify-between cursor-pointer
                                    ${location.pathname.includes("/dashboard") ? "bg-gray-900" : ""}`}>
                        <div className="flex items-center">
                            <IoHome className="mx-1 mr-3 my-0.5 text-xl" />
                            {showText &&
                                "Dashboard"
                            }
                        </div>
                    </div>
                </Link>

                <div className="relative text-white px-5 py-4 border--1 hover:bg-gray-700 flex items-center justify-between cursor-pointer">
                    <div className="flex items-center">
                        <FaMapMarkedAlt className="mx-1 mr-3 my-0.5 text-xl" />
                        {showText && "Province"}
                    </div>
                    {showText && (angleDown ? (
                        <FaAngleUp
                            className="text-xl cursor-pointer"
                            onClick={toggleAngleDown}
                        />
                    ) : (
                        <FaAngleDown
                            className="text-xl cursor-pointer"
                            onClick={toggleAngleDown}
                        />
                    ))}
                </div>

                {/* Dropdown items */}
                {angleDown && showText && Province.map((province, index) => (
                    <div key={index} className="text-white pl-10 py-2 hover:bg-gray-700 odd:bg-gray-600 flex items-center cursor-pointer">
                        <div className="mr-3 text-xl">{province.icon}</div>
                        {province.name}
                    </div>
                ))
                }

                <Link
                    to="/manageIp"
                >
                    <div className={`relative text-white px-5 py-4 border-y-1 hover:bg-gray-700 flex items-center justify-between cursor-pointer
                                    ${location.pathname.includes("/manageIp") ? "bg-gray-900" : ""}`}>
                        <div className="flex items-center">
                            <GiNetworkBars className="mx-1 mr-3 my-0.5 text-xl " />
                            {showText &&
                                "Manage Ip"
                            }
                        </div>
                    </div>
                </Link>

                {/* <Link
                    to="/manage_user"
                >
                    <div className={`relative text-white px-5 py-4 border-y-1 hover:bg-gray-800 flex items-center justify-between cursor-pointer
                                    ${location.pathname.includes("/manage_user") ? "bg-gray-800" : ""}`}>
                        <div className=" flex items-center">
                            <FaUserPlus className="mx-1 mr-3 my-0.5 text-xl " />
                            {showText &&
                                "Manage User"
                            }
                        </div>
                    </div>
                </Link> */}
            </div>


            <Link
            onClick={handleLogout}
                to="/"
            >
                <div
                
                    className={` absolute   bottom-0 ${collapsed ? 'w-[4.5rem]' : 'w-[14rem]'} px-5 py-4 left-0 hover:bg-gray-700 bg-gray-800 cursor-pointer z-999 text-white text-center  transition-all duration-300`}
                ><div className="flex justify-start">
                        <MdOutlineLogout className={`text-xl my-1 mx-1  ${collapsed ? '' : 'mr-3'}`}  />
                        {showText && <button >Logout</button>}
                    </div>

                </div></Link>
        </div >
    );
};

export default Nav;
