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
const containerDetailsMovie = document.querySelector('.container-details-movie');



function getPopularMovies(){
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
                <img src="${url}" class="slider-img" alt="img ${id}" onclick="imgSeleccionada(${id})" >
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

function getMoviesTrending(){
    conexion('trending/movie/day').then((data) => {
        scroll(data,containerTrendingMovies)

    })

}

function getTvTrending(){
    conexion('trending/tv/day').then((data) => {
        scroll(data,containerTrendingTV)

    })

}

function getUpcomingMovies(){
    conexion(`movie/upcoming`).then((data) => {
        scroll(data,containerUpcoming)
    
    })
}

function getCategories(){
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
        getPopularMovies()
        getMoviesTrending()
        getTvTrending()
        getUpcomingMovies()
        getCategories()

}

export function DetailsMoviePage(){

    containerHome.classList.add("oculto")

    const url = location.hash.slice(1).toLocaleLowerCase().split('=')[1]
    const id = url.split('-')[0]
    console.log(id)
    getMovieDetails(id)
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

async function getMovieBySearch(){

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

// obtiene la  pelicula con el id  

async function  getMovieDetails(id){
    
    conexion(`movie/${id}`).then((data) =>{

        const pelicula = data
        console.log(pelicula)

        const {title, overview, poster_path, tagline, vote_average, runtime,release_date} = pelicula

        const [año, _] = release_date.split('-');
        

        
        const url = `https://image.tmdb.org/t/p/w200${poster_path}`

        const div = document.createElement('div')
        div.innerHTML = `
        <div class="information-main">
            <div class="img-poster">
                <img src="${url}" alt="Imagen ${title}">
            </div>
            <div class="information">
                <h2 class="title-movie-detail">${title}</h2>
                <p class="tagline">${tagline}</p>
                <div class="details"> 
                    <div class="details_votes">
                        <svg width="32" height="29" viewBox="0 0 32 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 0L19.5922 11.0557H31.2169L21.8123 17.8885L25.4046 28.9443L16 22.1115L6.59544 28.9443L10.1877 17.8885L0.783095 11.0557H12.4078L16 0Z" fill="#E13C2F"/>
                        </svg>
                        <p class="vote">${vote_average.toFixed(1) * 10}% </p>
                    </div>
                    <p class="duracion">${runtime}</p>
                    <p class="date">${año}</p>
                </div>
                <p class="description">${overview}</p>
            </div>
        </div`

        containerDetailsMovie.appendChild(div)
        



    })

 

}





// Se encarga de hacer la estructura HTML de scroll de peliculas
async function scroll(data,tipo){
    
    container.innerHTML = ''
    const peliculas = data.results
    peliculas.forEach(pelicula => {
        const {poster_path, title, id} = pelicula
        const url = `https://image.tmdb.org/t/p/w200${poster_path}`


        const div = document.createElement('div')
        div.classList.add('caroulsel')
        // agregar el id a la pelicula
        div.setAttribute('id', id)
        div.innerHTML = `<img src="${url}" alt=" img ${title}" onclick="imgSeleccionada(${id},${tipo})">` 

        container.appendChild(div)
    
    })

}

// funcion que obtiene todas las imagenes





