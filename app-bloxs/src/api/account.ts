import axios from 'axios'
import { baseGetRequest } from '.'

if(typeof window !== 'undefined') axios.defaults.headers.common['authorization'] = `${localStorage.getItem('token')}`

export const getAccountInfo = () => {
    return new Promise((resolve, reject) => {
        baseGetRequest('/account')
            .then((response) => {
                resolve(response)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

export const getUserByDocumentNumber = (query: string) => {
    return new Promise((resolve, reject) => {
        baseGetRequest('/pix-key', query)
            .then((response) => {
                resolve(response)
            })
            .catch((error) => {
                reject(error)
            })
    })
}