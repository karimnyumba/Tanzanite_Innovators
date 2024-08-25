import { Group, Container, Divider, Title, useMantineTheme, Flex, Paper,Text, Button, ScrollArea, Card, Space, ThemeIcon, Badge, Autocomplete, Loader, rem } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import LayoutNav from '../Layout';
import { DoughnutChart } from '@/components/Dashboard/piechart';
import { SideBarChart } from '@/components/Dashboard/sidebarchart';
import '@mantine/carousel/styles.css';

import classes from './MobileNavbar.module.css';

import React, { createContext, Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { LineChart } from '@/components/Dashboard/linechart';
import { useAuth } from '@/context/Authentication';
import { useScreenHeight } from '@/components/Utils/ScreenHeight';
import { useScreenWidth } from '@/components/Utils/ScreenWidth';
import Marquee from "react-fast-marquee";
import { IconArrowDownLeft, IconArrowUpRight, IconSearch } from '@tabler/icons-react';
import { Carousel } from '@mantine/carousel';
import { CropsChart } from '@/components/Dashboard/cropschart';
import { withAuth } from '@/components/Authentication/AuthWrapper';
import { DatePickerInput } from '@mantine/dates';






const MapComponent = dynamic(() => import('@/components/Dashboard/map'), {
  ssr: false,  // Disable server-side rendering
  loading: () => <div>Loading Map...</div>
});

export const LocationContext = createContext({})

function DashBoardPage() {


    




  const url = process.env.URL
 const {user} = useAuth()
 const { checkUserLoggedIn, loggedIn, get_user_data, logout_user } = useAuth();
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
  const [userdata, setUserdata] = useState<any>({ id: "", email: "", username: "" });
  const [dropdownOpened, { open:openSearchDropDown,close:closeSearchDropDown }] = useDisclosure();
  const [valueSearch, setValueSearch] = useState('');
  const [allRecommendInfo, setallRecommendInfo] = useState<any[]>([]);
  const [globalLocation, setGlobalLocation] = useState([-6.121537, 34.719458]);
  const [loaderMapSearch,setLoaderMapSearch] = useState<boolean>(false);
  const [recommendPlaces, setRecommendPlaces] = useState<string[]>(['']);
  const [dateValue, setDateValue] = useState<[Date | null, Date | null]>([null, null]);
  const [cropdateValue, setcropDateValue] = useState<[Date | null, Date | null]>([null, null]);
  const [cropDataLoader,setCropDataLoader] = useState(false)
  const [cropChartData,setCropChartData]=useState({})


  const handleChange = (event: any) => {
    console.log('market');
    setValueSearch(event);
  };


  useEffect(() => {
    const data = get_user_data();
    
    setUserdata(data);
  
   
  }, []);


  
console.log(user)
function formatDateOrEmpty(date: Date | null | undefined): string {
  return date ? date.toISOString().split("T")[0] : '';
}
  async function getrain() {

    var response = await fetch(`${url}/data/rain_conditions?latitude=${globalLocation[0]}&longitude=${globalLocation[1]}&start_time=${formatDateOrEmpty(dateValue[0])}&end_time=${formatDateOrEmpty(dateValue[1])}`, {
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


  async function getCropPriceTrend() {
    console.log("here 600")
    var response = await fetch(`${url}/data/crop_price_tends?start_time=${formatDateOrEmpty(cropdateValue[0])}&end_time=${formatDateOrEmpty(cropdateValue[1])}`, {
      method: 'GET', }).catch((e)=>{
          // setCropLoader(false)
          console.log(e)
          setCropDataLoader(false)        
        });
      
          if (response){
     
      var response_json = await response.json()
      console.log("here 600")
      console.log(response_json)

      setCropChartData(response_json)
      console.log("dumb shit")
      console.log(cropChartData)
      setCropDataLoader(false) 
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
  getCropPriceTrend()

  }, []);

  const getAutocompleteSuggestions = async (query: string) => {
    setLoaderMapSearch(true)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}&addressdetails=1&limit=5`,
      {
        method: 'GET',
      }
    ).catch((e) => {
    
      setLoaderMapSearch(false)
      console.log(e);
    });
    if (response) {
      const data = await response.json();
      console.log(data);
      setallRecommendInfo(data);
      var places: string[] = [''];
      data.map((value: any, index: any) => {
        places.push(value['display_name']);
      });
      places = [...new Set(places)];
      setRecommendPlaces(places);
      
    }
    setLoaderMapSearch(false)
  };


  const gradientStyle = {
    background: 'linear-gradient(360deg, black, gray)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)', // Adding a bottom shadow
  };

  return (
    <>
      <LayoutNav>
     <Text
 
      fw={500}
      fz={20}
    style={gradientStyle}
     >Welcome Back, {userdata.username}</Text>
            <Marquee>
            {[
    {"name":"Maize",
      "current": 600,
      "previous": 600,
      "change": "0.0"
    },
 {
        "name":"Rice",
      "current": 2000,
      "previous": 2000,
      "change": "0.0"
    },
    {
        "name":"Beans",
      "current": 2600,
      "previous": 2600,
      "change": "0.0"
    },
   {
        "name":"Sorghum",
      "current": 1500,
      "previous": 1400,
      "change": "7.1"
    },
     {
        "name":"Bulrush millet",
      "current": 1500,
      "previous": 1400,
      "change": "7.1"
    },
     {
        "name":"Finger millet",
      "current": 1600,
      "previous": 1500,
      "change": "6.7"
    },
{
        "name":"Round Potato",
      "current": 1000,
      "previous": 1100,
      "change": "-9.1"
    }
  ].map((value:any,index:any)=>{
                return <Group gap={0} key={index}  py="lg" >
                     <Card shadow="xl" padding="lg" radius="md" w={250} withBorder >
                <Group mb="xs" gap="xl"  justify="space-between">
                  <Text size="sm" c="dimmed" fw={500}>
                    {value["name"].toUpperCase()}
                    
                  </Text>
                  <Badge color="blue" radius="sm" >
                    WEEK
                  </Badge>
                </Group>
          
                <Group align="baseline">
                  <Text size="xl" fw={700}>
                    TZS {value["current"]}
                  </Text>
                  <Group gap={0} >

                    <Text size="sm" c= {value["change"]>= 0 ?"teal":"#FF6347"} fw={700}>
                      {value["change"]}%
                    </Text>
                    {value["change"]>0 ? <IconArrowUpRight color="teal" size={17}/>:value["change"]<0 &&<IconArrowDownLeft color="#FF6347" size={17}/> } 
              
                  </Group>
                </Group>
          
                <Text size="xs" color="dimmed" mt={4}>
                  Compared to previous week
                </Text>
              </Card><Space w="sm" /></Group>
            })}
           </Marquee>
        
     
        <Flex direction={{ base: 'column', sm: 'row' }}
          gap={{ base: 'xs', sm: 'lg' }}
          align="flex-start"
        pt= "xl"
  
         
          justify="flex-start">
            
       
            

          {/* <LocationContext.Provider value={{location, setLocation}}>
            <MapComponent />
</LocationContext.Provider> */}
              <div style={{ width:isLargeScreen ?'50%':'100%'}}>
            <Paper w="100%"  withBorder shadow="xl" px="xl" py="md" my="1px" radius="md">
            <Group >
            <Title  order={3}>Weather</Title>

           

            <Autocomplete
                     dropdownOpened={dropdownOpened}
                      value={valueSearch}
                      onKeyDown={async (event)=>{
                        if (event.key === 'Enter') {
                        await getAutocompleteSuggestions(valueSearch)
                        openSearchDropDown() }
                      }}
                      onOptionSubmit={(value: string) => {
                        console.log('Ninapita hapa huamini');
                        closeSearchDropDown()
                        allRecommendInfo.map((valueIn: any, index: any) => {
                          console.log('value 1');
                          console.log(value);
                          console.log('value 2');
                          console.log(valueIn);
                          if (value == valueIn['display_name']) {
                            console.log('Ninapita hapa huamini');
                            setGlobalLocation([
                              parseFloat(valueIn['lat']),
                              parseFloat(valueIn['lon']),
                            ]);
                          }
                        });
                      }}
                      onChange={handleChange}
                      placeholder="Search for Location"
                      
                      style={{ width: 200 }}
                      rightSection={loaderMapSearch? <Loader size="xs" color="green" />:
                      <IconSearch
                        onClick={async ()=>{await getAutocompleteSuggestions(valueSearch)
                          openSearchDropDown() }}
                        style={{ width: rem(18), height: rem(18) }}
                        stroke={1.5}
                      />     
                    }
                      comboboxProps={{ zIndex: 9998 }}
                      data={recommendPlaces}
                    />
            <DatePickerInput
      type='range'
      value={dateValue}
      onChange={setDateValue}
      minDate={new Date(1971, 7, 5)}
      maxDate={new Date(2024, 6, 4)}            
      placeholder="Pick Date"
 
    />

              
 
            <Button  bg="#83E819"  w="120px" loading={weatherLoader} onClick={()=>{
              setWeatherLoader(true)
              getrain()
            }}>Refresh</Button>
            </Group>
            
         
              <LineChart data={lineChartData}/>
              </Paper>
              </div>
 

        
          <div style={{width:isLargeScreen ?'50%':"100%" }}>
          <Flex direction="row"  gap="xs" wrap="wrap"   pl={{ width:isLargeScreen ?'xl':'sm' }}>
          <div style={{ width:isLargeScreen ?'100%':'100%'}}>
            <Paper  withBorder shadow="xl" px="xl" py="md" my="1px" radius="md">
            <Group    >
            <Title  order={3}>Crop Price Trends</Title>

          
            <DatePickerInput
      type='range'
      value={cropdateValue}
      onChange={setcropDateValue}
      minDate={new Date(1971, 7, 5)}
      maxDate={new Date(2024, 6, 4)}            
      placeholder="Pick Date"
 
    />

              
 
            <Button  bg="#83E819"  w="120px" loading={cropDataLoader} onClick={()=>{
              setCropDataLoader(true)
              getCropPriceTrend()
            }}>Refresh</Button>
            </Group>
            
          
              <CropsChart data={cropChartData}/>
              </Paper>
              </div>
            
  {/* <Card withBorder>
          {/* <Carousel
          
      withIndicators
      height={500}
      slideSize={{ base: '100%', sm: '50%', md: '33.333333%' }}
      slideGap={{ base: 0, sm: 'md' }}
      loop
      align="start"
    >
      <Carousel.Slide><Card bg="yellow" h={400} w={500}>hello</Card></Carousel.Slide>
      <Carousel.Slide>2</Carousel.Slide>
      <Carousel.Slide>3</Carousel.Slide>

    </Carousel> 
    </Card> */}
    {/* <Carousel slideSize="70%" height={200} slideGap="md" controlSize={28}>
      <Carousel.Slide>1</Carousel.Slide>
      <Carousel.Slide>2</Carousel.Slide>
      <Carousel.Slide>3</Carousel.Slide>

    </Carousel> */}

              {/* <div style={{ width:isLargeScreen ?'100%':'100%'}}>
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
              </div> */}

         
            
          </Flex>
          </div>
  
          
            
        </Flex>
      </LayoutNav>
    </>
  );
}
function createStyles(arg0: (theme: any) => { shinyText: { position: string; display: string; fontSize: string; fontWeight: string; color: string; background: string; backgroundSize: string; animation: string; '-webkit-background-clip': string; '-webkit-text-fill-color': string; }; '@keyframes shine': { '0%': { backgroundPosition: string; }; '100%': { backgroundPosition: string; }; }; }) {
    throw new Error('Function not implemented.');
}


export default DashBoardPage

