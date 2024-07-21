import { Group, Container, Divider, Title, useMantineTheme, Flex, Paper,Text, Button, ScrollArea } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import LayoutNav from '../Layout';
import { DoughnutChart } from '@/components/Dashboard/piechart';
import { SideBarChart } from '@/components/Dashboard/sidebarchart';

import classes from './MobileNavbar.module.css';

import React, { createContext, Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { LineChart } from '@/components/Dashboard/linechart';
import { useAuth } from '@/context/Authentication';
import { useScreenHeight } from '@/components/Utils/ScreenHeight';
import { useScreenWidth } from '@/components/Utils/ScreenWidth';


const MapComponent = dynamic(() => import('@/components/Dashboard/map'), {
  ssr: false,  // Disable server-side rendering
  loading: () => <div>Loading Map...</div>
});

export const LocationContext = createContext({})

export default function DashBoardPage() {
  const url = process.env.URL
 const {user} = useAuth()
  const [opened, { toggle }] = useDisclosure();
  const theme = useMantineTheme();
  const isLargeScreen = useMediaQuery(`(min-width: 644px)`);
  const [location, setLocation] = useState([-6.121537, 34.719458]);
  const [lineChartData,setLineChartData]=useState({})
  const [dougnutChartData,setDougnutChartData]=useState({})
  const [barChartData,setBarChartData]=useState({})
  const [weatherLoader,setWeatherLoader] = useState(false)
  const screenHeight = useScreenHeight()
  const screenWidth = useScreenWidth()
  
console.log(user)
  async function getrain() {

    var response = await fetch(`${url}/data/rain_conditions?latitude=${location[0]}&longitude=${location[1]}`, {
      method: 'GET', }).catch((e)=>{
          // setCropLoader(false)
          console.log(e)
          setWeatherLoader(false)        
        });
      
          if (response){
     
      var response_json = await response.json()
      console.log(response_json)

      setLineChartData(response_json["response"])
      setWeatherLoader(false) 
      // setCropLoader(false)

    }
  }

  async function getcrops() {

    var response = await fetch(`${url}/data/bestcrops`, {
      method: 'GET', }).catch((e)=>{
          // setCropLoader(false)
          console.log(e)});
      
          if (response){
     
      var response_json = await response.json()
      console.log("heree12")
      console.log(response_json["chart_friendly"])

      setDougnutChartData(response_json["chart_friendly"])
      // setCropLoader(false)

    }
  }
  async function getfertilizer() {

    var response = await fetch(`${url}/data/topfertilizer`, {
      method: 'GET', }).catch((e)=>{
          // setCropLoader(false)
          console.log(e)});
      
          if (response){
     
      var response_json = await response.json()
      console.log(response_json)

      setBarChartData(response_json["chart_friendly"])
      // setCropLoader(false)

    }
  }
  
  useEffect(() => {
  setWeatherLoader(true);
  getrain()
  getcrops()
  getfertilizer()
  }, []);



  return (
    <>
      <LayoutNav>
        <Flex direction={{ base: 'column', sm: 'row' }}
          gap={{ base: 'xs', sm: 'lg' }}
          align="flex-start"
         
          justify="flex-start">
          <Flex direction="column" mt={-15} ml={isLargeScreen?-15:0}  w={isLargeScreen ?'50%':'98%'}  align="flex-start">
            

          <LocationContext.Provider value={{location, setLocation}}>
            <MapComponent />
</LocationContext.Provider>

          </Flex>
          <div className="divWithHiddenScrollbar" style={{ overflowY: 'auto', height:`${screenHeight}px`,width:isLargeScreen ?'50%':"100%" }}>
          <Flex direction="row"  gap="xs" wrap="wrap"   pl={{ width:isLargeScreen ?'xl':'sm' }}>
            
  
            <div style={{ width:isLargeScreen ?'49%':'100%' }}>
            <Paper withBorder shadow="xl" px="xl" py="md" mb="1px" radius="md">
            <Title order={3} >Best Crops</Title>
              <DoughnutChart data={dougnutChartData}/>
              </Paper>
           </div>
 
           <div style={{ width:isLargeScreen ?'49%':'100%'}}>
            <Paper  withBorder shadow="xl" px="xl" py="md" my="1px" radius="md">
            <Title  order={3}>Top Fertilizer</Title>
              <SideBarChart data = {barChartData}/>
              </Paper>
              </div>

              <div style={{ width:isLargeScreen ?'100%':'100%'}}>
            <Paper  withBorder shadow="xl" px="xl" py="md" my="1px" radius="md">
            <Group grow   >
            <Title  order={3}>Weather</Title>

            <Group justify="flex-end" gap={0} >
            {weatherLoader&& <svg className="loader2" viewBox="25 25 50 50">
  <circle className="circle1" r="10" cy="50" cx="50"></circle>
</svg>}   
            <Button  bg="#83E819" onClick={()=>{
              setWeatherLoader(true)
              getrain()
            }}>Refresh</Button>
            </Group>
            
            </Group>
              <LineChart data={lineChartData}/>
              </Paper>
              </div>

         
            
          </Flex>
          </div>
  
          
            
        </Flex>
      </LayoutNav>
    </>
  );
}
