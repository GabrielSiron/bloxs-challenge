import styles from "../styles/pix.module.css"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Alert from "@mui/material/Alert"
import IconButton from "@mui/material/IconButton"
import Collapse from '@mui/material/Collapse';
import InputAdornment from "@mui/material/InputAdornment"

import Header from '../components/header/header'

import { getAccountInfo, getUserByDocumentNumber } from '../api/account'
import { makePix } from '../api/transaction'

export default function Pix() {
  
  const router = useRouter()

  const [transferenceForm, setTransferenceForm] = useState({
    value: '',
    pix_key: ''
  })

  const [inputError, setInputError] = useState(false)
  const [textValueError, setTextValueError] = useState('')

  const [transferenceValueIsOk, setTransferenceValueIsOk] = useState(false)
  const [apiMessageError, setApiMessageError] = useState('')
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(0.00)

  const formatDocumentNumber = (value: string) => {
    if(value.length == 3 && transferenceForm.pix_key.length == 2) return value + '.'
    if(value.length == 7 && transferenceForm.pix_key.length == 6) return value + '.'
    if(value.length == 11 && transferenceForm.pix_key.length == 10) return value + '-'
    return value
  }

  useEffect(() => {
    getAccountInfo()
    .then((response: any) => {
        setAmount(response?.data?.amount)
    })
    .catch((error) => {

    })
  }, [])

  const transferMoney = () => {
      makePix(transferenceForm)
          .then((response: any) => {
              router.push('/transactions')
          })
          .catch((error) => {
              setOpen(true);
              console.log(error);
              setApiMessageError(error?.response?.data?.message);
              setTimeout(() => {
                setOpen(false);
              }, 5000)
          })
  }

  const updateValue = (value: string) => {
    setTransferenceForm({...transferenceForm, value: value})
    if(value){
        if(parseFloat(value) <= amount) {
            setTransferenceValueIsOk(true)
            setInputError(false)
            setTextValueError('')
        } else {
            setTransferenceValueIsOk(false)
            setTextValueError('Saldo Insuficiente.')
            setInputError(true)
        }
    }
    
    else {
        setTransferenceValueIsOk(false)
        setInputError(false)
    }
  }

  return (
    <>
      <title>Fazer Pix</title>
      <Header tabIndex="5"></Header>
      <div className={styles.page}>
      <h2 className={styles.subtitle}>Quer agilidade? Conte com a gente!</h2>
        <div className={styles.card}>
          
          <div className={styles.amountContainer}>
            <h4 className={styles.description}>Saldo disponível R$ {amount}</h4>
          </div>
          <div className={styles.form}>
            <TextField
              className={styles.input}
              label="cpf"
              variant="outlined"
              placeholder="999.999.999.99"
              onChange={(e: any) => {
                e.currentTarget.value = formatDocumentNumber(e.currentTarget.value);
                setTransferenceForm({...transferenceForm, pix_key: formatDocumentNumber(e.currentTarget.value)})
              }}
            />

            <TextField
              className={styles.input}
              label="Valor da transferência"
              variant="outlined"
              placeholder="0,00"
              error={inputError}
              helperText={textValueError}
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
              disabled={!transferenceValueIsOk}
              onClick={() => {transferMoney()}}
            >
              Enviar Pix
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
    </>
  )
}
