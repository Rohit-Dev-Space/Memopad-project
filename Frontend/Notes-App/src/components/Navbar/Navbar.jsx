import React, { useState } from "react";
import ProfileInfo from "../cards/ProfileInfo";
import SearchBar from "../SearchBar/SearchBar";

const Navbar = ({ userInfo, onSearch, onClearSearch, clicked }) => {

    const [searching, setSearching] = useState("");

    const searcHandler = (e) => {
        setSearching(e.target.value)
        if (e.enterKey === 'Enter') {
            onSearch(searching)
        }
        if (searching) {
            onSearch(searching)
        }
    }

    const ClearSearch = () => {
        setSearching("");
        onClearSearch();
    }

    return (
        <div className="bg-gray-50 fixed shadow-lg w-full h-20 flex justify-between items-center px-15 text-black text-2xl pl-16 p-6">
            <div className="flex items-start ">MemoPad<span className="text-lg">+</span></div>
            {(window.location.pathname === '/dashboard' && clicked) && <SearchBar value={searching} searcHandler={searcHandler} onClearSearch={ClearSearch} />}
            {!(window.location.pathname === '/' || window.location.pathname === '/signUp') && userInfo && (
                <ProfileInfo userInfo={userInfo ? userInfo : ''} />
            )}
        </div>
    )

}
export default Navbar