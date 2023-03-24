import { fetchImages } from './js/fetch-img';
import { getGallery } from './js/gallery';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const btnMore = document.querySelector('.load-more');

searchForm.addEventListener('submit', onSearchForm);
btnMore.addEventListener('click', onLoadMoreBtn);

let query = '';
let page = 1;
let simpleLightBox;
const perPage = 40;
btnMore.classList.add('is-hidden');

function onSearchForm(e) {
  e.preventDefault();
  page = 1;
  query = e.currentTarget.searchQuery.value.trim();
  gallery.innerHTML = '';

  if (query === '') {
    alertNoEmptySearch();
    btnMore.classList.add('is-hidden');
    return;
  }
  // console.log('searchStart');
  fetchImages(query, page, perPage)
    .then(({ data }) => {
      if (data.totalHits === 0) {
        alertNoImagesFound();
      } else {
        getGallery(data.hits);

        simpleLightBox = new SimpleLightbox('.gallery a').refresh();
        alertImagesFound(data);

        if (data.totalHits > perPage) {
          btnMore.classList.remove('is-hidden');
        }
      }
    })
    .catch(error => console.log(error))
    .finally(() => {
      searchForm.reset();
    });
}

function onLoadMoreBtn() {
  page += 1;
  simpleLightBox.destroy();

  fetchImages(query, page, perPage)
    .then(({ data }) => {
      getGallery(data.hits);
      simpleLightBox = new SimpleLightbox('.gallery a').refresh();

      const totalPages = Math.ceil(data.totalHits / perPage);

      // console.log(page);
      // console.log(data.hits);
      // console.log(data.totalHits);
      // console.log(perPage);
      // console.log(totalPages); //10

      if (page === totalPages) {
        btnMore.classList.add('is-hidden');
        alertEndOfSearch();
      }
    })
    .catch(error => console.log(error));
}

function alertImagesFound(data) {
  Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
}

function alertNoEmptySearch() {
  Notiflix.Notify.failure('Erorr, input is empty.');
}

function alertNoImagesFound() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function alertEndOfSearch() {
  Notiflix.Notify.failure(
    "We're sorry, but you've reached the end of search results."
  );
}
