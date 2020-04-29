(function () {

  const URL = 'https://movie-list.alphacamp.io'
  const index_URL = URL + '/api/v1/movies/'
  const poster_URL = URL + '/posters/'
  const data = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const dataPenal = document.getElementById('data-panel')
  const searchForm = document.getElementById('search')
  const searchInput = document.getElementById('search-input')


  displayMovies(data)


  dataPenal.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      showMovie(event.target.dataset.id)
    } else if (event.target.matches('.btn-delete')) {
      removeFavoriteItem(event.target.dataset.id)
    }
  })

  dataPenal.addEventListener('mouseover', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      event.target.style = " cursor: pointer;"
    }
  })

  function displayMovies(data) {
    let htmlContent = ''
    data.forEach(item => {
      htmlContent += `
      <div class="col-sm-3">
        <div class="card m-2">
          <h6 class="card-header">${item.title}</h6>
          <div class="card-body">
            <div data-toggle="modal" data-target="#show-movie-modal">
              <img class="btn-show-movie card-img-top" src="${poster_URL}${item.image}" data-id="${item.id}">
            </div>
            <div id="genres">
              <p class="card-text">${transformGenres(item.genres)}</p>
            </div>
            <!-- delete button -->
            <div class="row justify-content-center mt-3">
              <button class="btn btn-danger btn-delete" data-id="${item.id}">Delete</button>
            </div>       
          </div>
        </div>
      </div>`
    })
    dataPenal.innerHTML = htmlContent
    console.log(data)
  }

  function transformGenres(genresNumArray) {
    const genresType = {
      "1": "Action",
      "2": "Adventure",
      "3": "Animation",
      "4": "Comedy",
      "5": "Crime",
      "6": "Documentary",
      "7": "Drama",
      "8": "Family",
      "9": "Fantasy",
      "10": "History",
      "11": "Horror",
      "12": "Music",
      "13": "Mystery",
      "14": "Romance",
      "15": "Science Fiction",
      "16": "TV Movie",
      "17": "Thriller",
      "18": "War",
      "19": "Western"
    }
    let genresArray = []
    let genreHashtag = ''
    genresNumArray.forEach(e => {
      if (e.toString() === Object.keys(genresType)[e - 1]) {
        genresArray.push(genresType[e])
      }
    })
    genresArray.forEach(genre => {
      genreHashtag += `<a href="#" style="white-space:nowrap;">#${genre}</a>&nbsp;`
    })
    return genreHashtag
  }

  function showMovie(id) {
    // get elements
    const modalTitle = document.getElementById('show-movie-title')
    const modalImage = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')
    const url = index_URL + id
    // send request to show api
    axios.get(url).then(response => {
      const data = response.data.results
      // insert data into modal ui
      modalTitle.textContent = data.title
      modalImage.innerHTML = `<img src="${poster_URL}${data.image}" class="img-fluid" alt="Responsive image">`
      modalDate.textContent = `release at : ${data.release_date}`
      modalDescription.textContent = `${data.description}`
    })
  }

  function removeFavoriteItem(id) {
    const index = data.findIndex(item => item.id === Number(id))
    if (index === -1) return
    data.splice(index, 1)
    localStorage.setItem('favoriteMovies', JSON.stringify(data))
    displayMovies(data)
  }






})()