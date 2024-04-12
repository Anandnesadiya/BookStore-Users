import './App.css';
import { Route, Routes } from 'react-router-dom';
import Layout from './layout/Layout';
import Home from './components/Home/Home';
import Books from './components/Books/Books';
import Login from './Login/Login.js';
import Signup from './Signup/Signup.js';
import Order from './components/Orders/Order.js';
import Cart from './components/Cart/Cart.js';
import Error from './components/Error/Error.js';
import BookDetails from './components/Books/BookDetails.js';
import WishList from './components/Wishlist/Wishlist.js';

function App() {

  function UserElement({ children }) {
    if (localStorage.getItem('accessToken')) {
      return <>{children}</>
    }
    else {
      return <div>You can not access this page</div>
    }
  }


  return (
    <Routes>
      <Route path='/signup' element={<Signup />} />
      <Route path='/login' element={<Login />} />
      <Route path="/" element={<Layout />} >
        <Route path='/home' element={<Home />} />
        <Route path='/books' element={<Books />} />
        <Route path='/cart' element={<UserElement><Cart /></UserElement>} />
        <Route path='/order' element={<UserElement><Order /></UserElement>} />
        <Route path='/wishlist' element={<UserElement><WishList /></UserElement>} />
        <Route path="books/bookdetails/:BookID" element={<BookDetails />} />
      </Route>
      <Route path='/error' element={<Error />} />
    </Routes>
  );
}

export default App;
