import React from 'react';
import {PiLightbulb} from "react-icons/pi";
import {MdEditNote} from "react-icons/md";
import {VscVscodeInsiders} from "react-icons/vsc";
import {GiGraduateCap} from "react-icons/gi";

const chatData = [
    {
        title: "Create image",
        icon: <PiLightbulb />,
        iconColor: "#e2c541",
    },
    {
        title: "Get advice",
        icon: <MdEditNote />,
        iconColor: "#c285c7",
    },
    {
        title: "Summarize text",
        icon: <VscVscodeInsiders />,
        iconColor: "#e86060",
    },
    {
        title: "Code",
        icon: <GiGraduateCap />,
        iconColor: "#76d0eb",
    },
    {
        title: "Help",
        icon: <GiGraduateCap />,
        iconColor: "#76d0eb",
    },
    {
        title: "More",
    },
]

const ChatHelp = () => {
    return (
        <div className="w-full flex flex-col md:items-center md:flex-row justify-center gap-3">
            {chatData.map((item, index) => (
                <div key={index} className="flex items-center gap-2 border border-gray-600
                px-2 py-1 rounded-full hover:border-white/50 duration-300 hover:bg-white/10">
                    {item?.icon && <span className="text-xl" style={{color: item?.iconColor}}>{item?.icon}</span>}
                    <p>{item?.title}</p>
                </div>
            ))}
        </div>
    );
};

export default ChatHelp;
