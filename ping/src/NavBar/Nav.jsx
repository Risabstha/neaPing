import React from "react";
import NEA from '../assets/logo.jpg'
const Nav = () => {

    const Province = [
        {
            name: "Province 1"
        },
        {
            name: "Province 2"
        },
        {
            name: "Province 3"
        },
        {
            name: "Province 4"
        },
        {
            name: "Province 5"
        },
        {
            name: "Province 6"
        },
        {
            name: "Province 7"
        },


    ]
    return (
        //bg-[#522258]
        <>
            <div className="bg-gray-700 w-[18vw]  p-0 h-[97.5vh] fixed m-2 rounded-xl">
                <div className=" p-5">
                    <img src={NEA} alt="NEA LOGO" className="w-[15vw]" />
                </div>
                <div className="text-center  ">
                    {Province.map((province, index) => (
                        <div key={index} 
                            className="rounded-sm text-white bg-[#000c52] py-2 my-2 hover:bg-black">
                            {province.name}
                        </div>)
                    )}
                </div>


            </div>

        </>
    );
}

export default Nav;