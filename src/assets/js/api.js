import axios from 'axios';

let instance = axios.create({
    baseURL: 'http://localhost:9000',
    timeout: 100000,
    withCredentials: true
});

const api = {};

api.post = (url, data) => {
    return new Promise((resolve, reject) => {
        instance({
            url: url,
            method: 'post',
            data: data
        }).then(res => {
            console.log(res);
            resolve(res.data);
        }).catch(err => {
            console.error(err);
            reject(err);
        });
    });
};

api.get = (url, params) => {
    return new Promise((resolve, reject) => {
        instance({
            url: url,
            method: 'get',
            params: params
        }).then(res => {
            console.log(res);
            resolve(res.data);
        }).catch(err => {
            console.error(err);
            reject(err);
        });
    });
};

export default api;