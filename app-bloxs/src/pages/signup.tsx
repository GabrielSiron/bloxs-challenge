import styles from "../styles/auth.module.css"
import { signUpRequest } from "@/api/auth"
import { useRouter } from "next/navigation"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Image from "next/image"
import CallToAction from '../assets/img/signup-image.jpg'

export default function SignUp() {
  var form = {
    name: "",
    email: "",
    password: "",
    document_number: "",
    birth_date: "",
  }
  const router = useRouter()
  const SignUp = () => {
    signUpRequest(form)
    .then(async (response) => {
      await localStorage.setItem("token", response?.data?.token)
      router.push("/transactions")
      })
      .catch((err) => {
        alert("Failed")
      })
  }

  const formatDocumentNumber = (value: string) => {
    if(value.length == 3 && form.document_number.length == 2) return value + '.'
    if(value.length == 7 && form.document_number.length == 6) return value + '.'
    if(value.length == 11 && form.document_number.length == 10) return value + '-'
    return value
  }

  return (
    <>
      <title>Desafio Bloxs | Cadastro</title>
      <div className={styles.page}>
        <div className={styles.form}>
          <h1 className={styles.formTitle}>Um banco digital <br /> com impacto Real.</h1>
          <br />
          <div>
          <TextField
            type="text"
            placeholder="nome"
            className={styles.formInput}
            onChange={(e: any) => {
              form.name = e.currentTarget.value
            }}
          />
          <TextField
            type="text"
            placeholder="cpf"
            className={styles.formInput}
            onChange={(e: any) => {
              form.document_number = e.currentTarget.value = formatDocumentNumber(e.currentTarget.value)
            }}
          />
          <TextField
            type="date"
            placeholder="birth date"
            className={styles.formInput}
            onChange={(e: any) => {
              form.birth_date = e.currentTarget.value
            }}
          />
          <TextField
            type="text"
            placeholder="e-mail"
            inputProps={{ pattern: "/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/" }}  
            className={styles.formInput}
            onChange={(e: any) => {
              form.email = e.currentTarget.value
            }}
          />
          <TextField
            type="password"
            placeholder="senha"
            className={styles.formInput}
            onChange={(e: any) => {
              form.password = e.currentTarget.value
            }}
          />
          </div>
          <div className={styles.containerBtn}>
            <Button className={styles.button} variant="contained" onClick={SignUp}>
              Criar conta
            </Button>
            <Button className={styles.button} onClick={() => router.push('/login')}>Já possuo conta</Button>
          </div>
        </div>
        <div className={styles.callToAction}>
          <Image src={CallToAction} alt='call' className={styles.bankIcon} width={600} height={600}/>
        </div>
      </div>
    </>
    
  )
}
