import { defineStore } from 'pinia'
import { http } from '../api/http'
import { sortTorrentsByQuality, excludeUHD } from './torrentUtility'



export interface MovieSearchResult {
  release_date(release_date: any): unknown
  vote_average: any
  poster_path: any
  id: string
  title: string
  poster: string
  year: string
  rate: string
}

export interface TorrentFile {
  name: string
  length: number
}

export interface TorrentSearchResult {
  title: string
  magnet: string
  torrentUrl: string
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


export interface BannerMovie {
  id: string
  title: string
  year: string
  rate: string
  backdrop: string
}

export interface FlashNewsSpotlight {
  id: string
  title: string
  year: string
  rate: string
  frames: string[]
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
  popularMovies: MovieSearchResult[]
    isLoadingPopular: boolean

  searchTerm: string
  searchResults: MovieSearchResult[]
  isSearching: boolean
  searchError: string | null
  hasSearched: boolean

  currentMovie: MovieDetails | null
  isLoading: boolean
  movieError: string | null


  bannerMovie: BannerMovie | null,
isLoadingBanner: boolean,

flashNewsMovie: FlashNewsSpotlight | null,
isLoadingFlashNews: boolean,

  activeMagnet: string | null
  torrentFiles: TorrentFile[]
  isTorrentLoading: boolean
  torrentError: string | null
}

export const useMovieStore = defineStore('movies', {
  state: (): MovieState => ({
    searchTerm: '',
    searchResults: [],
    isSearching: false,
    searchError: null,
    hasSearched: false,
    popularMovies: [],
isLoadingPopular: false,

bannerMovie: null,
isLoadingBanner: false,

flashNewsMovie: null,
isLoadingFlashNews: false,


    currentMovie: null,
    isLoading: false,
    movieError: null,

    activeMagnet: null,
    torrentFiles: [],
    isTorrentLoading: false,
    torrentError: null
  }),

  actions: {
    async searchMovies(term: string) {
      const query = term.trim()
      this.searchTerm = query

      if (!query) {
        this.searchResults = []
        this.hasSearched = false
        return
      }

      this.isSearching = true
      this.searchError = null

      try {
        const { data } = await http.get<MovieSearchResult[]>('/movies/imdb-search', {
          params: { searchTerm: query }
        })
        this.searchResults = data
      } catch (error) {
        this.searchError = 'Не удалось выполнить поиск. Попробуйте еще раз!'
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
        const { data } = await http.get<MovieDetails>(`/movies/imdb/${id}`)
        this.currentMovie = data
      } catch (error) {
        this.movieError = 'Не удалось загрузить информацию о фильме.'
      } finally {
        this.isLoading = false
      }
    },


    async fetchPopularMovies() {
     this.isLoadingPopular = true 
     try {
      const {data} = await http.get<MovieSearchResult[]>('/movies/popular')
      this.popularMovies = data
     } catch (error) {
      console.error('Не удалось загрузить популярные фильмы:', error)
    this.popularMovies = []
     } finally {
      this.isLoadingPopular = false
     }
    },


    async fetchBannerMovie() {
  this.isLoadingBanner = true
  try {
    const { data } = await http.get<BannerMovie>('/movies/banner')
    this.bannerMovie = data
  } catch (error) {
    console.error('Не удалось загрузить баннер:', error)
    this.bannerMovie = null
  } finally {
    this.isLoadingBanner = false
  }
},


async fetchFlashNews() {
  this.isLoadingFlashNews = true
  try {
    const { data } = await http.get<FlashNewsSpotlight>('/movies/flash-news')
    this.flashNewsMovie = data
  } catch (error) {
    console.error('Не удалось загрузить flash news:', error)
    this.flashNewsMovie = null
  } finally {
    this.isLoadingFlashNews = false
  }
},

    
async findTorrentsForMovie(title: string, originalTitle: string, year?: string): Promise<TorrentSearchResult[]> {
  try {
    const { data } = await http.get<TorrentSearchResult[]>('/movies/search', {
      params: {
        searchTerm: originalTitle || title,
        title,
        originalTitle,
        year
      }
    })

    return data ?? []
  } catch (error) {
    console.error('Ошибка поиска торрентов:', error)
    return []
  }
},

async findWorkingStream(torrents: TorrentSearchResult[], maxAttempts = 3): Promise<string> {
  this.isTorrentLoading = true
  this.torrentError = null


  const filtered = excludeUHD(torrents)
  const sorted = sortTorrentsByQuality(filtered.length > 0 ? filtered : torrents)

  const candidates = sorted.slice(0, maxAttempts)

  for (let i = 0; i < candidates.length; i++) {
    const torrent = candidates[i]
    if (!torrent.magnet) continue

    try {
      const streamUrl = await this.initTorrentStream(torrent.magnet)
      this.isTorrentLoading = false
      return streamUrl 
    } catch (err) {
      console.warn(`Раздача ${i + 1}/${candidates.length} не сработала:`, torrent.title)
      continue
    }
  }

  this.isTorrentLoading = false
  this.torrentError = 'Не удалось найти рабочую раздачу среди доступных вариантов.'
  throw new Error(this.torrentError)
},

   async initTorrentStream(magnet: string): Promise<string> {
  this.isTorrentLoading = true
  this.torrentError = null
  this.activeMagnet = magnet

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 20000) // 20 сек на попытку

  try {
    const safeMagnet = encodeURIComponent(magnet)
    const response = await http.get(`/stream/add/${safeMagnet}`, {
      signal: controller.signal
    })
    clearTimeout(timeoutId)

    const files = response.data
    if (!files || files.length === 0) {
      throw new Error('В этой раздаче не найдено подходящих файлов.')
    }

    let videoFile = files
      .filter((f: any) => /\.mp4$/i.test(f.name))
      .sort((a: any, b: any) => b.length - a.length)[0]

    if (!videoFile) {
      videoFile = files
        .filter((f: any) => /\.(mkv|mp4|avi)$/i.test(f.name))
        .sort((a: any, b: any) => b.length - a.length)[0]
    }

    if (!videoFile) {
      throw new Error('В раздаче не найден видеофайл.')
    }

    this.torrentFiles = files

    const safeFileName = encodeURIComponent(videoFile.name)
    return `http://localhost:5000/stream/${safeMagnet}/${safeFileName}`
  } catch (err: any) {
    clearTimeout(timeoutId)
    const message = err.name === 'CanceledError' || err.name === 'AbortError'
      ? 'Раздача не отвечает (таймаут).'
      : (err.response?.data?.message || err.message || 'Ошибка инициализации стрима')
    this.torrentError = message
    throw new Error(message)
  } finally {
    this.isTorrentLoading = false
  }
},

    async stopTorrentStream() {
      if (!this.activeMagnet) return

      try {
        const safeMagnet = encodeURIComponent(this.activeMagnet)
        await http.delete(`/stream/remove/${safeMagnet}`)
      } catch (error) {
        console.error('Не удалось удалить торрент из памяти:', error)
      } finally {
        this.activeMagnet = null
        this.torrentFiles = []
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