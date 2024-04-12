import axiosInstance from "../../config/http-common";
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BookDetailsCSS from './BookDetails.module.css';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";



function BookDetails() {

    const navigate = useNavigate();
    const [backendData, setBackendData] = useState([]);
    const { BookID } = useParams();
    const { register, handleSubmit } = useForm();


    const getBookData = () => {
        axiosInstance.get(`http://localhost:4000/book/getbook/${BookID}`)
            .then(response => {
                setBackendData(response.data);
            })
            .catch(error => {
                console.error('Error fetching book data:', error);
            });
    };

    useEffect(() => {
        getBookData();
    }, []);

    const onSubmit = (book) => {
        const bookData = {
            Quantity: book.Quantity
        };
        handleAddToCart(bookData)
    };

    // const handleAddToCart = () => {
    //     axiosInstance.post(`http://localhost:4000/cart/insert/${BookID}`, { Quantity: quantity })
    //         .then(response => {
    //             console.log(response.data);
    //         })
    //         .catch(error => {
    //             console.error('Error adding to cart:', error.response.data);
    //             setError(error.response.data.message);
    //         });
    // };

    function handleAddToCart(bookData) {
        return new Promise((resolve, reject) => {
            axiosInstance.post(`http://localhost:4000/cart/insert/${BookID}`, bookData, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then((res) => {
                    if (res.status !== 200) {
                        reject(new Error('Failed to add book'));
                    }
                    resolve(res.data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                    reject(error);
                });
        });
    }


    return (
        <>
            <div className={BookDetailsCSS.maindiv}>
                {backendData.map((book, index) => (
                    <div div key={index} className={BookDetailsCSS.keydiv}>
                        <div>
                            <img className={BookDetailsCSS.img} src={book.CoverPhoto} alt="" />
                        </div>
                        <div className={BookDetailsCSS.bookdetailsdiv}>
                            <h4 className={BookDetailsCSS.booktitle}>{book.Title}</h4>
                            <div className={BookDetailsCSS.authorgenrediv}>
                                <span>Author: <strong className={BookDetailsCSS.strongtag}>{book.Author}</strong></span>
                                <span>Genre: <strong className={BookDetailsCSS.strongtag}>{book.Genre}</strong></span>
                            </div>
                            {book.Discount <= 0 &&
                                <p className={BookDetailsCSS.bookprice}>&#8377;{book.Price} <span></span></p>
                            }
                            {book.Discount > 0 &&
                                <p className={BookDetailsCSS.bookprice}>
                                    <span>&#8377; {book.Price - (book.Price * book.Discount) / 100}</span>
                                    <s className={BookDetailsCSS.bookdiscount}>&#8377; {book.Price}</s>
                                    <span className={BookDetailsCSS.discountpercentage}>{book.Discount}% OFF</span>
                                    <span className={BookDetailsCSS.saveprice}>You Save &#8377; {(book.Price - (book.Price - (book.Price * book.Discount) / 100)).toFixed(2)}</span>
                                </p>
                            }
                            <p className={BookDetailsCSS.isbnfont}>ISBN: {book.ISBN}</p>

                            {(book.Quantity > 0) ? <><p className={BookDetailsCSS.isbnfont}>Quantity Available: {book.Quantity}</p></> : <p className={BookDetailsCSS.isbnfont}>Quantity Available : Not Available</p>}
                            {book.OfferTitle !== 'No offers' &&
                                <p className={BookDetailsCSS.isbnfont}>Offers: {book.OfferTitle}</p>
                            }
                            <div className={BookDetailsCSS.btndiv}>
                                {(localStorage.getItem('accessToken')) && book.Quantity > 0 ? <>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        Add Quantity : <input defaultValue={1} className={BookDetailsCSS.quantityinput}{...register("Quantity")} type="number" />
                                        <button className={`${BookDetailsCSS.editbutton} ${BookDetailsCSS.editbutton1}`}>Add To Cart</button>
                                    </form>
                                </> : null}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default BookDetails;
