// components/Layout.js
import React, { ReactNode } from 'react';
import { AppShell, Avatar, Text, Burger, Button, Group, Indicator, Tabs, Title, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import classes from './MobileNavbar.module.css';
import { useRouter } from 'next/router';
import { AuthProvider, useAuth } from '@/context/Authentication';
import { notifications } from '@mantine/notifications';
import { useScreenHeight } from '@/components/Utils/ScreenHeight';



type LayoutProps = {
  children: any;
};

const LayoutNav: React.FC<LayoutProps> = ({ children }) => {
  const { checkUserLoggedIn,loggedIn, get_user_data ,logout_user} = useAuth()
  const router = useRouter()
  const pathname = router.pathname
  const [opened, { toggle }] = useDisclosure();
  const userdata = get_user_data()
  const screenHeight = useScreenHeight()

  return (

    <AppShell
    style={{height:`${screenHeight}px`}}
    pb={0}
    mb={0}
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header style={{ zIndex: 9999 }}>
        <Group h="100%" px="xs">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group justify="space-between" style={{ flex: 1 }}>

            <Group ml="md" gap={0} visibleFrom="sm">
            {loggedIn &&
              <Indicator position="bottom-end" size={6} processing>
                <Avatar color="green" variant="filled" radius="xl" size="50px" onClick={() => {
                  router.push("/profile")
                }}
                   >{userdata["username"]&&userdata["username"].charAt(0).toUpperCase()}</Avatar>
              </Indicator>}
              <UnstyledButton className={classes.control} onClick={() => {
                    if(loggedIn){
                      router.push("/dashboard")}
                      else{
                        router.push("/")
                        notifications.show({
                          color:"orange",
                          message: 'LogIn to get our exclusive features! ',
                        })
                      } 
               }}>Home</UnstyledButton>
              <UnstyledButton className={classes.control} onClick={() => { router.push("/crop") }}>Crop Recommendation</UnstyledButton>
              <UnstyledButton className={classes.control} onClick={() => { 
                  if(loggedIn){
          router.push("/fertilizer")}
          else{
            router.push("/")
            notifications.show({
              color:"orange",
              message: 'LogIn to get our exclusive features! ',
            })
          } 
              }} >Fertilizer Recommendation</UnstyledButton>

            </Group>
          </Group>
          <Group justify='left'>
            { pathname =="/dashboard" &&
            <Button variant='outline' color='black' radius="md" onClick={() => { router.push("/crop") }}>Get Started</Button>}
            {!loggedIn ? <Button variant="filled" color="#83E819"
              onClick={() => { router.push("/") }}>Login</Button> : <UnstyledButton
              style={{ textDecoration: 'underline' }}
              pr="md"
              onClick={()=>{
              logout_user()
              router.push("/")
              notifications.show({
                color:"orange",
                title: 'You have Logged Out',
                message: 'LogIn to get our exclusive features! ',
              })
              }}
              >Logout</UnstyledButton>}
         

          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar py="md" px={4} style={{ zIndex: 9998 }}>
        <UnstyledButton className={classes.control} onClick={() => {
          if(loggedIn){
          router.push("/dashboard")}
          else{
            router.push("/")
            notifications.show({
              color:"orange",
              message: 'LogIn to get our exclusive features! ',
            })
          } }}>Home</UnstyledButton>
        <UnstyledButton className={classes.control} onClick={() => { router.push("/crop") }}>Crop Recommendation</UnstyledButton>
        <UnstyledButton className={classes.control} onClick={() => {
          if(loggedIn){
          router.push("/fertilizer")}
          else{
            router.push("/")
            notifications.show({
              color:"orange",
              message: 'LogIn to get our exclusive features! ',
            })
          } }} >Fertilizer Recommendation</UnstyledButton>
        {loggedIn &&
        <Group
          onClick={() => {
            router.push("/profile")
          }}
        >
         
          <Avatar color="green" radius="xl" size="50px" variant="filled"
          >{userdata["username"]&&userdata["username"].charAt(0).toUpperCase()}</Avatar>
          <Text>{userdata["username"]}</Text>
        </Group>}
      </AppShell.Navbar>

      <AppShell.Main   pb={0}
    mb={0} bg="F1F3F5">
        {children}
      </AppShell.Main>
    </AppShell>

  );
}


export default LayoutNav;