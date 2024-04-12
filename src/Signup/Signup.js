import SignupCSS from './Signup.module.css';
import { React, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function Signup() {

    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();


    const onSubmit = (user) => {
        const userData = {
            UserName: user.UserName,
            PhoneNumber: user.PhoneNumber,
            Password: user.Password,
            Email: user.Email
        };
        signUpAPI(userData)
        navigate("/login");
        console.log(userData);
    };

    async function signUpAPI(userData) {
        try {
            const res = await fetch("http://localhost:4000/user/register/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            });
            if (!res.ok) {
                debugger
                throw new Error('Failed to sign up');
            }
            return res.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    function onCancel() {
        return navigate('/login')
    }



    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={SignupCSS.container}>
                    <h1 className='abc'>Create Your Account</h1>
                    <p>Please fill this form to create an account.</p>
                    <hr />

                    <label htmlFor="username"><b>UserName</b></label>
                    <input {...register("UserName")} type="text" placeholder="Enter UserName" required />

                    <label htmlFor="email"><b>Email</b></label>
                    <input {...register("Email")} type="text" placeholder="Enter Email" required />

                    <label htmlFor="psw"><b>Password</b></label>
                    <input {...register("Password")} type="password" placeholder="Enter Password" required />

                    <label htmlFor="number"><b>PhoneNumber</b></label>
                    <input {...register("PhoneNumber")} type="text" placeholder="Enter PhoneNumber" required />

                    <br />

                    <div className={SignupCSS.clearfix} >
                        <button type="button" className={SignupCSS.cancelbtn} onClick={onCancel}>Cancel</button>
                        <button type="submit" className={SignupCSS.signupbtn}>Sign Up</button>
                    </div>
                </div>
            </form>
        </>
    );
}

export default Signup;