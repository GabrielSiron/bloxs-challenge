import styles from './styles.module.css'
import Image from 'next/image'
import { Button } from '@mui/material';
import { useRouter } from "next/navigation"
import BloxsLogo from '../../assets/img/bloxs-logo.png'

export default function Header(props: any){
    
    const tabs = ['/home', '/account', '/transaction', 'deposit', 'withdrawal', '/pix']
    const router = useRouter()
    const redirect = (index: number) => {
        router.push(tabs[index])
    }
    
    return (
        <div className={styles.header}>
            <div>
                <h2 className={styles.enterpriseName}>Desafio  <Image src={BloxsLogo} alt='logo' width='50'></Image></h2>
            </div>
            <div className={styles.tabContainer}>
                <Button onClick={() => {redirect(0)}} className={props.tabIndex == '0'? styles.selected : styles.notSelected}>Home</Button>
                {
                    props.tabIndex == '0' && <div className={styles.circle}></div>
                }
            </div>
            <div className={styles.tabContainer}>
                <Button onClick={() => {redirect(1)}} className={props.tabIndex == '1'? styles.selected : styles.notSelected}>Minha Conta</Button>
                {
                    props.tabIndex == '1' && <div className={styles.circle}></div>
                }
            </div>
            <div className={styles.tabContainer}>
                <Button onClick={() => {redirect(2)}} className={props.tabIndex == '2'? styles.selected : styles.notSelected}>Transações</Button>
                {
                    props.tabIndex == '2' && <div className={styles.circle}></div>
                }
            </div>
            <div className={styles.tabContainer}>
                <Button onClick={() => {redirect(3)}} className={props.tabIndex == '3'? styles.selected : styles.notSelected}>Depósito</Button>
                {
                    props.tabIndex == '3' && <div className={styles.circle}></div>
                }
            </div>
            <div className={styles.tabContainer}>
                <Button onClick={() => {redirect(4)}} className={props.tabIndex == '4'? styles.selected : styles.notSelected}>Saque</Button>
                {
                    props.tabIndex == '4' && <div className={styles.circle}></div>
                }
            </div>
            <div className={styles.tabContainer}>
                <Button onClick={() => {redirect(5)}} className={props.tabIndex == '5'? styles.selected : styles.notSelected}>Pix</Button>
                {
                    props.tabIndex == '5' && <div className={styles.circle}></div>
                }
            </div>
        </div>
        )
}