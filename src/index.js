import PixabayApiService from './js/pixabay-service';
import CreateGallery from './js/makeup-gallery';

import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('#search-form'),
  makeupGallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  guard: document.querySelector('.guard'),
};

const optionsScroll = {
  root: null,
  rootMargin: '300px',
  threshold: 1.0,
};

const pixabayApiService = new PixabayApiService();
const observer = new IntersectionObserver(onLoadMoreBtn, optionsScroll);

refs.searchForm.addEventListener('submit', onSearch);

Notiflix.Notify.init({
  position: 'center-center',
  cssAnimationStyle: 'from-bottom',
});

function onSearch(e) {
  e.preventDefault();

  pixabayApiService.query = e.currentTarget.searchQuery.value.trim();
  
  pixabayApiService.resetPage();
  pixabayApiService
    .axiosArticles()
    .then(resp => {
      if (resp.data.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

      pixabayApiService.pictureArr = resp.data.hits;
      let sliderGallery = new SimpleLightbox('.gallery a', {
        captionsData: 'alt',
        captionDelay: 250,
      });
      refs.makeupGallery.insertAdjacentHTML(
        'beforeend',
        CreateGallery(pixabayApiService.pictureArr)
      );
      sliderGallery.refresh();
      observer.observe(refs.guard);
    })
    .catch(err => {
      console.log(err);
      Notiflix.Notify.failure('Something went wrong try again');
    });
}

function onLoadMoreBtn(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      pixabayApiService.updatePage();

      pixabayApiService
        .axiosArticles()
        .then(resp => {
          const maxAmountPages = Math.round(
            resp.data.totalHits / resp.data.hits.length
          );

          pixabayApiService.pictureArr = resp.data.hits;
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
