import axios from 'axios'
import { basePostRequest } from '.'

if(typeof window !== 'undefined') axios.defaults.headers.common['authorization'] = `${localStorage.getItem('token')}`

export const loginRequest = (form: any) => {
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
        basePostRequest('/signup', form)
            .then((response) => {
                resolve(response)
            })
            .catch((error) => {
                reject(error)
            })
    })
}