'use client'
import { Box, useTheme } from '@mui/material'
import Head from 'next/head'
import { ReactNode } from 'react'
import CustomTextField from 'src/components/text-field'

// layouts
import LayoutNotApp from 'src/views/layouts/LayoutNotApp'

export default function Home() {
  return (
    <>
      <Head>
        <title>Lập trình thật dễ</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <h1>Hello world!</h1>
      <Box sx={{ margin: 6, width: '200px' }}>
        <CustomTextField id='outlined-basic' label='Outlined' />
      </Box>
    </>
  )
}
Home.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
Home.guestGuard = false
Home.authGuard = false
