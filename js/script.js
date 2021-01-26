//const apiKey = '04c35731a5ee918f014970082a0088b1';
let i = 1;

const input = document.querySelector('.search-input');
const images = document.getElementsByTagName('img');
const moviesContainer = document.querySelector('.movies-container');
const prev = document.querySelector('.previous');
const next = document.querySelector('.next');
const form = document.querySelector('.search-box');
const home = document.querySelector('.home');

const detailsUrlBeforeId = `https://api.themoviedb.org/3/movie/`;
// between them we put ID
const movieDetails = `?api_key=04c35731a5ee918f014970082a0088b1`;
// between them we put ID
const castAndCrew = `/credits?api_key=04c35731a5ee918f014970082a0088b1&language=en-US`;

const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=04c35731a5ee918f014970082a0088b1&query=`;
const apiUrl = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=`;
const imgUrl = 'https://image.tmdb.org/t/p/w1280';

/**RENDER MOVIES IN THE MAIN PAGE */
async function getMovies(){
    prev.disabled = true;
    const resp = await fetch(`${apiUrl}+i`);
    const resJ = await resp.json();
    for(let movie of resJ.results){
        const markup = `
            <div class="movie">
                <img onclick = "viewMovie(${movie.id})" id="${movie.id}" src="${imgUrl+ movie.poster_path}" alt="${movie.title}">
                <div class="info">
                    <h4>${movie.title}</h4>
                    <span><i class="star fas fa-star"></i>${movie.vote_average}</span>
                </div>
            </div>
        `;
        moviesContainer.insertAdjacentHTML('beforeend', markup);
    }  
}
getMovies();

/**SEARCH BY NAME OF MOVIE FUNCTION */
async function Search(query){
    if(query && query !='Search Movies ..'){
        const children = [].slice.call(moviesContainer.getElementsByClassName('movie'),0);
        for(let child of children){
            child.style.display = 'none';
        }
        prev.disabled = true;
        next.disabled = true;
        const resp = await fetch(`${searchUrl}${query}`);
        const resJ = await resp.json();
        for(let movie of resJ.results){
            const markup = `
            <div class="movie">
                <img onclick = "viewMovie(${movie.id})" id="${movie.id}" src="${imgUrl+ movie.poster_path}" alt="${movie.title}">
                <div class="info">
                    <h4>${movie.title}</h4>
                    <span><i class="star fas fa-star"></i>${movie.vote_average}</span>
                </div>
            </div>
            `;
            moviesContainer.insertAdjacentHTML('beforeend', markup);
        }  
    }else{
        console.log('error');
    }
    clearValue();
}

form.addEventListener('submit', e => {
    e.preventDefault();
    Search(input.value);
})


/**VIEW MOVIE DETAILES AFTER CLICKING ON THE POSTER */
async function viewMovie(id){
    const resp = await fetch(`${detailsUrlBeforeId}${id}${movieDetails}`);
    const resJ = await resp.json();
    const castp = await fetch(`${detailsUrlBeforeId}${id}${castAndCrew}`);
    const castJ = await castp.json();
    let gen = [];
    for(let g of resJ.genres){
        gen.push(g.name);
    }
    const markup = `
    <div class="card">
        <div class="card-left">
            <img id="${resJ.id}" src="${imgUrl+ resJ.poster_path}" alt="${resJ.title}">
        </div>
        <div class="card-right">
            <h1>${resJ.title}</h1>
            <span><i class="star fas fa-star"></i>${resJ.vote_average}</span>
            <div class="card_right__details">
                <ul>
                    <li>${resJ.release_date}</li>
                    <li>${resJ.runtime} Minutes</li>
                    <li>${gen.join(', ')}</li>
                </ul>
            </div>
            <div class="card-right-review">
                <p>${resJ.overview}</p>
                <a href="${resJ.homepage}">Read more</a>
            </div>
        </div>
        <div class="back">
                <button type="button" class="back-btn" onclick="goHome()">Back</button>
        </div>
    </div>
    `;
    moviesContainer.style.display = 'none';
    form.style.display = 'none';
    prev.style.display = 'none';
    next.style.display = 'none';
    moviesContainer.insertAdjacentHTML('afterend', markup);
    window.scrollTo(0, 0);
}




/**GO TO THE NEXT PAGE AND RENDER IT WHEN NEXT BUTTON CLICKED */
async function goNext(){
    prev.disabled = false;
    next.style.outline = 'none';
    if(i<=500){
        const children = [].slice.call(moviesContainer.getElementsByClassName('movie'),0);
        for(let child of children){
            child.style.display = 'none';
        }
        i++;
        const resp = await fetch(`${apiUrl}${i}`);
        const resJ = await resp.json();
        for(let movie of resJ.results){
            const markup = `
                <div class="movie">
                    <img onclick = "viewMovie(${movie.id})" id="${movie.id}" src="${imgUrl+ movie.poster_path}" alt="${movie.title}">
                    <div class="info">
                        <h4>${movie.title}</h4>
                        <span><i class=" star fas fa-star"></i>${movie.vote_average}</span>
                    </div>
                </div>
            `;
            moviesContainer.insertAdjacentHTML('beforeend', markup);
            window.scrollTo(0, 0);
        }
    }else{
        next.disabled = false;
    } 
}

/**GO TO THE PREVIOUS PAGE AND RENDER IT WHEN PREVIOUS BUTTON CLICKED */
async function goBack(){
    prev.style.outline = 'none';
    if(i>1){
        prev.disabled = false;
        const children = [].slice.call(moviesContainer.getElementsByClassName('movie'),0);
        for(let child of children){
            child.style.display = 'none';
        }
        i--;
        const resp = await fetch(`${apiUrl}${i}`);
        const resJ = await resp.json();
        for(let movie of resJ.results){
            const markup = `
                <div class="movie">
                    <img onclick = "viewMovie(${movie.id})" id="${movie.id}" src="${imgUrl+ movie.poster_path}" alt="${movie.title}">
                    <div class="info">
                        <h4>${movie.title}</h4>
                        <span><i class="star fas fa-star"></i>${movie.vote_average}</span>
                    </div>
                </div>
            `;
            moviesContainer.insertAdjacentHTML('beforeend', markup);
            window.scrollTo(0, 0);
        }
        if(i == 1){
            prev.disabled = true;
        }
    }
}

/**CLEAR INPUT WHEN USER FOCUS ON INPUT FIELD */
function clearValue(){
    input.value = '';
}

/**RESET INPUT WHEN USER BLUR ON INPUT FIELD */
function setValue(){
    input.value = 'Search Movies ..';
}

/**BACK TO HOMEPAGE */
function goHome(){
    location.reload();
}
