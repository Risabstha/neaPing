import React,{useState} from "react";
import Nav from "../NavBar/Nav";
import Dashboard from "../Dashborad/Dashboard";

const MainDashboard = ({collapsed, setCollapsed, showText, setShowText}) => {

    return (
        <div className="flex">
            <Nav collapsed={collapsed} setCollapsed={setCollapsed} showText={showText} setShowText={setShowText} />
            <Dashboard collapsed={collapsed} />
        </div>
    );
};
  
export default MainDashboard;