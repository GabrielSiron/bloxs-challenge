import axios from 'axios'
import { basePostRequest } from '.'

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

export const listTransactions = () => {
    return new Promise((resolve, reject) => {
        axios.get(`${process.env.BASE_URL}/transactions`)
            .then((response) => {

            })
            .catch((error) => {

            })
    })
}