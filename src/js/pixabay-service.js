import axios from 'axios';
// axios.defaults.baseURL = 
// 'https://pixabay.com/api/?key=33035024-2fcf940a53cdfcd459b8f09ea&image_type=photo&orientation=horizontal&safesearch=true';


export default class PixabayApiService {
     constructor() {
        this.searchQuery = '';
        this.page = 1;
        this.pictureArr = [];
     }

     async  axiosArticles () {
  console.log(this.searchQuery);

        const options = {
            params: {
              key: '33035024-2fcf940a53cdfcd459b8f09ea',
              q: this.searchQuery,
              image_type: 'photo',
              orientation: 'horizontal',
              safesearch: 'true',
            //   page: pages,
              per_page: 40,
            },
          };
          const BASE_URL =
          `https://pixabay.com/api/`;
        

          const response = await axios.get(BASE_URL, options);
          return response
          
     }

     get query () {
        return this.searchQuery;
     }

     set query (newQuery) {
        this.searchQuery = newQuery;
     }

     updatePage() {
        this.page += 1;
      }
      resetPage() {
        this.page = 1;
      }
    }