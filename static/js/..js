conexion(`movie/${id}`).then((data) =>{

    

    // ACTORES
    conexion(`movie/${id}/credits`).then((data)=>{

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
            

            containerDetailsMovie.appendChild(divCast)
            divCast.appendChild(divCarousel)

            scroll(datosCast,divCarousel,'actor')
        }

        
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