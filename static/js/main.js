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
    containerDetailsMovie.classList.add("oculto")
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
    containerDetailsMovie.classList.remove("oculto")

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
        containerDetailsMovie.innerHTML=''


        const pelicula = data

        const {title, overview, poster_path, tagline, vote_average, runtime,release_date,genres} = pelicula

       

        const [año, _] = release_date.split('-');
    

        const url = `https://image.tmdb.org/t/p/w500${poster_path}`

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
                        <svg width="28" height="20" viewBox="0 0 32 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 0L19.5922 11.0557H31.2169L21.8123 17.8885L25.4046 28.9443L16 22.1115L6.59544 28.9443L10.1877 17.8885L0.783095 11.0557H12.4078L16 0Z" fill="#E13C2F"/>
                        </svg>
                        <p class="vote">${vote_average.toFixed(1) * 10}% </p>
                    </div>
                    <p class="duracion">${runtime}min </p>
                    <p class="date">${año}</p>
                
                </div>
                <div class="generosMovieDetail">
                    <h2 class="category-title">Categories</h2>
                    <div class="containerCategoriesMovieDetail">
                    </div>
                </div>
                <p class="description">${overview }</p>
            </div>
        </div>
        <h2 id="title-cast">Cast</h2>
        
        
        `

        containerDetailsMovie.appendChild(div)

        genres.forEach(genre =>{
            const {name,id} = genre
            console.log(name)
            const genero = document.createElement('a') 
            genero.classList.add('generoMovie')
            genero.textContent = name
            genero.href = `#category=${id}-${name}`
            const contenedorGeneros= document.querySelector('.containerCategoriesMovieDetail')
            contenedorGeneros.appendChild(genero)
            console.log(contenedorGeneros.innerHTML)
            
            
        })

        // ACTORES
        conexion(`movie/${id}/credits`).then((data)=>{

            const datosCast = data.cast

            const div = document.createElement('div')
            div.classList.add('container-cast')
            div.classList.add('snap')
            div.classList.add('carousel')

            containerDetailsMovie.appendChild(div)

            const containercast= document.querySelector('.container-cast')
            
            scroll(datosCast,containercast,'actor')

            
        })

        // TRAILER

        conexion(`movie/${id}/videos`).then((data)=>{
            const trailer = data.results
            
            if (trailer.length<=0){
                console.log('no hay trailer')
            }

            else{
                const div = document.createElement('div')
                div.classList.add('container-trailer')
                div.innerHTML = `
                <h2 id="title-trailer">Trailer</h2>
                <div class="trailer">
                    <iframe width="80%" height="500" src="https://www.youtube.com/embed/${trailer[0].key}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
                `
                containerDetailsMovie.appendChild(div)
            }

            
            
        })

        // Peliculas recomendadas

        conexion(`movie/${id}/recommendations`).then((data)=>{

            

            const div = document.createElement('div')
            div.classList.add('container-recomendadas')
            
            div.innerHTML = `
            <h2 id="title-recomendadas">Related Movies</h2>
            <div class="containerMoviesRelated containerMovies">
            </div>
            `
            containerDetailsMovie.appendChild(div)

            const containerRecomendadas = document.querySelector('.containerMoviesRelated')

            const peliculas = data.results
            // containerRecomendadas.innerHTML = ''
            peliculas.forEach(pelicula => {
                
                const {poster_path,id}= pelicula
        
                const url = `https://image.tmdb.org/t/p/w200${poster_path}`
                const div = document.createElement('div')
                div.classList.add('container-movie')
                div.innerHTML = `<img src="${url}" alt="Imagen ${id}" onclick="imgSeleccionada(${id})">`

                containerRecomendadas.appendChild(div)
                

            })

            

        })
    })
}





// Se encarga de hacer la estructura HTML de scroll de peliculas
async function scroll(data,container,tipo){

    container.innerHTML = ''

    if (tipo=='actor'){
        data.forEach(cast => {
                const {name, profile_path, id} = cast
                const url = `https://image.tmdb.org/t/p/w200${profile_path}`
                const divCast = document.createElement('div')
                divCast.classList.add('cast')
                divCast.classList.add('caroulsel')
                divCast.innerHTML = `
                <a  href="#profile=${id}"><img src="${url}" class="img-cast" alt="Imagen ${name}">
                `
                container.appendChild(divCast)
            })
    }

    else{

        const peliculas = data.results
        peliculas.forEach(pelicula => {
            const {poster_path, title, id} = pelicula
            const url = `https://image.tmdb.org/t/p/w200${poster_path}`


            const div = document.createElement('div')
            div.classList.add('caroulsel')
            // agregar el id a la pelicula
            div.setAttribute('id', id)
            div.innerHTML = `<img src="${url}" alt=" img ${title}" onclick="imgSeleccionada(${id})">` 

            container.appendChild(div)
        
        })
    }
    

}







