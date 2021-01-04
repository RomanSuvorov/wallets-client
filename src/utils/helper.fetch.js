import Config from '../config';

const fetchHandler = async ({ url, method = 'GET', body = null, headers = {}, token = {} }) => {
  try {
    if (body) {
      body = JSON.stringify(body);
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(Config.url + url, { method, body, headers });

    // if empty content
    if (response.status === 204) return {};

    // if content exist -> to JSON format
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Что-то пошло не так");
    }

    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export default fetchHandler;
