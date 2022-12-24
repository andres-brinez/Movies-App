// Se encarga de hacer la estructura HTML de scroll  horzontal de peliculas
export function scroll(data,container,tipo){

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
export function EstructureInformationDetails(data,tipo){

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

    conexion(`${tipo}/${data.id}/recommendations`).then((data)=>{

        Recomend(data,tipo)

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

function Recomend(data,tipo){
    const div = document.createElement('div')
    div.classList.add('container-recomendadas')
        
    div.innerHTML = `
    <h2 id="title-recomendadas">Related Movies</h2>
    <div class="containerRelated containerMovies">
    </div>
    `
    containerDetails.appendChild(div)

    const containerRecomendadas = document.querySelector('.containerRelated')

    const peliculas = data.results
    
    peliculas.forEach(pelicula => {
        
        const {poster_path,id}= pelicula

        const url = `https://image.tmdb.org/t/p/w200${poster_path}`
        const div = document.createElement('div')
        div.classList.add('container-movie')
        div.innerHTML = `<img src="${url}" alt="Imagen ${id}" onclick="imgSeleccionada(${id},'${tipo}')">`

        containerRecomendadas.appendChild(div)
        

    })

}



