import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import PasswordInput from "../../components/input/PasswordInput";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { passLength, validator } from "../../utils/helper";
import axiosInstace from "../../utils/axiosInstance";
import { div } from "three/tsl";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error1, setError1] = useState(false)
    const [error2, setError2] = useState(false)
    const [error, setError] = useState('')

    const navigate = useNavigate();

    const emailChangeHandler = (e) => {
        setEmail(e.target.value);
    }
    const passwordChangeHandler = (e) => {
        setPassword(e.target.value);
    }

    //login handler
    const handleLogin = async (e) => {
        e.preventDefault();

        const isEmailValid = validator(email);
        const isPasswordValid = passLength(password);

        setError1(!isEmailValid);
        setError2(!isPasswordValid);

        //Login API call back
        try {
            const response = await axiosInstace.post('/login-account', {
                email: email,
                password: password
            })
            console.log(response.data)

            if (response.data && response.data.accessToken) {
                localStorage.setItem('token', response.data.accessToken)
                setError('')
                navigate('/dashboard')
            }

        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message)
            } else {
                setError("unexpected Error occured.Try again")
            }
        }
    }



    return (
        <div className="">
            <Navbar />
            <div className="w-100 h-150 flex justify-center items-center mx-auto pt-40">
                <form onSubmit={handleLogin}>
                    <div className="flex flex-col p-10 rounded-lg shadow-2xl gap-5">
                        <h4 className="text-2xl mb-5 ">Login</h4>
                        <input
                            type="email"
                            placeholder="exmaple87@gmail.com"
                            className="input-box"
                            value={email}
                            onChange={emailChangeHandler} />
                        {error1 ? <p className="text-red-500 text-sm">Enter Valid Email address</p> : null}
                        <PasswordInput input={password} onchange={passwordChangeHandler} placeholder={'@test12345'} />
                        {error2 ? <p className="text-red-500 text-sm">Password length should be atleast 5 character and must include one special character</p> : null}
                        {error === '' ? null : <p className="text-red-500 text-sm">{error}</p>}
                        <button type="submit" className="shadow-xl cursor-pointer w-1/3 h-auto p-3 mx-auto rounded-md text-center">Login</button>
                        <p className="text-sm mt-5">Not registered Yet? <Link to='/signUp' className="underline decoration-2"> Create a Account </Link></p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login