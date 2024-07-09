import styles from './Error.module.css';
import { Link } from 'react-router-dom';
import React from 'react';
function Error(){

    return <div className={styles.errorWrapper}>
        <div className={styles.errorHeader}>Error 404 - Page not found, oops!</div>
        <div className={styles.errorBody}>Go back to <Link to='/' className={styles.homeLink}>home</Link></div>
    </div>


}
export default Error;