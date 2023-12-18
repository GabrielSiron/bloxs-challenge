import axios from 'axios'

if(typeof window !== 'undefined') axios.defaults.headers.common['authorization'] = `${localStorage.getItem('token')}`

export const basePostRequest = (endpoint: string, form: any) => {
    return new Promise((resolve, reject) => {
        axios.post(`${process.env.BASE_URL}${endpoint}`, form)
            .then((data) => {
                resolve(data)
            })
            .catch((err) => {
                reject(err);
            })
    })
}

export const baseGetRequest = (endpoint: string, query: string = '') => {  
    return new Promise((resolve, reject) => {
        axios.get(`${process.env.BASE_URL}${endpoint}?${query}`)
            .then((data) => {
                resolve(data)
            })
            .catch((err) => {
                reject(err);
            })
    })
}

export const basePutRequest = (endpoint: string, form: any) => {
    return new Promise((resolve, reject) => {
        axios.put(`${process.env.BASE_URL}${endpoint}`, form)
            .then((data) => {
                resolve(data)
            })
            .catch((err) => {
                reject(err);
            })
    })
}

export const baseDeleteRequest = (endpoint: string, form: any) => {
    return new Promise((resolve, reject) => {
        axios.put(`${process.env.BASE_URL}${endpoint}`, form)
            .then((data) => {
                resolve(data)
            })
            .catch((err) => {
                reject(err);
            })
    })
}