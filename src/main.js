import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  showLoader,
  hideLoader,
  clearGallery,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';

const form = document.querySelector('.form');
const input = document.querySelector('.form input');
const loadBtn = document.querySelector('.btn');

let currentQuery = '';

form.addEventListener('submit', async event => {
  event.preventDefault();

  const query = input.value.trim();

  if (!query) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search query!',
      position: 'topRight',
    });
    return;
  }

  currentQuery = query;
  hideLoadMoreButton();
  clearGallery();
  showLoader();

  try {
    const { hits: images, totalHits } = await getImagesByQuery(query, true);
    hideLoader();

    if (images.length === 0) {
      iziToast.error({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
        class: 'my-toast',
      });
      return;
    }

    createGallery(images);
    // showLoadMoreButton();

    if (images.length >= totalHits) {
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
      hideLoadMoreButton();
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    hideLoader();
    console.error(error);
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong while fetching images!',
      position: 'topRight',
    });
  }
});

loadBtn.addEventListener('click', async () => {
  showLoader();
  try {
    const { hits: images, totalHits } = await getImagesByQuery(currentQuery);
    hideLoader();

    if (images.length === 0) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
      return;
    }

    createGallery(images);

    const firstCard = document.querySelector('.gallery-item');
    if (firstCard) {
      const cardHeight = firstCard.getBoundingClientRect().height;
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }

    const totalDisplayed = document.querySelectorAll('.gallery-item').length;
    if (totalDisplayed >= totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }
  } catch (error) {
    hideLoader();
    console.error(error);
  }
});
