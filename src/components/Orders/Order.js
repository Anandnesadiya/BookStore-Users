import OrderCSS from './Orders.module.css';
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axiosInstance from '../../config/http-common';


function Order() {

  let totalorderprice = 0;

  const [orderbackendData, setorderBackendData] = useState([]);
  const [userbackendData, setuserBackendData] = useState([]);


  const getorderData = () => {
    axiosInstance.get("http://localhost:4000/order/getdatabyuserid/")
      .then(response => {
        setorderBackendData(response.data);
      })
      .catch(error => {
        console.error('Error fetching book data:', error);
      });
  };


  const getuserData = () => {
    axiosInstance.get("http://localhost:4000/user/getdatabyusersession/")
      .then(response => {
        setuserBackendData(response.data);
      })
      .catch(error => {
        console.error('Error fetching book data:', error);
      });
  };



  useEffect(() => {
    getorderData();
    getuserData();
  }, []);


  return (
    <>
      <h1 className={OrderCSS.heading}>Your Order List</h1>
      {userbackendData.map((user, index) => (
        <div key={index} >
          <font className={OrderCSS.email} >Your ID : {user.Email}</font>
        </div>
      ))}
      <table className={OrderCSS.ordertable}>
        <tbody>
          <tr>
            <th>Book Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>

          {orderbackendData.map((orderdata, index) => {
            totalorderprice += (orderdata.OrderPrice) * orderdata.Quantity;

            return (
              <tr key={orderdata.CartItemID} className={OrderCSS.tr}>
                <td className={OrderCSS.td}>{orderdata.Title}</td>
                <td className={OrderCSS.td}>{orderdata.Quantity}</td>
                <td className={OrderCSS.td}>
                  {orderdata.Discount > 0 ?
                    <>
                      <s>{orderdata.Price} <span>&#8377;</span></s> &nbsp;
                      {orderdata.OrderPrice} <span></span>
                    </>
                    :
                    <>
                      {orderdata.OrderPrice} <span></span>
                    </>
                  }
                  <span> &#8377;</span></td>
                <td className={OrderCSS.td}>{(orderdata.OrderPrice)}  <span> &#8377;</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className={OrderCSS.totalorderprice}>Total of Your Order Price: {(totalorderprice).toFixed(2)} <span> &#8377;</span></div>
    </>
  );
}

export default Order;