import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onSearch);
refs.form.querySelector('input');
refs.loadMore.style.display = 'none';

let pages = 1;

let isVisible = 0;

const gallerySimpleLightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

function onSearch(evt) {
  evt.preventDefault();

  isVisible = 0;

  refs.gallery.innerHTML = '';

  const name = refs.form.querySelector('input').value.trim();
  console.log(name);
  if (name !== '') {
    pixabayAPI(name);
    refs.loadMore.style.display = 'flex';
  } else {
    refs.loadMore.style.display = 'none';
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

async function pixabayAPI(name, pages) {
  const BASE_URL = 'https://pixabay.com/api/';

  const options = {
    params: {
      key: '32996864-5f1a960915a219f7f2c6f1a79',
      q: name,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: pages,
      per_page: 40,
    },
  };

  try {
    const response = await axios.get(BASE_URL, options);

    isVisible += response.data.hits.length;

    console.log(isVisible);
    if (!response.data.hits.length) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    if (response.data.hits.length >= isVisible) {
      refs.loadMore.style.display = 'flex';
      Notiflix.Notify.success(
        `Hooray! We found ${response.data.total} images.`
      );
    }

    if (isVisible >= response.data.total) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      refs.loadMore.style.display = 'none';
    }

    createMarkup(response.data);
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
}

function createMarkup(images) {
  console.log(images);
  const markup = images.hits
    .map(
      image =>
        `<a class="photo-link" href="${image.largeImageURL}">
            <div class="photo-card">
            <div class="photo">
            <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy"/>
            </div>
                    <div class="info">
                    <p class="info-item">
                            <b>Likes</b>
                            ${image.likes}
                        </p>
                        <p class="info-item">
                            <b>Views</b>
                            ${image.views}
                        </p>
                        <p class="info-item">
                            <b>Comments</b>
                            ${image.comments}
                        </p>
                        <p class="info-item">
                            <b>Downloads</b>
                            ${image.downloads}
                        </p>
                    </div>
            </div>
        </a>`
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  gallerySimpleLightbox.refresh();
}

refs.loadMore.addEventListener('click', onLoadMore);


function onLoadMore() {
  pages += 1;
  const name = refs.form.querySelector('input').value.trim();
  pixabayAPI(name, pages);
  refs.loadMore.style.display = 'flex';
}
