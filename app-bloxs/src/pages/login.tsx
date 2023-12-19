import styles from "../styles/auth.module.css"

import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import { loginRequest } from "@/api/auth"
import { useRouter } from "next/navigation"
import { useState } from "react";
import Image from "next/image"
import CallToAction from '../assets/img/login-image.jpg'

export default function Login() {
  var form = {
    email: "",
    password: "",
  }

  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const Login = () => {
    loginRequest(form)
      .then(async (response) => {
        await localStorage.setItem("token", response?.data?.token)
        router.push("/transactions")
      })
      .catch((err) => {
        alert("Failed")
      })
  }

  return (
    <>
      <title>Desafio Bloxs | Login</title>
      <div className={styles.page}>
        <div className={styles.callToAction}>
          <Image src={CallToAction} alt='call' className={styles.bankIcon} width={600} height={600}/>
        </div>
        <div className={styles.form}>
          <h1 className={styles.formTitle}>Acesse todos os recursos da nossa plataforma</h1>
          <TextField 
            type="text"
            placeholder="email@gmail.com"
            label="Email"
            variant="outlined"
            className={styles.formInput}
            onChange={(e: any) => {
              form.email = e.currentTarget.value
            }}/>

          <TextField 
            type={showPassword ? 'text' : 'password'}
            placeholder="********"
            label="Password"
            variant="outlined"
            className={styles.formInput}
            onChange={(e: any) => {
              form.password = e.currentTarget.value
            }}
          />
          
          <div className={styles.checkoutContainer}>
            <FormControlLabel className={styles.checkbox} control={<Checkbox onClick={() => {setShowPassword(!showPassword)}}/>} label="Mostrar senha" />
          </div>

          <div className={styles.containerBtn}>
            <Button className={styles.button} variant="contained" onClick={Login}>Faça Login</Button>
            <Button className={styles.button} onClick={() => router.push('/signup')}>Cadastrar-se</Button>
          </div>
        </div>
      </div>
    </>
    
  )
}
