import styles from "../styles/deposit.module.css"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Alert from "@mui/material/Alert"
import IconButton from "@mui/material/IconButton"
import Collapse from '@mui/material/Collapse';
import InputAdornment from "@mui/material/InputAdornment"

import { sendDeposit } from "../api/transaction"
import Header from '../components/header/header'

export default function Deposit() {
  var form = {
    value: "",
    destination_account_id: 2
  }

  const router = useRouter()
  const [apiMessageError, setApiMessageError] = useState('')
  const [open, setOpen] = useState(false);
  const [disableSendButton, setSendButton] = useState(true)
  const CheckValue = (value: string) => {
    form.value = value
    if (value == "") setSendButton(true)
    else setSendButton(false)
  }

  const DepositMoney = () => {
    var deposit_form = {
      value: parseFloat(form.value.replace(',', '.')), 
      destination_account_id: form.destination_account_id
    }

    sendDeposit(deposit_form)
      
      .then((data) => {
        router.push('/transactions')
      })
      .catch((error) => {
        setOpen(true)
        setApiMessageError(error.response.data.message)
      })
  }

  return (
    <>
      <title>Depósito</title>
      <Header tabIndex="3"></Header>
      <div className={styles.page}>
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
                CheckValue(e.target.value)
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
