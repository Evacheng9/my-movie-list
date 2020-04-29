(function () {
  const URL = 'https://movie-list.alphacamp.io'
  const index_URL = URL + '/api/v1/movies/'
  const poster_URL = URL + '/posters/'
  const data = []
  const dataPanel = document.getElementById('data-panel')
  const searchForm = document.getElementById('search')
  const searchInput = document.getElementById('search-input')
  const pagination = document.getElementById('pagination')
  const itemPerPage = 12
  let paginationData = []
  const modeChange = document.getElementById('mode')
  let mode = true
  let pageNum = 1

  axios.get(index_URL).then((response) => {
    response.data.results.forEach(item => {
      data.push(item)
    })
    getTotalPages(data)
    getPageData(pageNum, data)
  }).catch((err) => { console.log(err) })

  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      showMovie(event.target.dataset.id)
    } else if (event.target.matches('.btn-add-favorite')) {
      addFavoriteItem(event.target.dataset.id)
    }
  })

  dataPanel.addEventListener('mouseover', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      event.target.style = " cursor: pointer;"
    }
  })

  searchForm.addEventListener('submit', event => {
    event.preventDefault()
    let input = searchInput.value.toLowerCase()
    let results = data.filter(movie => movie.title.toLowerCase().includes(input))
    getTotalPages(results)
    getPageData(pageNum, results)
    searchInput.value = ""
  })

  pagination.addEventListener('click', e => {
    // console.log(e.target.dataset.page)
    if (e.target.tagName === 'A') {
      getPageData(e.target.dataset.page)
    }
    pageNum = event.target.dataset.page
  })

  modeChange.addEventListener('click', event => {
    // console.log(pageNum)
    if (event.target.matches('.img-mode')) {
      mode = true
      getTotalPages(data)
      getPageData(pageNum, data)
    } else if (event.target.matches('.list-mode')) {
      mode = false
      getTotalPages(data)
      getPageData(pageNum, data)
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
            <!-- favorite button --> 
            <div class="row justify-content-center mt-3">
              <button class="btn btn-primary btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      </div>`
    })
    dataPanel.innerHTML = htmlContent
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

  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = data.find(item => item.id === Number(id))
    if (list.some(item => item.id === Number(id))) {
      alert(`${movie.title} is already in the favorite list!`)
    } else {
      list.push(movie)
      console.log(movie)
      alert(`${movie.title} was added!`)
      localStorage.setItem('favoriteMovies', JSON.stringify(list))
    }
  }

  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / itemPerPage) || 1
    let pageContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageContent
  }

  function getPageData(pageNum, data) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * itemPerPage
    let pageData = paginationData.slice(offset, offset + itemPerPage)
    //判斷分頁模式
    if (mode) {
      displayMovies(pageData)
    } else if (!mode) {
      showListMode(pageData)
    }
  }

  //show list mode
  function showListMode(data) {
    let htmlContent = ''
    data.forEach(function (item, index) {
      htmlContent += `
        <div class="row col-12 justify-content-between m-2" id="list">
          <div>${item.title}</div>
          <div class="row justify-content-around">
            <div class="ml-2 mr-2">    
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
            </div>
            <div>  
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>`
    })
    dataPanel.innerHTML = htmlContent
  }



})()