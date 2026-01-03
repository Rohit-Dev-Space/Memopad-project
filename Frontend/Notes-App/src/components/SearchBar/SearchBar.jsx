import { Cross, Search, X } from "lucide-react";
import React from "react";

const SearchBar = ({ value, searcHandler, onClearSearch }) => {
    return (
        <div className="w-120 h-12 flex px-5 justify-between items-center text-center text-sm outline-none bg-gray-200 rounded-sm ">
            <input
                type="text"
                value={value}
                onChange={searcHandler}
                placeholder="Serach Title, Content or Tags"
                className="outline-none w-full"
            />
            {value ? <button type="button" className="text-gray-400 pr-5 hover:text-black" onClick={onClearSearch}><X /></button> : null}
            <button type="button" className="text-gray-400 hover:text-black" onClick={searcHandler}><Search /></button>
        </div>
    )
}

export default SearchBar