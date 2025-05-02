import React,{useState} from "react";
import Nav from "../NavBar/Nav";
import ManageIp from "../Dashborad/ManageIp";

const MainManageIp = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex">
            <Nav collapsed={collapsed} setCollapsed={setCollapsed} />
            <ManageIp collapsed={collapsed} />
        </div>
    );
};
  
export default MainManageIp;