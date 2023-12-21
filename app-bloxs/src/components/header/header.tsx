import styles from './styles.module.css'

import { Button } from '@mui/material';
import { useRouter } from "next/navigation"
import { useState } from 'react'

import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import InfoIcon from '@mui/icons-material/Info';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SouthWestIcon from '@mui/icons-material/SouthWest';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import PixIcon from '@mui/icons-material/Pix';
import MenuIcon from '@mui/icons-material/Menu';
import Chip from '@mui/material/Chip';

export default function Header(props: any){
    
    const tabs = ['/about', '/account', '/transactions', 'deposit', 'withdrawal', '/pix']
    const [collapsed, setCollapsed] = useState(true)
    const router = useRouter()
    
    const redirect = (index: number) => {
        router.push(tabs[index])
    }

    const logout = () => {
        localStorage.removeItem('token');
        router.push('/login')
    }
    
    return (
        <div className={collapsed? styles.header : styles.headerNotCollapsed}>
            <Button className={styles.menuToggle} onClick={() => setCollapsed(!collapsed)}>
                <MenuIcon />
            </Button>
            <div className={styles.tabContainer}>
                <Button onClick={() => {redirect(0)}} className={props.tabIndex == '0'? styles.selected : styles.notSelected}> 
                    <InfoIcon />
                    {collapsed ? '' : 'Quem Somos'}
                    <Chip label="beta" variant="outlined" className={styles.chip}></Chip>
                </Button>
            </div>
            <div className={styles.tabContainer}>
                <Button onClick={() => {redirect(1)}} className={props.tabIndex == '1'? styles.selected : styles.notSelected}> 
                    <AccountCircleIcon />
                    {collapsed ? '' : 'Minha Conta'}
                </Button>
            </div>
            <div className={styles.tabContainer}>
                <Button onClick={() => {redirect(2)}} className={props.tabIndex == '2'? styles.selected : styles.notSelected}> 
                    <ReceiptLongIcon />
                    {collapsed ? '' : 'Transações'}
                </Button>
            </div>
            <div className={styles.tabContainer}>
                <Button onClick={() => {redirect(3)}} className={props.tabIndex == '3'? styles.selected : styles.notSelected}> 
                    <SouthWestIcon />
                    {collapsed ? '' : 'Depósito'}
                </Button>
            </div>
            <div className={styles.tabContainer}>
                <Button onClick={() => {redirect(4)}} className={props.tabIndex == '4'? styles.selected : styles.notSelected}> 
                    <NorthEastIcon />
                    {collapsed ? '' : 'Saque'}
                </Button>
            </div>
            <div className={styles.tabContainer}>
                <Button onClick={() => {redirect(5)}} className={props.tabIndex == '5'? styles.selected : styles.notSelected}> 
                    <PixIcon />
                    {collapsed ? '' : 'Pix'}
                </Button>
            </div>
            <div className={styles.logoutContainer}>
                <Button onClick={() => {logout()}} className={styles.logout}> 
                    <ExitToAppIcon />
                    {collapsed ? '' : 'Sair'}
                </Button>
            </div>
        </div>
        )
}