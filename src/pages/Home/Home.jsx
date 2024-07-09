import React from 'react';
import { useState, useEffect } from 'react';
import { getNews } from '../../api/external';
import styles from './Home.module.css'
function Home (){
    const [articles,setArticles] = useState([]); 
    useEffect(()=>{
        (async function newsApiCall(){
            const response = await getNews();
            setArticles(response);
        })();
        // cleanup function
        setArticles([]);
    },[])
    return (
        <>
          <div className={styles.header}>Latest Article</div>
          <div className={styles.grid}></div>
            
        </>
    )
}
export default Home;