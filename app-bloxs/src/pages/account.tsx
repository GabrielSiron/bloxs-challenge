import styles from '../styles/account.module.css';
import Header from '../components/header/sidemenu';

import { useState, useEffect } from 'react';

import { getAccountInfo, blockAccount, unblockAccount } from '../api/account';

import Image from "next/image"
import CallToAction from '../assets/img/profile.jpg'

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
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
    is_active: true,
    account_type: '',
    account_daily_limit: ''
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
        is_active: response?.data?.is_active,
        account_type: response?.data?.account_type,
        account_daily_limit: response?.data.account_daily_limit
      })
    })
  }
  
  const getFirstName = (fullName: string) => {
    if(fullName.includes(' '))
      return fullName.split(' ')[0]
    return ''
  }

  const desactivateAccount = () => {
    blockAccount()
    .then((response) => {
      router.refresh()
    })  
    .catch((error) => {

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
          <div className={styles.titleContainer}>
            <h2 className={styles.helloText}>Olá, {getFirstName(user.name)}. Sua conta está <span className={styles.activeAccount}>Ativa.</span></h2>
            <h2 className={styles.amount}>Saldo: R${user.amount}</h2>
          </div> 
        }
        {
          user.is_active == false && 
          <>
            <h2 className={styles.helloText}>Olá, {user.name}. Sua conta está 
              <span className={styles.desactiveAccount}> Inativa. </span>Clique <span className={styles.activateAccount} onClick={() => {activateAccount(); return false}}>aqui</span> para Ativar
            </h2>
            <h2 className={styles.helloText}>Saldo: R${user.amount}</h2>
          </>
          
        }
        <div className={styles.dataContainer}>
          <div className={styles.callToAction}>
            <Image src={CallToAction} alt='call' className={styles.bankIcon} width={600} height={600}/>
          </div>
          <div className={styles.personalDataContainer}>
            <List sx={{ width: '40%'}} className={styles.personalData}>
              <ListItem className={styles.listItem}>
                <ListItemText primary="Nome" secondary={user.name} />
              </ListItem>
              <ListItem className={styles.listItem}>
                <ListItemText primary="E-mail" secondary={user.email} />
              </ListItem>
              <ListItem className={styles.listItem}>
                <ListItemText primary="CPF" secondary={formatDocumentNumber(user.document_number)} />
              </ListItem>
              <ListItem className={styles.listItem}>
                <ListItemText primary="Tipo de Conta" secondary={user.account_type} />
              </ListItem>
              <ListItem className={styles.listItem}>
                <ListItemText primary="Limite diário de Saque" secondary={'R$ ' + user.account_daily_limit} />
              </ListItem>
            </List>
          </div>
          
        </div>  
        <div className={styles.btnContainer}>
          {
            user.is_active && 
              <Button className={styles.desactiveButton} variant='outlined' onClick={() => {desactivateAccount()}}>Desativar Conta</Button> 
          }
        </div>
      </div>
    </div>
  )
}
