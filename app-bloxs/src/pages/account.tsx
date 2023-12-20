import styles from '../styles/account.module.css';
import Header from '../components/header/header';

import { useState, useEffect } from 'react';

import { getAccountInfo, blockAccount, unblockAccount } from '../api/account';

import Image from "next/image"
import CallToAction from '../assets/img/profile.jpg'

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import { useRouter } from 'next/navigation';

export default function Account() {

  const router = useRouter();

  const activateAccount = () => {
    unblockAccount()
    .then(() => {
      router.refresh()
    }).catch(() => {

    })
  }

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
        {
          user.is_active == true && 
          <h2 className={styles.helloText}>Olá, {user.name}. Sua conta está <span className={styles.activeAccount}>Ativa.</span></h2>
        }
        {
          user.is_active == false && 
          <h2 className={styles.helloText}>Olá, {user.name}. Sua conta está 
            <span className={styles.desactiveAccount}> Inativa. </span>Clique <span className={styles.activateAccount} onClick={() => {activateAccount(); return false}}>aqui</span> para Ativar
          </h2>
        }
        <div className={styles.dataContainer}>
          <div className={styles.callToAction}>
            <Image src={CallToAction} alt='call' className={styles.bankIcon} width={600} height={600}/>
          </div>
          <div className={styles.personalData}>
            <List sx={{ width: '40%'}}>
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
          </div>
          
        </div>  
      </div>
    </div>
  )
}
