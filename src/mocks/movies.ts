import {defineStore} from 'pinia'
import {http} from '../api/http'


export interface MovieSearchResult {
  id: string
  title: string
  poster: string
  year: string
  rate: string
}


export interface CastMember {
  name: string
  character: string
  photo: string
}

export interface ProductionCompanyInfo {
  name: string
  logo: string
}

export interface MovieDetails {
  title: string
  originalTitle?: string
  tagline?: string
  plot: string
  year: string
  director: string
  actors: CastMember[]
  poster: string
  backdrop: string
  trailer: string
  boxOffice: string
  budget?: string
  released: string
  writer: string
  runtime: string
  ratingImdb: string
  voteCount?: number
  status?: string
  imdbId: string
  rated: string
  genres: string[]
  productionCompanies?: ProductionCompanyInfo[]
  spokenLanguages?: string[]
}


interface MovieState {
  searchTerm: string;
  searchResults: MovieSearchResult[]
  isSearching: boolean
  searchError: string | null
  hasSearched: boolean

  currentMovie: MovieDetails | null
  isLoading: boolean
  movieError: string | null
}

export const useMovieStore = defineStore('movies', {
  state: (): MovieState => ({
    searchTerm: '',
    searchResults: [],
    isSearching: false,
    searchError: null,
    hasSearched: false,

    currentMovie: null,
    isLoading: false,
    movieError: null
  }),

  actions: {
    async searchMovies(term: string) {
      const query = term.trim()
      this.searchTerm = query

      if(!query) {
        this.searchResults = []
        this.hasSearched = false
        return
      }

      this.isSearching = true
      this.searchError = null


      try {
        const {data} = await http.get<MovieSearchResult[]>('/movies/imdb-search', {
          params: {searchTerm: query}
        })

        this.searchResults = data
      } catch (error) {
        this.searchError = 'Не Удалось Выполнить Поиск. Попробуйте еще раз!'
        this.searchResults = []
      } finally {
        this.isSearching = false
        this.hasSearched = true
      }
    },


    async fetchMovie(id: string) {
      this.isLoading = true
      this.movieError = null
      this.currentMovie = null
      

      try {
        const {data} = await http.get<MovieDetails>(`/movies/imdb/${id}`)
        this.currentMovie = data
      } catch (error) {
        this.movieError = 'Не Удалось Загрузить Информацию о Фильме.'
        
      } finally {
        this.isLoading = false
      }
    },


    clearSearch() {
      this.searchTerm = ''
      this.searchResults = []
      this.searchError = null
      this.hasSearched = false
    }
  }
})