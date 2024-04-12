import { Link } from "react-router-dom";
import HeaderCSS from './Header.module.css';
import { useNavigate } from 'react-router-dom';

function Header() {

    const navigate = useNavigate();

    function logout() {
        localStorage.removeItem('accessToken');
        navigate("/home")
    }


    
    return (
        <>
            <nav className={HeaderCSS.navbar}>
                <ul className={HeaderCSS.headerul}>
                    <li className={HeaderCSS.headerli}><Link to="/home">Home</Link></li>
                    <li className={HeaderCSS.headerli}><Link to="/books">Books</Link></li>
                    {(localStorage.getItem('accessToken')) ? <><li className={HeaderCSS.headerli}><Link to="/cart">Cart</Link></li></> : null}
                    {(localStorage.getItem('accessToken')) ? <><li className={HeaderCSS.headerli}><Link to="/order">Order</Link></li></> : null}
                    {(localStorage.getItem('accessToken')) ? <><li className={HeaderCSS.headerli}><Link to="/wishlist">WishList</Link></li></> : null}
                </ul>
                <ul>
                    {(!localStorage.getItem('accessToken')) ? <><li className={HeaderCSS.headerlogout}><Link to="/login">Login</Link></li></> : null}
                    {(!localStorage.getItem('accessToken')) ? <><li className={HeaderCSS.headerlogout}><Link to="/signup">Sign Up</Link></li></> : null}
                    {(localStorage.getItem('accessToken')) ? <><li className={HeaderCSS.headerlogout}><Link onClick={logout} to="/home">Logout</Link></li></> : null}
                </ul>
            </nav>

        </>
    );
}

export default Header;