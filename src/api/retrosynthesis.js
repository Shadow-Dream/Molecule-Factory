import axios from 'axios';

const retrosynthesisAPI = axios.create({
  baseURL: 'https://retro.molecule-factory.com',
});

export default retrosynthesisAPI;
