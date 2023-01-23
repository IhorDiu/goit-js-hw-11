import PixabayApiService from './js/pixabay-service';
import CreateGallery from './js/makeup-gallery';

import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('#search-form'),
  makeupGallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  cache: document.querySelector('.cache'),
};

const optionsScroll = {
  root: null,
  rootMargin: '300px',
  threshold: 1.0,
};

const pixabayApiService = new PixabayApiService();
const observer = new IntersectionObserver(loadMoreOnScroll, optionsScroll);

refs.searchForm.addEventListener('submit', onSearch);

Notiflix.Notify.init({
  className: 'notiflix-report',
  width: '320px',
  backgroundColor: '#f8f8f8',
  borderRadius: '25px',
  rtl: false,
  zindex: 4002,
  backOverlay: true,
  backOverlayColor: 'rgba(0,0,0,0.5)',
  backOverlayClickToClose: false,
  fontFamily: 'Quicksand',
  svgSize: '110px',
  plainText: true,
  titleFontSize: '16px',
  titleMaxLength: 34,
  messageFontSize: '13px',
  messageMaxLength: 400,
  buttonFontSize: '14px',
  buttonMaxLength: 34,
  cssAnimation: true,
  cssAnimationDuration: 260,
  position: 'center-center',
  cssAnimationStyle: 'from-bottom',
});

function onSearch(e) {
  e.preventDefault();

  pixabayApiService.query = e.currentTarget.searchQuery.value.trim();
  refs.makeupGallery.innerHTML = '';
  pixabayApiService.resetPage();
  pixabayApiService
    .axiosArticles()
    .then(response => {
      console.log(response);
      if (pixabayApiService.query === '') {
        Notiflix.Notify.failure(
          'Empty query. Please input something for search'
        );
        return;
      } 
      
      if (response.data.hits.length === 0) {
        return Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      
      pixabayApiService.pictureArr = response.data.hits;
      let sliderGallery = new SimpleLightbox('.gallery a', {
        captionsData: 'alt',
        captionDelay: 250,
      });
      refs.makeupGallery.insertAdjacentHTML(
        'beforeend',
        CreateGallery(pixabayApiService.pictureArr)
      );
      sliderGallery.refresh();
      observer.observe(refs.cache);
    })
    .catch(err => {
      console.log(err);
      Notiflix.Notify.failure('Something went wrong try again');
    });
}

function loadMoreOnScroll(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      pixabayApiService.updatePage();
      pixabayApiService
        .axiosArticles()
        .then(response => {
          const maxAmountPages = Math.round(
            response.data.totalHits / response.data.hits.length
          );
          pixabayApiService.pictureArr = response.data.hits;
          if (pixabayApiService.page === maxAmountPages) {
            Notiflix.Notify.info('You have reached the end of search results.');
            return;
          }
          refs.makeupGallery.insertAdjacentHTML(
            'beforeend',
            CreateGallery(pixabayApiService.pictureArr)
          );
        })
        .catch(err => {
          console.log(err);
          Notiflix.Notify.failure(
            'Something went wrong can not load more pictures, try again'
          );
        });
    }
  });
}
