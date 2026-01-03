import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import { useState } from "react";
import { passLength, validator } from "../../utils/helper";
import { validator2 } from "../../utils/helper";
import PasswordInput from "../../components/input/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import axiosInstace from "../../utils/axiosInstance";

const SignUP = () => {

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error1, setError1] = useState(false)
    const [error2, setError2] = useState(false)
    const [error3, setError3] = useState(false)
    const [error, setError] = useState(false)
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();

        const isEmailValid = validator(email);
        const isNameValid = validator2(name);
        const isPasswordValid = passLength(password)

        setError1(!isEmailValid);
        setError2(!isPasswordValid);
        setError3(!isNameValid);

        try {
            const response = await axiosInstace.post('/create-account', {
                fullName: name,
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
                localStorage.clear()
                setError(error.response.data.message)
            } else {
                setError("unexpected Error occured.Try again")
            }
        }
    }

    const emailChangeHandler = (e) => {
        setEmail(e.target.value);
    }
    const nameChangeHandler = (e) => {
        setName(e.target.value);
    }

    return (
        <>
            <Navbar />
            <div className="w-130 h-150 flex justify-center mx-auto items-center pt-40">
                <form onSubmit={handleSignUp}>
                    <div className="flex flex-col p-10 rounded-lg shadow-2xl gap-5">
                        <h4 className="text-2xl mb-5 ">Sign Up</h4>
                        <input
                            type="text"
                            placeholder="your name"
                            className="input-box"
                            value={name}
                            onChange={nameChangeHandler}
                        />
                        {error3 ? <p className="text-red-500 text-sm">Enter your Name</p> : null}
                        <input
                            type="email"
                            placeholder="exmaple87@gmail.com"
                            className="input-box"
                            value={email}
                            onChange={emailChangeHandler}
                        />
                        {error1 ? <p className="text-red-500 text-sm">Enter Valid Email address</p> : null}
                        <PasswordInput input={password} onchange={(e) => setPassword(e.target.value)} placeholder={'@test12345'} />
                        {error2 ? <p className="text-red-500 text-sm">Password length should be atleast 5 character and must include one special character</p> : null}
                        {error ? <p className="text-red-500 text-sm">{error}</p> : null}
                        <button type="submit" className="shadow-xl cursor-pointer w-2/4 h-auto p-3 mx-auto rounded-md text-center">Sign Up</button>
                        <p className="text-center text-sm mt-5">Already have an Account? <br /><Link to='/' className="underline decoration-2"> Login in your Account </Link></p>
                    </div>
                </form>
            </div>
        </>
    )
}

export default SignUP