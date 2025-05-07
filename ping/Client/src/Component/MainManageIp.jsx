import React,{useState} from "react";
import Nav from "../NavBar/Nav";
import ManageIp from "../Dashborad/ManageIp";

const MainManageIp = ({collapsed,setCollapsed, showText, setShowText}) => {

    return (
        <div className="flex min-h-screen overflow-auto">
            <Nav collapsed={collapsed} setCollapsed={setCollapsed} showText={showText} setShowText={setShowText} />
            <ManageIp collapsed={collapsed} />
        </div>
    );
};
  
export default MainManageIp;