import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:9900/api/v1',
});

export default axiosInstance;