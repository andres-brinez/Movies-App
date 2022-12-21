import { slider } from "./slider.js";

const containerHome=document.querySelector(".container-Home")
const containerSlider= document .querySelector('.slideshow-container' );
const containerTrendingMovies= document .querySelector('.container-trending' );
const containerTrendingTV= document .querySelector('.container-trending-tv' );
const containerCategories= document .querySelector('.container-categories' );
const containerUpcoming= document .querySelector('.container-upcoming' );
const containerCategoryMovies = document.querySelector('.container-category-movies');
const cointainerTitle=document.querySelector(".title-container-category")
const containerMovieSearch = document.querySelector('.container-search-movies');
const containerTitleSearch= document.querySelector(".title-container-search h2")




export  function getPopularMovies(){
    conexion('movie/popular').then((data) => {
        containerSlider.innerHTML = ''
        const peliculas = data.results
            
        peliculas.forEach(pelicula => {
            const {poster_path, title, id} = pelicula
            const url = `https://image.tmdb.org/t/p/w500${poster_path}`

            const div = document.createElement('div')
            div.classList.add('mySlides')
            div.classList.add('fade')
            div.innerHTML = `
                <img src="${url}"class="slider-img" >
            `            
            containerSlider.appendChild(div)
        
                
        });

        const controller=`
        <a class="prev">&#10094;</a>
        <a class="next">&#10095;</a>
        `
        containerSlider.insertAdjacentHTML('beforeend', controller)

        const prevIcon = document.getElementsByClassName('prev')[0];
        const nextIcon = document.getElementsByClassName('next')[0];
        
        slider(prevIcon, nextIcon)

    })
    
    
    
}

export function getMoviesTrending(){
    conexion('trending/movie/day').then((data) => {
        scroll(data,containerTrendingMovies)

    })

}

export function getTvTrending(){
    conexion('trending/tv/day').then((data) => {
        scroll(data,containerTrendingTV)

    })

}

export function getUpcomingMovies(){
    conexion(`movie/upcoming`).then((data) => {
        scroll(data,containerUpcoming)
    
    })
}

export function getCategories(){
    conexion('genre/movie/list').then((data) => {
        containerCategories.innerHTML = ''
        const categorias = data.genres
        
        categorias.forEach(categoria => {
            const {name, id} = categoria

            const div = document.createElement('div')
            div.classList.add('category')
            div.setAttribute('id', id)
            div.innerHTML = `<p>${name}</p>`
            containerCategories.appendChild(div)

            div.addEventListener('click',()=>{
                location.hash= `#category=${id}-${name}`
            })

        })

    })

}

export function categoryPage(){

    containerHome.classList.add("oculto")
    getMoviesBycategory()
}

export function MoviePage(){
    containerHome.classList.remove("see")
    getMovieBySearch()

}

export function HomePage(){
        containerHome.classList.remove("oculto")
        getTvTrending()
        getPopularMovies()
        getMoviesTrending()
        getCategories()
        getUpcomingMovies()
}


async function getMoviesBycategory(){

    const url = location.hash.slice(1).toLocaleLowerCase().split('=')[1]
    const id = url.split('-')[0]
    /*usualmente un % seguido de dos números quieren decir que un string fue codificado para formar parte de un URI,
    por cuestiones de evitar caracteres raros.
    Se recomienda usar decodeURL para quitarlo */
    let name = decodeURI(url.split('-')[1])
    const newName= name.charAt(0).toUpperCase() + name.slice(1);  // pone en mayuscula la  primera letra

    console.log(newName)
    
    cointainerTitle.innerHTML = `<h2>${newName}</h2>`
    
    
    conexion(`discover/movie?with_genres=${id}`).then((data) => {
        const peliculas = data.results
        containerCategoryMovies.innerHTML = ''
        peliculas.forEach(pelicula => {
            console.log(pelicula)
            
            const {poster_path,id}= pelicula
    
            const url = `https://image.tmdb.org/t/p/w200${poster_path}`
            const div = document.createElement('div')
            div.classList.add('container-movie')
            div.innerHTML = `<img src="${url}" alt="Imagen ${id}">`
            containerCategoryMovies.appendChild(div)

        })

        
    })
}



export function getMovieBySearch(){

    const search = document.querySelector('.input-search').value
    

    // console.log(search)

    conexion(`search/movie?query=${search}`).then((data) => {
        const peliculas = data.results
        console.log(peliculas)

        if (peliculas==0){
            containerHome.classList.add("see")
            location.hash="Home"  
            alert('pelicula no encontrada')
            

        }

        else{
            
            containerHome.classList.add("oculto")
            
            let title=search.charAt(0).toUpperCase() + search.slice(1); // pone en mayuscula la  primera letra
            containerTitleSearch.textContent=title
            containerMovieSearch.innerHTML = ''

            peliculas.forEach(pelicula => {
                console.log(pelicula)

                const {poster_path,id}= pelicula
                console.log(poster_path)
                const url = `https://image.tmdb.org/t/p/w200${poster_path}`
                const div = document.createElement('div')
                div.classList.add('container-movie')
                div.innerHTML = `<img src="${url}" alt="Imagen ${id}">`
                containerMovieSearch.appendChild(div)

            })
            


        }

        

    })

}




// Se encarga de hacer la estructura HTML de scroll de peliculas
async function scroll(data,container){
    
    container.innerHTML = ''
    const peliculas = data.results
    peliculas.forEach(pelicula => {
        const {poster_path, title, id} = pelicula
        const url = `https://image.tmdb.org/t/p/w200${poster_path}`

        const div = document.createElement('div')
        div.classList.add('caroulsel')
        // agregar el id a la pelicula
        div.setAttribute('id', id)
        div.innerHTML = `<img src="${url}" alt="Imagen ${title}">` 

        container.appendChild(div)
    
    })

}