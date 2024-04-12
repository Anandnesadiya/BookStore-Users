import React, { useEffect, useState } from 'react';
import axiosInstance from '../../config/http-common';
import WishlistCSS from './Wishlist.module.css';
import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';



function WishList() {

  const navigate = useNavigate();
  const [backendData, setBackendData] = useState([]);
  const [wishlistData, setWishlistData] = useState([]);


  const getBookData = () => {
    Promise.all([
      axiosInstance.get(`http://localhost:4000/wishlist/getbookdetailsofwishlist/`),
      axiosInstance.get(`http://localhost:4000/wishlist/getwishlist/`)
    ])
      .then(([booksResponse, wishlistResponse]) => {
        const booksData = booksResponse.data;
        const wishlistData = wishlistResponse.data;

        const wishlistMap = {};
        wishlistData.forEach(item => {
          wishlistMap[item.BookID] = true;
        });

        const updatedBooksData = booksData.map(book => ({
          ...book,
          imagesrc: wishlistMap[book.BookID] ? "https://www.bookchor.com/assets-new/images/heart-fill.svg" : "https://www.bookchor.com/assets-new/images/heart-icon.svg"
        }));
        console.log(wishlistMap);
        setBackendData(updatedBooksData);
        setWishlistData(wishlistData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const onWishImage = (ID, imagesrc, event) => {
    event.preventDefault();
    if (imagesrc == "https://www.bookchor.com/assets-new/images/heart-icon.svg") {
      addWish(ID);
      console.log(`Book Added Successfully to Wishlist ${ID}`);
    }
    else {
      deleteWish(ID);
      console.log(`Book Removed Successfully in Wishlist  ${ID}`);
    }
    event.stopPropagation();

  };

  function deleteWish(ID) {
    return new Promise(function (resolve, reject) {
      axiosInstance
        .delete(`http://localhost:4000/wishlist/deletewish/${ID}`)
        .then((res) => {
          resolve(res);
          getBookData();
        })
        .catch((err) => {
          reject(err);
        })
    });
  }

  function addWish(ID) {
    return new Promise(function (resolve, reject) {
      axiosInstance
        .get(`http://localhost:4000/wishlist/addwish/${ID}`)
        .then((res) => {
          resolve(res);
          getBookData();
        })
        .catch((err) => {
          reject(err);
        })
    });
  }

  function detailBook(BookID) {
    navigate(`./bookdetails/${BookID}`);
  }

  useEffect(() => {
    getBookData();
  }, []);


  return (
    <>
      <div className={WishlistCSS.gridcontainer}>
        {backendData.map((book, index) => (
          <div className={WishlistCSS.zoom} key={index + 1} onClick={() => detailBook(book.BookID)}>
            <img onClick={(event) => onWishImage(book.BookID, book.imagesrc, event)} className={WishlistCSS.wishlistimage} src={book.imagesrc} />
            <img src={book.CoverPhoto} alt="" className={WishlistCSS.cardimage} />
            <font className={WishlistCSS.cardtitle}>{book.Title}</font>

            <p className={WishlistCSS.carddetails}>Price : {book.Discount > 0 ?
              <>
                <s>{book.Price} <span>&#8377;</span></s> &nbsp;
                {book.Price - (book.Price * book.Discount) / 100} <span>&#8377;</span>
              </>
              :
              <>
                {book.Price} <span>&#8377;</span>
              </>
            }
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

export default WishList;