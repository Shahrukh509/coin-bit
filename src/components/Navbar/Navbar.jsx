import { NavLink } from "react-router-dom";
import styles from './Navbar.module.css';
import React from 'react';
import {  useDispatch, useSelector } from "react-redux";
import { signout } from "../../api/Internal";
import {resetUser} from "../../store/userSlice";

function Navbar() {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state)=> state.user.auth);
    const handleSignout= async ()=>{
        await signout();
        dispatch(resetUser())


    }
    return (
        <>
            <nav className={styles.navbar}>
                <NavLink to="/"
                    className={`${styles.logo} ${styles.inActiveStyle}`}>CoinBit</NavLink>

                <NavLink to="/" className={({ isActive }) => isActive ? styles.activeStyle : styles.inActiveStyle}>Home</NavLink>
                <NavLink to="/crypto" className={({ isActive }) => isActive ? styles.activeStyle : styles.inActiveStyle}>CryptoCurrencies</NavLink>
                <NavLink to="/blog" className={({ isActive }) => isActive ? styles.activeStyle : styles.inActiveStyle}>Blog</NavLink>
                <NavLink to="/submit" className={({ isActive }) => isActive ? styles.activeStyle : styles.inActiveStyle}>Submit a blog</NavLink>
                {isAuthenticated ? <div><NavLink><button className={styles.signOut} onClick={()=> handleSignout()}>Sign Out</button></NavLink></div> : <div><NavLink to="login" className={({ isActive }) => isActive ? styles.activeStyle : styles.inActiveStyle}><button className={styles.loginButton}>Log in</button></NavLink></div>}
                <NavLink to="signup" className={({ isActive }) => isActive ? styles.activeStyle : styles.inActiveStyle}><button className={styles.signupButton}>Sign Up</button></NavLink>

            </nav>
            <div className={styles.separator}>

            </div>

        </>
    )
}

export default Navbar;