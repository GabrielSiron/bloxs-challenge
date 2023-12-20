import styles from '../styles/account.module.css';
import Header from '../components/header/header';

import { useState, useEffect } from 'react';

import { getAccountInfo, blockAccount, unblockAccount } from '../api/account';
import Button from '@mui/material/Button';

import Image from "next/image"
import CallToAction from '../assets/img/profile.jpg'

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import { yellow } from '@mui/material/colors';

export default function Account() {

  const [user, setUser] = useState({
    amount: 0,
    name: '',
    email: '',
    document_number: '',
    is_active: true
  })

  const formatDocumentNumber = (document_number: string) => {
    return `${document_number.slice(0, 3)}.${document_number.slice(3, 6)}.${document_number.slice(6, 9)}-${document_number.slice(9, 11)}`
  }

  const getUserData = () => {
    getAccountInfo().then((response: any) => {
      setUser({
        amount: response?.data?.amount,
        name: response?.data?.name,
        email: response?.data?.email,
        document_number: response?.data?.document_number,
        is_active: response?.data?.is_active
      })
    })
  }

  useEffect(() => {
    getUserData()
  }, [])

  return (
    <div>
      <title>Minha Conta</title>
      <Header tabIndex="1"></Header>
      <div className={styles.page}>
        <h2 className={styles.helloText}>Olá, {user.name}.</h2>
        <div className={styles.dataContainer}>
          <div className={styles.personalData}>
          <h3 className={styles.sectionTitle}>Dados Pessoais</h3>
            <List sx={{ width: '90%'}}>
              <ListItem>
                <ListItemText primary="Nome" secondary={user.name} />
              </ListItem>
              <ListItem>
                <ListItemText primary="E-mail" secondary={user.email} />
              </ListItem>
              <ListItem>
                <ListItemText primary="CPF" secondary={formatDocumentNumber(user.document_number)} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Saldo" secondary={'R$' + user.amount} />
              </ListItem>
            </List>
            {
              !user.is_active? 
                <Button className={styles.activateAccountButton} variant="contained" onClick={() => blockAccount()}> Ativar Conta</Button> 
                  : 
                <Button className={styles.activateAccountButton} sx={{ backgroundColor: yellow[900] }} variant="contained" onClick={() => unblockAccount()}> Desativar Conta</Button>
            }
          </div>
          <div className={styles.callToAction}>
            <Image src={CallToAction} alt='call' className={styles.bankIcon} width={600} height={600}/>
          </div>
        </div>  
      </div>
    </div>
  )
}
