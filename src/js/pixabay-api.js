import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '52544403-d4b110e344dc82246161e65d0';

let page = 1;
let perPage = 15;

async function getImagesByQuery(query, resetPage = false) {
  if (resetPage) {
    page = 1;
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page,
        per_page: perPage,
      },
    });

    page += 1;

    return response.data.hits;
  } catch (error) {
    console.error(
      'Sorry, there are no images matching your search query. Please try again!',
      error
    );
    return [];
  }
}

export { getImagesByQuery };
