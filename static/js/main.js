// import { slider} from "../utils/slider.js";
// import { EstructureInformationDetails,scroll,ImagenesSeguidas } from "../utils/main.js";


// export function categoryPage(){

//     containerHome.classList.add("oculto")
//     containerDetails.classList.add("oculto")
//     containerCategoryMoviesAll.classList.remove('oculto')
//     getMoviesBycategory()
// }

// export function MoviePage(){
//     containerHome.classList.remove("see")
//     profileContainer.classList.add('oculto')

//     getMovieBySearch()

// }




// export function ProfilePage(){
//     containerHome.classList.add("oculto")
//     containerCategoryMoviesAll.classList.add('oculto')
//     containerDetails.classList.add("oculto")
//     profileContainer.classList.remove('oculto')

//     // containerProfile.classList.remove("oculto")
//     getProfile()
// }


// export function SeriesPage(){

//     containerHome.classList.add("oculto")
//     containerDetails.classList.add("oculto")
//     containerCategoryMoviesAll.classList.remove('oculto')
//     getTVPopular()
// }


// export function PersonPage(){

//     containerHome.classList.add("oculto")
//     containerDetails.classList.add("oculto")
//     containerCategoryMoviesAll.classList.remove('oculto')
//     getPersons()
// }

// function getMoviesBycategory(){

   
//         const url = location.hash.slice(1).toLocaleLowerCase().split('=')[1]
//         const id = url.split('-')[0]
//         /*usualmente un % seguido de dos números quieren decir que un string fue codificado para formar parte de un URI,
//         por cuestiones de evitar caracteres raros.
//         Se recomienda usar decodeURL para quitarlo */
//         let name = decodeURI(url.split('-')[1])
//         console.log(name)
//         const Name= name.charAt(0).toUpperCase() + name.slice(1);  // pone en mayuscula la  primera letra

//         conexion(`discover/movie?with_genres=${id}`).then((data) => {
//             ImagenesSeguidas(data)
//         })

        
//         cointainerTitle.innerHTML = `<h2>${Name}</h2>`
    
    

    
// }

// function getTVPopular(){
//     containerCategoryMovies.innerHTML = ''
//     cointainerTitle.innerHTML = `<h2> Series TV</h2>`
//     // conexion(`tv/popular`).then((data) => {
//     //     ImagenesSeguidas(data,'tv')
//     // })

//     for (let i = 1; i < 100; i++){
//         conexion(`tv/popular?page=${i}`).then((data) => {
//             ImagenesSeguidas(data,'tv')
            
//         })
//     }      
// }

// function getPersons(){
//     profileContainer.innerHTML = ''
//     cointainerTitle.innerHTML = `<h2> Featured actors </h2>`
//     containerCategoryMovies.innerHTML = ''


//     for (let i = 1; i < 200; i++){
//         conexion(`/person/popular?page=${i}`).then((data) => {
//             showPerson(data)
            
//         })      
//     }

//     function showPerson(data){
//         data.results.forEach(persona => {
            
//             const {profile_path,id,name}= persona

//             const url = `https://image.tmdb.org/t/p/w200${profile_path}`
//             const div = document.createElement('div')
//             div.classList.add('container-movie')
//             div.innerHTML = `<a  href="#profile=${id}"><img src="${url}" class="img-cast" alt="Imagen ${name}">`
//             containerCategoryMovies.appendChild(div)

//         })

//     }
// }

//


    
// function getPopularMovies(){
//     conexion('movie/popular').then((data) => {
//         containerSlider.innerHTML = ''
//         const peliculas = data.results
            
//         peliculas.forEach(pelicula => {
//             const {poster_path, title, id} = pelicula
//             const url = `https://image.tmdb.org/t/p/w500${poster_path}`

//             const div = document.createElement('div')
//             div.classList.add('mySlides')
//             div.classList.add('fade')
//             div.innerHTML = `
//                 <img src="${url}" class="slider-img" alt="img ${id}" onclick="imgSeleccionada(${id})" >
//             `            
//             containerSlider.appendChild(div)
        
                
//         });

//         const controller=`
//         <a class="prev">&#10094;</a>
//         <a class="next">&#10095;</a>
//         `
//         containerSlider.insertAdjacentHTML('beforeend', controller)

//         const prevIcon = document.getElementsByClassName('prev')[0];
//         const nextIcon = document.getElementsByClassName('next')[0];
        
//         slider(prevIcon, nextIcon)

//     })
    
    
    
// }




// function getProfile(){
//     const url = location.hash.slice(1).toLocaleLowerCase().split('=')[1]
//     const id = url.split('-')[0]
//     /*usualmente un % seguido de dos números quieren decir que un string fue codificado para formar parte de un URI,
//     por cuestiones de evitar caracteres raros.
//     Se recomienda usar decodeURL para quitarlo */
//     conexion(`person/${id}`).then((data)=>{

//         let YearNacimiento=''

//         let {name, biography, profile_path, birthday, place_of_birth,} = data

//         if (data.birthday==null){
//             birthday=''
//         }
//         else{
//             const [Nacimiento, _] = data.birthday.split('-'); // divide la fecha por - y obtiene el primero parametro que es el año
//             YearNacimiento = Nacimiento
//         }

//         if(biography === ''){
//             biography = 'No hay información disponible'
//         }
//         if(birthday === null ){
//             birthday = ''
//         }

//         if(place_of_birth === null){
//             place_of_birth = ''

//         }


//         const url = `https://image.tmdb.org/t/p/w200${profile_path}`
//         const div = document.createElement('div')
//         div.classList.add('profile')
//         div.innerHTML = `
//         <div class="container-profile">
//             <div class="container-img-profile">
//                 <img onerror="this.src='https://cdn-icons-png.flaticon.com/512/4380/4380656.png';" src="${url}" alt="Imagen ${name}">
//             </div>
//             <div class="container-info-profile">
//                 <h2>${name}</h2>

//                 <p class="birth-profile" >${place_of_birth} ${YearNacimiento}</p>
//                 <p class="biography"></p>
                
                
//             </div>
//         </div>
//         <div class="container-known-for">
//             <h2>Known For</h2>
//             <div class="container-known-for-movies containerMovies">
//             </div>
//         </div>
//         `
//         profileContainer.innerHTML = ''
//         profileContainer.appendChild(div)
        
//         document.querySelector('.biography').innerText = biography; // para que el texto tome los saltos de  linea
        
//         // obtener las peliculas donde es participe la persona 
//         conexion(`person/${id}/movie_credits`).then((data)=>{
//             const movies = data.cast
//             const containerMovies = document.querySelector('.container-known-for-movies')
//             movies.forEach(movie => {
//                 const {title, poster_path, id} = movie
//                 const url = `https://image.tmdb.org/t/p/w200${poster_path}`
//                 const div = document.createElement('div')
//                 div.classList.add('container-movie')
//                 // div.classList.add('')
//                 div.innerHTML = `<img src="${url}"  onerror="this.src='https://cdn-icons-png.flaticon.com/512/4380/4380656.png';"  alt="Imagen ${title} " onclick="imgSeleccionada(${id})">`
//                 containerMovies.appendChild(div)
//             })
//         }
//         )

//     })

// }











