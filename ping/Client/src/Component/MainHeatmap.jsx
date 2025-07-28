import React,{useState} from "react";
import Nav from "../NavBar/Nav";
import Dashboard from "../Dashborad/Dashboard";
import Heatmap from "../Dashborad/Heatmap";

const MainHeatmap = ({collapsed, setCollapsed, showText, setShowText}) => {

    return (
        <div className="flex">
            <Nav collapsed={collapsed} setCollapsed={setCollapsed} showText={showText} setShowText={setShowText} />
            <Heatmap collapsed={collapsed} />
        </div>
    );
};
  
export default MainHeatmap;