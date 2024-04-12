import LoginCSS from "./Login.module.css";
import { useState } from "react";
import { React, useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';


function Login() {

    const { register, handleSubmit } = useForm();
    const [data, setData] = useState("");

    const navigate = useNavigate();

    function onSignUp() {
        return navigate("/signup");
    }

    const onSubmit = (user) => {
        const userData = {
            Email: user.Email,
            Password: user.Password,
            OTP: user.OTP
        };

        loginAPI(userData).then((res) => {
            console.log(res);
            localStorage.setItem('accessToken', res.accesstoken)
            navigate("/books");
        }).catch((err) => {
            console.log(err);
            navigate("/login")
        })
        console.log(userData);
    };

    async function loginAPI(userData) {
        try {
            const res = await fetch("http://localhost:4000/user/login/", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            });

            if (!res.ok) {
                throw new Error('Failed to sign up');
            }
            return res.json();


        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={LoginCSS.container}>
                    <h1 className={LoginCSS.abc}>Login</h1>
                    <hr />

                    <label htmlFor="email"><b>Email</b></label>
                    <input {...register("Email")} type="text" placeholder="Enter Email" required />

                    <label htmlFor="psw"><b>Password</b></label>
                    <input {...register("Password")} type="password" placeholder="Enter Password" required />

                    <br />

                    <div className="clearfix " >
                        <button type="button" className={LoginCSS.signupbtn} onClick={onSignUp}>SignUp</button>
                        <button type="submit" className={LoginCSS.loginbtn}>Login</button>
                    </div>
                </div>
            </form>
        </>
    );
}

export default Login;