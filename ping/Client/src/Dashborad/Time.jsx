import React,{useState,useRef, useEffect} from 'react';

function Time()
{   
    const [time, setTime] =useState(new Date());        // new Date() : year-month-date     hours/minutes/second      day
    const intervalRef = useRef(null);

    useEffect( () =>{
                   intervalRef.current =     setInterval( ()=>setTime(new Date()),1000);     //setTime setter function updates time every second

                return ()=> clearInterval(intervalRef.current);
                    }  ,[])

    function changeTime()
    {
        let hour = time.getHours();         // as name suggest it gets hours from the state variable 'time'
        const minute = time.getMinutes();
        const second = time.getSeconds();
        const meridiem = hour >=12 ? "PM" : "AM" ;              // meridiem needs to be above 'hour = hour%12 || 12' otherwise it will always show AM.

        hour = hour % 12 || 12;

        return (`${padZero(hour)}:${padZero(minute)}:${padZero(second)} ${meridiem}`);
    } 

    function padZero(number)
    {
       return (number < 10 ? "0" : "") + number;        //  if hr/ min/ sec is less than 10 then this function will pad 0 infront of then 
                                                        // instead of 1 it will display 01 and so on
    }

    return(
        <div>
            <h1>{changeTime()}</h1>
        </div>
    );
}
export default Time;