import axios from 'axios'

export const loginRequest = (form: any) => {
    console.log(process.env.BASE_URL);
    
    return new Promise((resolve, reject) => {
        basePostRequest('/login', form)
            .then((response) => {
                resolve(response)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

export const signUpRequest = (form: any) => {
    return new Promise((resolve, reject) => {
        basePostRequest('/account', form)
            .then((response) => {
                resolve(response)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

export const basePostRequest = (endpoint: string, form: any) => {
    return new Promise((resolve, reject) => {
        axios.post(`http://localhost:5000/${endpoint}`, form)
            .then((data) => {
                resolve(data)
            })
            .catch((err) => {
                reject(err);
            })
    })
}