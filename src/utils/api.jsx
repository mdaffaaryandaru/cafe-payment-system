import axios from "axios";

const api = axios.create({
  baseURL: 'http://192.168.18.217:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const get = async (url, params = {}) => {
  try {
      const response = await api.get(url, { params });
      return response.data;
  } catch (error) {
      throw error
  }
};

export const post = async (url, data) => {
  try {
    const response = await api.post(url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const postWithFile = async (url, data) => {
  try {
    const response = await api.post(url, data, {
      headers: {
        'Content-Type' : 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const put = async (url, data) => {
  try {
    const response = await api.put(url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const putWithImage = async (url, data) => {
  try {
    const response = await api.put(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const del = async (url) => {
  try {
    const response = await api.delete(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};