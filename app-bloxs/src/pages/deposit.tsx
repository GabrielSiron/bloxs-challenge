import styles from "../styles/transfer_styles.module.css"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Alert from "@mui/material/Alert"
import IconButton from "@mui/material/IconButton"
import Collapse from '@mui/material/Collapse';
import InputAdornment from "@mui/material/InputAdornment"

import { sendDeposit } from "../api/transaction"
import Header from '../components/sidemenu/sidemenu'

export default function Deposit() {

  const router = useRouter()
  const [apiMessageError, setApiMessageError] = useState('')
  const [open, setOpen] = useState(false);
  const [disableSendButton, setSendButton] = useState(true)

  const [depositForm, setDepositForm] = useState({
    value: ''
  })

  const DepositMoney = () => {

    sendDeposit(depositForm)
      
      .then((data) => {
        router.push('/transactions')
      })
      .catch((error) => {
        setOpen(true)
        setApiMessageError(error.response.data.message)
      })
  }

  const isNumeric = (value: number) => {
    if (typeof value != "string") return false
    return !isNaN(value) && !isNaN(parseFloat(value)) 
  }

  return (
    <>
      <title>Depósito</title>
      <Header tabIndex="3"></Header>
      <div className={styles.page}>
      <h2 className={styles.subtitle}>Depositar dinheiro nunca foi tão simples.</h2>
        <div className={styles.card}>
          <div className={styles.form}>
            <TextField
              className={styles.input}
              label="Valor de Depósito"
              type="number"
              variant="outlined"
              placeholder="0,00"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">R$</InputAdornment>
                ),
              }}
              onChange={(e: any) => {
                if(isNumeric(e.target.value)) setSendButton(false)
                else setSendButton(true)
                setDepositForm({value: parseFloat(e.target.value)})
              }}
            />
            <Button
              className={styles.button}
              variant="contained"
              disabled={disableSendButton}
              onClick={DepositMoney}
            >
              Realizar Depósito
            </Button>
          </div>
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
