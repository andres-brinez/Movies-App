import { slider } from "./slider.js";

const  containerSlider= document .querySelector('.slideshow-container' );
const  containerTrending= document .querySelector('.snap' );


function getPopularMovies(){
    conexion('movie/popular').then((data) => {
        containerSlider.innerHTML = ''
        const peliculas = data.results
        
        
        console.log(peliculas)
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

function getMoviesTrending(){
    conexion('trending/movie/day').then((data) => {
        console.log(data)
        containerTrending.innerHTML = ''
        const peliculas = data.results
        peliculas.forEach(pelicula => {
            const {poster_path, title, id} = pelicula
            const url = `https://image.tmdb.org/t/p/w500${poster_path}`

            const div = document.createElement('div')
            div.classList.add('caroulsel')
            // agregar el id a la pelicula
            div.setAttribute('id', id)
            div.innerHTML = `<img src="${url}" alt="Imagen ${title}">` 

            containerTrending.appendChild(div)
        
        })

    })

}

getPopularMovies()
getMoviesTrending()
