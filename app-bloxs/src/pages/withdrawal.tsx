import styles from "../styles/withdrawal.module.css"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Alert from "@mui/material/Alert"
import IconButton from "@mui/material/IconButton"
import Collapse from '@mui/material/Collapse';
import InputAdornment from "@mui/material/InputAdornment"

import { makeWithdrawal } from "../api/transaction"
import Header from '../components/header/header'

import { getAccountInfo } from '../api/account'

export default function Withdrawal() {

  const router = useRouter()
  const [form, setForm] = useState({
    value: '',
    origin_account_id: 2
  })

  const [inputError, setInputError] = useState(false)
  const [inputMessageError, setInputMessageError] = useState('')
  const [apiMessageError, setApiMessageError] = useState('')
  const [open, setOpen] = useState(false);
  const [disableSendButton, setSendButton] = useState(true)
  const [amount, setAmount] = useState(0.00)

  const querystring = 'email=testing.bloxs@gmail.com'
    getAccountInfo(querystring)
      .then((response: any) => {
        setAmount(response?.data?.amount)
      })
      .catch((error) => {

      })

  useEffect(() => {
      checkInputLimit(form.value)
  }, [form])

  const checkInputLimit = (value: string) => {
    console.log(parseFloat(form.value), amount);
    
    if(parseFloat(form.value) > amount){
      setInputError(true)
      setInputMessageError('Saldo Insuficiente.')
      setSendButton(true)
    }
    else {
      setInputError(false)
      setInputMessageError('')
    }
  }

  const updateValue = (value: string) => {
    setForm({...form, value: value})
    if (value == "") setSendButton(true)
    else setSendButton(false)
  }

  const WithdrawalMoney = () => {
    makeWithdrawal(form)
      .then((data) => {
        router.push('/home')
      })
      .catch((error) => {
        setOpen(true)
        setApiMessageError(error.response.data.message)
      })
  }

  return (
    <>
      <title>Saque</title>
      <Header tabIndex="4"></Header>
      <div className={styles.page}>
      <h2 className={styles.subtitle}>Faça seu saque rápido e fácil.</h2>
        <div className={styles.card}>
          
          <div className={styles.amountContainer}>
            <h4 className={styles.description}>Saldo disponível R$ {amount}</h4>
          </div>
          <div className={styles.form}>
            <TextField
              className={styles.input}
              label="Valor do Saque"
              variant="outlined"
              placeholder="0,00"
              error={inputError}
              helperText={inputMessageError}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">R$</InputAdornment>
                ),
              }}
              onChange={(e: any) => {
                updateValue(e.target.value)
              }}
            />
            <Button
              className={styles.button}
              variant="contained"
              disabled={disableSendButton}
              onClick={WithdrawalMoney}
            >
              Realizar Saque
            </Button>
          </div>
          <p className={styles.warning}>Sujeito a análise de limite diário</p>
        </div>
        
      </div>
      <Collapse className={styles.alert} in={open}>
        <Alert
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpen(false);
                }}
              >
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            {apiMessageError}
          </Alert>
      </Collapse>
      <p>{form.value}</p>
    </>
  )
}
