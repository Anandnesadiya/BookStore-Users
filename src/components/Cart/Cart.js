import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axiosInstance from '../../config/http-common';
import CartCSS from './Cart.module.css';


function Cart() {

    const [cartbackendData, setcartBackendData] = useState([]);
    const [userbackendData, setuserBackendData] = useState([]);

    const navigate = useNavigate();
    let totalcartprice = 0;


    const getuserData = () => {
        axiosInstance.get("http://localhost:4000/user/getdatabyusersession/")
            .then(response => {
                setuserBackendData(response.data);
            })
            .catch(error => {
                console.error('Error fetching book data:', error);
            });
    };



    const getcartData = () => {
        axiosInstance.get("http://localhost:4000/cart/getcartdata/")
            .then(response => {
                setcartBackendData(response.data);
            })
            .catch(error => {
                console.error('Error fetching book data:', error);
            });
    };
    useEffect(() => {
        getuserData();
        getcartData();
    }, []);


    function deletecartAPI(ID) {
        return new Promise(function (resolve, reject) {
            axiosInstance
                .delete(`http://localhost:4000/cart/deletecartdata/${ID}`)
                .then((res) => {
                    getcartData();
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                })
        });
    }

    const CartToOrder = () => {
        axiosInstance.get("http://localhost:4000/order/carttoorder/")
            .then(response => {
                console.log('Cart to order successful:', response.data);
            })
            .catch(error => {
                console.error('Error fetching cart to order data:', error);
            });
    };


    const currency = "INR";
    const receiptId = "qwsaq1";

    const paymentHandler = async (e) => {
        try {
            // Fetch order details from backend
            const response = await fetch("http://localhost:4000/cart/order/", {
                method: "POST",
                body: JSON.stringify({
                    amount: totalcartprice * 100,
                    currency,
                    receipt: receiptId
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const order = await response.json();
            console.log(order);

            // Construct options object for payment gateway
            var options = {
                "key": "rzp_test_835nhcRc1TveyK",
                amount: totalcartprice * 100,
                currency,
                "name": "Book Store",
                "description": "Test Transaction",
                "image": "https://cdn.dribbble.com/userupload/6810642/file/original-45a54e0571ae13ce154f565f49615607.png?resize=400x0",
                "order_id": order.id,
                "handler": function (response) {
                    alert("Your Payment is Done");
                    CartToOrder();
                    navigate('/order');
                },
                "prefill": {
                    // Prefill user's information if available
                    "name": userbackendData[0].UserName, // Assuming user object contains name
                    "email": userbackendData[0].Email, // Assuming user object contains email
                    "contact": userbackendData[0].PhoneNumber, // Assuming user object contains contact
                    "notes": {
                        "address": "address" // Assuming user object contains address
                    }
                },
                "theme": {
                    "color": "#3399cc"
                }
            };

            var rzp1 = new window.Razorpay(options);
            rzp1.on('payment.success', function (response) {
                alert("Your Payment is Done");
            });
            rzp1.on('payment.failed', function (response) {
                alert("Payment Failed");
            });

            rzp1.open();
            e.preventDefault();
        } catch (error) {
            console.log(error);
        }
    }



    return (
        <>
            <h1 className={CartCSS.heading}>Cart</h1>
            {userbackendData.map((user, index) => (
                <div key={index} >
                    <font className={CartCSS.email} >Your ID : {user.Email}</font>
                </div>
            ))}
            <table className={CartCSS.carttable}>
                <tbody>
                    <tr>
                        <th>Book Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                        <th>Actions</th>
                    </tr>

                    {cartbackendData.map((cartdata, index) => {
                        totalcartprice += (cartdata.Price - (cartdata.Price * cartdata.Discount) / 100) * cartdata.Quantity;

                        return (
                            <tr key={cartdata.CartItemID} className={CartCSS.tr}>
                                <td className={CartCSS.td}>{cartdata.Title}</td>
                                <td className={CartCSS.td}>{cartdata.Quantity}</td>
                                <td className={CartCSS.td}>
                                    {cartdata.Discount > 0 ?
                                        <>
                                            <s>{cartdata.Price} <span>&#8377;</span></s> &nbsp;
                                            {cartdata.Price - (cartdata.Price * cartdata.Discount) / 100} <span>&#8377;</span>
                                        </>
                                        :
                                        <>
                                            {cartdata.Price} <span>&#8377;</span>
                                        </>
                                    }
                                </td>
                                <td className={CartCSS.td}>{(cartdata.Price - (cartdata.Price * cartdata.Discount) / 100) * cartdata.Quantity} <span> &#8377;</span></td>
                                <td className={CartCSS.td}>
                                    <button type="submit" className={`${CartCSS.cartbutton} ${CartCSS.cartbutton1}`} onClick={() => deletecartAPI(cartdata.CartItemID)}>Remove</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className={CartCSS.totalcartprice}>Total of Cart Price: {totalcartprice} <span> &#8377;</span></div>

            <button onClick={() => paymentHandler()} className={`${CartCSS.cheakoutbtn} ${CartCSS.cheakoutbtn1}`}>Cheak Out</button>
        </>
    );
}

export default Cart;