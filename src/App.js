import Home from './pages/Home/Home';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import styles from './App.module.css';
import Protected from './components/Protected/protected';
import Error from './pages/Error/Error';
import React from 'react';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import {  useSelector } from "react-redux";

function App() {
  const isAuth=useSelector((state)=> state.user.auth);
  return (
    <div className={styles.container}>
      <BrowserRouter>
        <div className={styles.layout}>
          <Navbar />
          <Routes>
            <Route
              path='/'
              exact
              element={
                <div className={styles.main}>
                  <Home />
                </div>

              } />

            <Route
              path='/crypto'
              exact
              element={
                <div className={styles.main}>
                  crypto page
                </div>

              } />

            <Route
              path='/blog'
              exact
              element={
                <Protected isAuth={isAuth}>
                  <div className={styles.main}>Blog page</div>
                </Protected>
                

              } />

            <Route
              path='/submit'
              exact
              element={
                <Protected isAuth={isAuth}>

                  <div className={styles.main}>
                    Submit blog
                  </div>

                </Protected>
                

              } />

            <Route
              path='/login'
              exact
              element={
                <div className={styles.main}>
                  <Login/>
                </div>

              } />

            <Route
              path='/signup'
              exact
              element={
                <div className={styles.main}>
                  <Signup/>
                </div>

              } />


          <Route
              path='*'
              element={
                <div className={styles.main}>
                  <Error/>
                </div>

              } />

          </Routes>


          <Footer />

        </div>
      </BrowserRouter>
    </div>

  );
}

export default App;
