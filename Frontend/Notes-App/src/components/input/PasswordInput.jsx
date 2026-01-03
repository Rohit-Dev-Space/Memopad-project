import React from "react";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";

const PasswordInput = ({ input, onchange, placeholder }) => {

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    }

    return (
        <div className="input-box flex justify-between items-centerx">
            <input
                value={input}
                onChange={onchange}
                type={isPasswordVisible ? "text" : "password"}
                placeholder={placeholder || "Password"}
                className="outline-none"
            />
            {
                isPasswordVisible ? <Eye className="cursor-pointer" onClick={togglePasswordVisibility} /> : <EyeClosed className="cursor-pointer" onClick={togglePasswordVisibility} />
            }
        </div>
    )
}
export default PasswordInput