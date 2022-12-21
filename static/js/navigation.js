/* Esto para evitar llamar a las funciones automáticamente para que se ejecuten, 
sino que lo podamos borrar en el futuro y podamos en el file de navigation.js, 
llamarlas cuando location y hashchange nos avisen que estamos en la vista principal o en alguna otra vista */
import { getPopularMovies,getMoviesTrending,getCategories,getUpcomingMovies,getTvTrending,categoryPage } from "./main.js";

const iconSearch= document.querySelector('.input-icon')
const inputSearch=document.querySelector('.input-search')

function navigation() {
    console.log('navigation');
    console.log(location.hash);

    // obtener cantidad de letras


    

    if (location.hash.startsWith("#trends")){
        console.log('trends');
    }

    else if (location.hash.startsWith("#search")){
        console.log('search');
    }

    else if (location.hash.startsWith("#movie")){
        console.log('movie');
    }

    else if (location.hash.startsWith("#category")){
        console.log('category');
        categoryPage()
    }

    else{
        console.log('home');
        getTvTrending()
        getPopularMovies()
        getMoviesTrending()
        getCategories()
        getUpcomingMovies()
    }


}

/* este evento no solo lo queremos llamar cuando  cambie el hash, 
tambien lo queremos llamar cuando cargue nuestra aplicación, la primera carga, 
 no solo vamos a cambiar a navigator cuando cambie el hash sino tambien cuando cargue la aplicación */

window.addEventListener('load', navigation,false);
window.addEventListener('hashchange', navigation,false);

iconSearch.addEventListener('click',()=>{
    
    location.hash = '#search=' + inputSearch.value

})



