import React from "react";
import { initialsGenerator } from "../../utils/helper";
import { useNavigate } from "react-router-dom";

const ProfileInfo = ({ userInfo }) => {

    const navigate = useNavigate();

    const onLogout = () => {
        localStorage.clear()
        navigate('/')
    }

    return (
        <div className="flex justify-center items-center gap-5">
            <div className="rounded-full bg-slate-200 text-center pt-2 w-12 h-12 text-xl font-semibold">{initialsGenerator(userInfo.name)}</div>
            <div className="flex flex-col gap-1">
                <p className="text-lg ">{userInfo?.name || "Guest"}</p>
                <button className="text-sm underline cursor-pointer" onClick={onLogout}>Logout</button>
            </div>
        </div>
    )
}

export default ProfileInfo