'use client'

import Image from 'next/image'
import axios from 'axios'
import { useRouter } from 'next/navigation'


export default function Home() {
  const router = useRouter()
  router.push('/login')
  return <></>
}
