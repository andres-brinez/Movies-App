import { slider } from "./slider.js";


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
    containerDetailsMovie.classList.add("oculto")
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
    

function EstructureInformationDetails(data,tipo){

    let datos={
            'name': '',
            'tagline':'',
            'first_air_date': '',
            'duracion':'',    
    }


    if (tipo=='tv'){

        const [año, _] = data.first_air_date.split('-'); // divide la fecha por - y obtiene el primero parametro que es el año
        
        datos.name=data.name
        datos.tagline=data.last_episode_to_air.overview
        datos.first_air_date= año
        datos.duracion=data.last_episode_to_air.runtime
        
    }

    else if (tipo=='movie'){
        
        const [año, _] = data.release_date.split('-'); // divide la fecha por - y obtiene el primero parametro que es el año

        datos.name=data.title
        datos.tagline=data.tagline
        datos.first_air_date= año
        datos.duracion=data.runtime

    }


    
    const url = `https://image.tmdb.org/t/p/w500${data.poster_path}`

    const div = document.createElement('div')
    div.innerHTML = `
            <div class="information-main">
                <div class="img-poster">
                    <img src="${url}" alt="Imagen ${datos.name}">
                </div>
                <div class="information">
                    <h2 class="title-detail">${datos.name}</h2>
                    <p class="tagline">${datos.tagline}</p>
                    <div class="details"> 
                        <div class="details_votes">
                            <svg width="28" height="20" viewBox="0 0 32 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 0L19.5922 11.0557H31.2169L21.8123 17.8885L25.4046 28.9443L16 22.1115L6.59544 28.9443L10.1877 17.8885L0.783095 11.0557H12.4078L16 0Z" fill="#E13C2F"/>
                            </svg>
                            <p class="vote">${data.vote_average.toFixed(1) * 10}% </p>
                        </div>
                        <p class="duracion">${datos.duracion} min </p>
                        <p class="date">${datos.first_air_date}</p>
                    
                    </div>
                    <div class="generosMovieDetail">
                        <h2 class="category-title">Categories</h2>
                        <div class="containerCategoriesMovieDetail">
                        </div>
                    </div>
                    <p class="description">${data.overview }</p>
                </div>
            </div>`

    containerDetails.innerHTML = ''
    containerDetails.appendChild(div)


    // Recorre los generos y  los muestra
    data.genres.forEach(genre =>{
        const {name,id} = genre
        const genero = document.createElement('a') 
        genero.classList.add('genero')
        genero.textContent = name
        genero.href = `#category=${id}-${name}`
        const contenedorGeneros= document.querySelector('.containerCategoriesMovieDetail')
        contenedorGeneros.appendChild(genero)
        
    })

    conexion(`${tipo}/${data.id}/credits`).then((data)=>{
            DetailsCast(data)
    })
    conexion(`${tipo}/${data.id}/videos`).then((data)=>{
            Trailer(data)
    })
    

}

function DetailsCast (data){

    const datosCast = data.cast

        if (datosCast.length<=0){
            console.log('no hay actores')
        }

        else{

            const divCarousel = document.createElement('div')
            const divCast= document.createElement('div')

            divCast.classList.add('container-cast')
            divCarousel.classList.add('snap')
            divCarousel.classList.add('carousel')

            // Agrega titulo al container
            const title= document.createElement('h2')
            title.textContent='Actors'
            title.classList.add('title-cast')
            divCast.appendChild(title)
            

            containerDetails.appendChild(divCast)
            divCast.appendChild(divCarousel)

            scroll(datosCast,divCarousel,'actor')
        }
}

function Trailer(data){

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
            containerDetails.appendChild(div)
        }

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



// Se encarga de hacer la estructura HTML de scroll  horzontal de peliculas
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
            div.innerHTML = `<img src="${url}" alt=" img ${title}" onclick="imgSeleccionada(${id},'${tipo}')">` 
            container.appendChild(div)
        
        })
    }
    

}







