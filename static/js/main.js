import { slider} from "./slider.js";
import { EstructureInformationDetails,scroll } from "../utils/main.js";


export function categoryPage(){

    containerHome.classList.add("oculto")
    containerDetails.classList.add("oculto")
    containerCategoryMoviesAll.classList.remove('oculto')
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
    containerCategoryMoviesAll.classList.add('oculto')
    containerDetails.classList.remove("oculto")


    const tipo=location.hash.slice(1).toLocaleLowerCase().split('=')[0]
    const id = location.hash.slice(1).toLocaleLowerCase().split('=')[1]
    
    getDetails(id,tipo)
}

export function ProfilePage(){
    containerHome.classList.add("oculto")
    containerCategoryMoviesAll.classList.add('oculto')
    containerDetails.classList.add("oculto")
    // containerProfile.classList.remove("oculto")
    getProfile()
}


function getMoviesBycategory(){

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
            div.innerHTML = `<img src="${url}" alt="Imagen ${id}" onclick="imgSeleccionada(${id})">`
            containerCategoryMovies.appendChild(div)

        })

        
    })
}

function getMovieBySearch(){

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

function  getDetails(id,tipo){
    conexion(`${tipo}/${id}`).then((data)=>{
            EstructureInformationDetails(data,tipo)
        })
}
    
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
        scroll(data,containerTrendingTV,'tv')

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

function getProfile(){
    const url = location.hash.slice(1).toLocaleLowerCase().split('=')[1]
    const id = url.split('-')[0]
    /*usualmente un % seguido de dos números quieren decir que un string fue codificado para formar parte de un URI,
    por cuestiones de evitar caracteres raros.
    Se recomienda usar decodeURL para quitarlo */
    conexion(`person/${id}`).then((data)=>{

        let {name, biography, profile_path, birthday, place_of_birth,} = data
        console.log(data)

        if(biography === ''){
            biography = 'No hay información disponible'
        }
        if(birthday === null){
            birthday = ''
        }

        if(place_of_birth === null){
            place_of_birth = ''
        }


        const url = `https://image.tmdb.org/t/p/w200${profile_path}`
        const div = document.createElement('div')
        div.classList.add('profile')
        div.innerHTML = `
        <div class="container-profile">
            <div class="container-img-profile">
                <img src="${url}" alt="Imagen ${name}">
            </div>
            <div class="container-info-profile">
                <h2>${name}</h2>


                <p class="birth-profile" >${place_of_birth} ${birthday}</p>
                <p class="biography"></p>
                
                
            </div>
        </div>
        <div class="container-known-for">
            <h2>Known For</h2>
            <div class="container-known-for-movies containerMovies">
            </div>
        </div>
        `

        profileContainer.appendChild(div)
        
        document.querySelector('.biography').innerText = biography; // para que el texto tome los saltos de  linea
        
        // obtener las peliculas donde es participe la persona 
        conexion(`person/${id}/movie_credits`).then((data)=>{
            const movies = data.cast
            const containerMovies = document.querySelector('.container-known-for-movies')
            movies.forEach(movie => {
                const {title, poster_path, id} = movie
                const url = `https://image.tmdb.org/t/p/w200${poster_path}`
                const div = document.createElement('div')
                div.classList.add('container-movie')
                // div.classList.add('')
                div.innerHTML = `<img src="${url}" alt="Imagen ${id}" onclick="imgSeleccionada(${id})">`
                containerMovies.appendChild(div)
            })
        }
        )

    })

}











