/* Esto para evitar llamar a las funciones automáticamente para que se ejecuten, 
sino que lo podamos borrar en el futuro y podamos en el file de navigation.js, 
llamarlas cuando location y hashchange nos avisen que estamos en la vista principal o en alguna otra vista */
// import { HomePage,categoryPage,MoviePage,DetailsMoviePage,ProfilePage,SeriesPage,PersonPage } from "./main.js";

import { Home } from "../components/Home.js" 
import { SearchPage } from "../components/SearchPage.js";


function navigation() {
    
    
    if (location.hash.includes("Home") || (location.hash.length==0) ){
        console.log('home');
        Home()

    }

    else if (location.hash.startsWith("#search")){
        SearchPage()        
        
    }

    // else if (location.hash.startsWith("#movie") || location.hash.startsWith("#tv")){
    //     DetailsMoviePage()
    // }
 

    // else if (location.hash.startsWith("#profile")){
    //     console.log('profile');
    //     ProfilePage()
    // }


    // else if (location.hash.startsWith("#category")){
    //     console.log('category');
    //     categoryPage()
    // }

    // else if (location.hash.startsWith("#series/popular")){
    //     console.log('tv/popular');
    //     SeriesPage()
    // }

    // else if (location.hash.startsWith("#person/popular")){
    //     console.log('home');
    //     PersonPage()

    // }


    
}


/* este evento no solo lo queremos llamar cuando  cambie el hash, 
tambien lo queremos llamar cuando cargue nuestra aplicación, la primera carga, 
 no solo vamos a cambiar a navigator cuando cambie el hash sino tambien cuando cargue la aplicación */

window.addEventListener('load', navigation,false);
// window.addEventListener('hashchange', navigation,false);

window.addEventListener('hashchange',()=>{  navigation()}) // cuando haya cambio en el hash , url

iconSearch.addEventListener('click',()=>{
    location.hash = '#search=' + inputSearch.value
})






















