import axios from 'axios'
import { basePostRequest } from '.'

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
        basePostRequest('/account', form)
            .then((response) => {
                resolve(response)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

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
