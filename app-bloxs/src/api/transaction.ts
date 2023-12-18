import axios from 'axios'
import { basePostRequest } from '.'

if(typeof window !== 'undefined') axios.defaults.headers.common['authorization'] = `${localStorage.getItem('token')}`

export const sendDeposit = (form: any) => {
    return new Promise((resolve, reject) => {
        basePostRequest('/deposit', form)
        .then((response) => {
            resolve(response)
        })
        .catch((error) => {
            reject(error)
        })
    })
}

export const makeWithdrawal = (form: any) => {
    return new Promise((resolve, reject) => {
        basePostRequest('/withdrawal', form)
        .then((response) => {
            resolve(response)
        })
        .catch((error) => {
            reject(error)
        })
    })
}

export const listTransactions = (page: number, per_page: number) => {
    console.log("Listing: ", page, per_page);
    
    return new Promise((resolve, reject) => {
        axios.get(`${process.env.BASE_URL}/transactions?page=${page}&per_page=${per_page}`)
            .then((response) => {
                resolve(response)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

export const makePix = (form: any) => {
    return new Promise((resolve, reject) => {
        basePostRequest('/pix', form)
        .then((response) => {
            resolve(response)
        })
        .catch((error) => {
            reject(error)
        })
    })   
}