import axios from 'axios';

export const requestCommon = (url, params, method) => {
    if (method === undefined) {
        method = 'post'
    }
    return axios.post(url, params).then(res => res.data)
}

export const ERR_OK = 200
