import axios from 'axios';

const reactionGraphAPI = axios.create({
  baseURL: 'http://molecule-factory.com/api/reactiongraph',
});

export default reactionGraphAPI;