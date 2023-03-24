import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';
const KEY = '28561602-86e3b026ea867d304dbb7c510';

async function fetchImages(query, page, perPage) {
  const response = await axios.get(
    `?page=${page}&per_page=${perPage}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&key=${KEY}`
  );
  return response;
}

export { fetchImages };
