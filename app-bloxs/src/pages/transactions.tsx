import styles from '../styles/transactions.module.css'
import Header from '../components/sidemenu/sidemenu';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';

import Avatar from '@mui/material/Avatar';
import SouthWestIcon from '@mui/icons-material/SouthWest';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import PixIcon from '@mui/icons-material/Pix';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import IconButton from '@mui/material/IconButton';
import Image from 'next/image';
import NoTransactions from '../assets/img/no-items.jpg';

import { useState, useEffect } from 'react'

import { red, green, blue } from '@mui/material/colors';

import { listTransactions } from '@/api/transaction';

export default function Transactions() {
  const per_page = 6;
  const [page, setPage] = useState(1)
  const [nextPage, setNextPage] = useState(2)
  const [prevPage, setPrevPage] = useState(0)
  const [hasPrev, setPrev] = useState(false)
  const [hasNext, setNext] = useState(true)
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    
    // O token de autenticação é adicionado ao localStorage, mas o router muda de página
    // tão rapidamente que o request não consegue adicioná-lo na primeira requisição pós login/cadastro.
    // A solução temporária é adicionar um timeout de 100ms para que a operação de inserir 
    // o token tenha sido finalizada. 

    setTimeout(() => {
      listTransactions(page, per_page)
      .then((response) => {
        setTransactions(response?.data?.transactions);
        setNext(response?.data?.has_next)
        setPrev(response?.data?.has_prev)
        setNextPage(response?.data?.next_num)
        setPrevPage(response?.data?.prev_num)

      })
      .catch((error) => {

      })
    }, 100)
  }, [page])

  return (
    <div>
      <title>Transações</title>
      <Header tabIndex="2"></Header>
      <div className={styles.page}>
        {
          transactions.length > 0 && 
            <div className={styles.card}>
            <List sx={{ width: '100%'}}>
              {
                transactions.map((transaction: any) => (
                    <ListItem  key={transaction.id} secondaryAction={<p>R$ {transaction.value}</p>}>
                      {
                          transaction.origin_account_id && transaction.destination_account_id? 
                          <>
                            <ListItemAvatar>
                              <Avatar className={styles.avatar}>
                                <PixIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={'Pix para ' + transaction.destination_account_name} secondary={
                              `${(new Date(transaction.date)).toLocaleString()}`
                            } />
                          </>
                          : transaction.origin_account_id?
                          (
                            <>
                              <ListItemAvatar>
                                <Avatar className={styles.avatar}>
                                  <NorthEastIcon sx={{ color: red[200], backgroundColor: 'transparent' }}/>
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText primary="Saque" secondary={
                                `${(new Date(transaction.date)).toLocaleString()}`
                              } />
                            </>
                          )
                          : 
                          <>
                              <ListItemAvatar>
                                <Avatar className={styles.avatar}>
                                  <SouthWestIcon sx={{ color: green[900] }}/>
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText primary="Deposito" secondary={
                                `${(new Date(transaction.date)).toLocaleString()}`
                              } />
                            </>
                      }
                    </ListItem> 
                  )
                )
              }
            </List>
            <div className={styles.btnContainer}>
              <IconButton disabled={!hasPrev} onClick={() => setPage(prevPage)} className={styles.leftButton} aria-label="fingerprint" sx={{ color: 'black' }} size="large">
                <ChevronLeftIcon />
              </IconButton>
              <IconButton disabled={!hasNext} onClick={() => setPage(nextPage)} className={styles.rightButton} aria-label="fingerprint" sx={{ color: 'black' }} size="large">
                <ChevronRightIcon />
              </IconButton>
            </div>
          </div>
        }
        {
          transactions.length == 0 &&
          <div className={styles.noDataContainer}>
            <h2 className={styles.noDataText}>Sem transações (por enquanto...)</h2>
            <Image className={styles.noDataImage} src={NoTransactions} alt='Sem transações'/>
          </div>
        }
      </div>
    </div>
  )
}
