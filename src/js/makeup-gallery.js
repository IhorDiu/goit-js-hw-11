export default function CreateGallery(pictures) {
  return pictures
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
      <div class="gallery__card">
      <div class="gallery__thumb">
      <a href="${largeImageURL}">
      <img class="gallery__image"
        src="${webformatURL}"
        alt="${tags}"
        loading="lazy"
      /></a></div>
      <div class="info">
        <p class="info__item"><b>Likes</b><br />${likes}</p>
        <p class="info__item"><b>Views</b><br />${views}</p>
        <p class="info__item"><b>Comments</b><br />${comments}</p>
        <p class="info__item"><b>Downloads</b><br />${downloads}</p>
      </div>
    </div>`
    )
    .join('');
}
