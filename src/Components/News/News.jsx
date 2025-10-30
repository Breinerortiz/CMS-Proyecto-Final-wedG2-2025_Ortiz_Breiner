import { useState, useEffect} from 'react'

import './News.css'
import { doc, getDoc } from "firebase/firestore";
import  {db } from '../../Firebase/ConfigFirebase';


const News = () => {

     const[news,setNews] = useState(null);



    useEffect(() => {

        const CargarDatos = async () => {
            const docRef = doc(db, "noticias", "noticia1");
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
                 console.log("Document data:", docSnap.id());
                 setNews(...docSnap.data(), {id: docSnap.id});
            } else {
                // docSnap.data() will be undefined in this case
                console.log("No such document!");
            }
        }
        CargarDatos();
    }
    , [])



return (
    <>
    {news?<> <h1>news.titular</h1>
        {/* <img src="" alt="" /> */}
        <p>news.fecha</p>
        <p>news.noticia  </p>
  
       
    </>  :<p>Cargando...</p>}
    </>
)

}
export default News
