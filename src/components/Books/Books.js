import React, { useEffect, useState } from 'react';
import axiosInstance from '../../config/http-common';
import BookCSS from './Books.module.css';
import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';


function Books() {

  const navigate = useNavigate();
  const [backendData, setBackendData] = useState([]);
  const [wishlistData, setWishlistData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');


  const handleSearch = (e) => {
    e.preventDefault();

    const bookSearchURL = `http://localhost:4000/book/getbookbysearch/?searchbybooktitle=${searchQuery}`;
    const wishlistURL = `http://localhost:4000/wishlist/getwishlist/`;

    Promise.all([
      axiosInstance.get(bookSearchURL),
      axiosInstance.get(wishlistURL)
    ])
      .then(([bookSearchResponse, wishlistResponse]) => {
        const bookSearchData = bookSearchResponse.data;
        const wishlistData = wishlistResponse.data;

        const wishlistMap = {};
        wishlistData.forEach(item => {
          wishlistMap[item.BookID] = true;
        });

        const updatedSearchResults = bookSearchData.map(book => ({
          ...book,
          imagesrc: wishlistMap[book.BookID] ? "https://www.bookchor.com/assets-new/images/heart-fill.svg" : "https://www.bookchor.com/assets-new/images/heart-icon.svg"
        }));

        setBackendData(updatedSearchResults);
        setWishlistData(wishlistData);

        console.log('Updated book search results:', updatedSearchResults);
        console.log('Wishlist:', wishlistData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    e.stopPropagation();
  };

  const getBookData = () => {
    Promise.all([
      axiosInstance.get(`http://localhost:4000/book/getbooks/`),
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

  const getBookDataWithoutToken = () => {
    fetch('http://localhost:4000/book/getbooks/')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setBackendData(data);
      })
      .catch(error => {
        console.error('Error fetching book data:', error);
      });
  };



  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      getBookData();
    }
    else {
      getBookDataWithoutToken();
    }
  }, []);


  function detailBook(BookID) {
    navigate(`./bookdetails/${BookID}`);
  }

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
          if(searchQuery!==''){
            handleSearch();
          }
          else{
            getBookData();
          }
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
          if(searchQuery!==''){
            handleSearch();
          }
          else{
            getBookData();
          }
        })
        .catch((err) => {
          reject(err);
        })
    });
  }


  return (
    <>
      {/* <div className={BookCSS.addbtndiv}>
        <input
          type="search"
          placeholder='Search by ISBN, Title, Author, Genre'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          id={BookCSS.searchinput}
          className="form-control"
        />
        <button id={BookCSS.searchbtn} onClick={(e) => searchQuery ? handleSearch(e) : getBookData()}>Search</button>
      </div> */}

      
       <div className={BookCSS.addbtndiv}>
        <form className={BookCSS.searchform} onSubmit={(e) =>  handleSearch(e)}>
          <input
            type="search"
            placeholder='Search by ISBN, Title, Author, Genre'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id={BookCSS.searchinput}
            className="form-control"
          />
          <button id={BookCSS.searchbtn} type='submit'>Search</button>
        </form>
      </div> 

      <div className={BookCSS.gridcontainer}>
        {backendData.map((book, index) => (
          <div className={BookCSS.zoom} key={index + 1} onClick={() => detailBook(book.BookID)}>
            <img onClick={(event) => onWishImage(book.BookID, book.imagesrc, event)} className={BookCSS.wishlistimage} src={book.imagesrc} />
            <img src={book.CoverPhoto} alt="" className={BookCSS.cardimage} />
            <font className={BookCSS.cardtitle}>{book.Title}</font>

            <p className={BookCSS.carddetails}>Price : {book.Discount > 0 ?
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

export default Books;