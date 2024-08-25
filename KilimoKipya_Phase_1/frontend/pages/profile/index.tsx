import {
    Group,
    Stack,
    Text,
    Image,
    Avatar,
    Indicator,
    Title,
    Grid,
    Center,
    Button,
    Space,
    Divider,
    Paper,
    Badge,
    Card,
    Modal,
    Flex,
  } from '@mantine/core';
 
  import {
    useDisclosure,
    useMediaQuery,
  } from '@mantine/hooks';
  import LayoutNav from '../Layout';
  import { useEffect, useState } from 'react';
  import { useAuth } from '@/context/Authentication';
import { withAuth } from '@/components/Authentication/AuthWrapper';
  
 function ProfilePage() {
    const [opened, { toggle }] = useDisclosure(false);
    const url = process.env.URL;
    const isLargeScreen = useMediaQuery(`(min-width: 644px)`);
    const { checkUserLoggedIn, loggedIn, get_user_data, logout_user } = useAuth();
    const [recommendationData, setRecommendationData] = useState<any[] | []>([]);
    const [cropCount,setCropCount] = useState<number|undefined>()
    const [fertilizerCount,setFertilizerCount] = useState<number|undefined>()
    const [totalCount,setTotalCount] = useState<number|undefined>()
    const [userdata, setUserdata] = useState<any>({ id: "", email: "", username: "" });
    const [activeRecommendationType, setActiveRecommendationType] = useState<string|undefined>();
    const [openedDetailModal, { open: openDetailModal, close: closeDetailModal }] =
    useDisclosure(false);
    const [itemsRecommended, setItemsRecommended] = useState<any[] | []>([]);
    const [activeRecommendationName,setActiveRecommendationName] = useState<string|undefined>();

  
    useEffect(() => {
      const data = get_user_data();
      
      setUserdata(data);
    
     
    }, []);
  
    async function getRecommendations() {
      try {
        const response = await fetch(`${url}/data/recommendation/all?user_id=${userdata?.id}`, {
          method: 'GET',
        });
  
        if (response.ok) {
          const response_json = await response.json();
          setRecommendationData(response_json["data"]);
          setCropCount(response_json["crop_count"])
          setFertilizerCount(response_json["fertilizer_count"])
          setTotalCount(response_json["total"])
          console.log(response_json);
        } else {
          console.error('Failed to fetch recommendations:', response.status);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    }
  
    useEffect(() => {
      if (userdata?.id) {
        getRecommendations();
      }
    }, [userdata]);
  

    return (
      <>
        <LayoutNav>
          <Stack align="center" justify="flex-start" gap={0}>
            <div style={{ height: '200px', width: '100%' }}>
              <Image radius="md" h={200} src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png" />
            </div>
            <Indicator position="bottom-end" size={6} processing>
              <Avatar color="green" variant="filled" radius="xl" mt={-50} size="100px">
                {userdata?.username ? userdata.username.charAt(0).toUpperCase():""}
              </Avatar>
            </Indicator>
            {userdata&&
            <Title order={3} pt="lg">
            {userdata.username}
            </Title>}
            {userdata&&
            <Text td="underline" c="gray">
           {userdata?.email}
            </Text>}
            <Grid py="lg" gutter={isLargeScreen ? 100 : 50}>
              <Grid.Col span={3}>
                <Title order={4} c="#868684">Total</Title>
                <Center>
                  <Title order={3} >
                    {totalCount? totalCount|| "N/A" : 'Loading...'}
                  </Title>
                </Center>
              </Grid.Col>
              <Grid.Col span={3}>
                <Title order={4} c="#868684">Crop</Title>
                <Center>
                <Title order={3} >
                  {cropCount? cropCount|| "N/A" : 'Loading...'}
                  </Title>
                </Center>
              </Grid.Col>
              <Grid.Col span={3}>
                <Title order={4} c="#868684">Fertilizer</Title>
                <Center>
                <Title order={3} >
                  {fertilizerCount|| (fertilizerCount == 0) ? fertilizerCount|| "0" : 'Loading...'}
                  </Title>
                </Center>
              </Grid.Col>
            </Grid>
            {/* <Button type="submit" radius="md" w={200} color="#83E819">
              Generate Reports
            </Button> */}
            <Space h="lg" />
            <Divider my="lg" w="100%" />
            <Group justify="center" gap="xl" >
   {recommendationData && recommendationData.map((value,index)=>{
    return     <Card shadow="sm" padding="lg" radius="md" w={isLargeScreen?"25%":"90%"}  withBorder>
    <Card.Section>
    <Image height={200} width={90} radius="lg" src={`/recommendation_images/${value["recommendation_type"]}.jpg`} />
    </Card.Section>

    <Group justify="space-between" mt="md" mb="xs">
      <Text fw={500}>{value["recommendation_description"]!=""?value["recommendation_description"]:"No name"}</Text>
      <Badge color={value["recommendation_type"]=="crop"?"green":"brown"}>{value["recommendation_type"]}</Badge>
    </Group>

    {/* <Text size="sm" c="dimmed">
      With Fjord Tours you can explore more of the magical fjord landscapes with tours and
      activities on and around the fjords of Norway
    </Text> */}
    <Text size="sm" c="dimmed">Quantity: {value["recommend_count"]}</Text>
     <Text size="sm" c="dimmed">Last Requested: {value["created_at"]}</Text>
     

    <Button  color="#83E819" fullWidth mt="md" radius="md" onClick={()=>{

      setActiveRecommendationType(value["recommendation_type"])
      setActiveRecommendationName(value["recommendation_description"])
      setItemsRecommended(value["recommendation"])
      openDetailModal()
    }}>
      See More Details
    </Button>
  </Card>
  //   return <Paper key={index} shadow="sm" radius="md" p="md" mb="lg" w="90%" bg="#F0F0F0">
  //   <Grid>
  //     <Grid.Col span={isLargeScreen ? 3 : 12}>
  //       <Image height={200} width={90} radius="lg" src={`/recommendation_images/crops.jpg`} />
  //     </Grid.Col>
  //     <Grid.Col span={isLargeScreen ? 3 : 12}>
  //       <Title order={3}>{value["recommendation_description"]!=""?value["recommendation_description"]:"No name"}</Title>
  //       <Stack h="50%" justify="flex-end" align="start" gap={0}>
  //         <Group gap={100}>
  //           <Text>Crops:</Text>
  //           <Text fw={500}>{value["recommend_count"]}</Text>
  //         </Group>
  //       </Stack>
  //     </Grid.Col>
  //     <Grid.Col span={isLargeScreen ? 3 : 12}>
  //       <Stack h="100%" justify="flex-end" align="flex-end" gap={0}>
  //         <Text fw={500}>Last Requested: {value["created_at"]}</Text>
  //       </Stack>
  //     </Grid.Col>
  //   </Grid>
  // </Paper>
   })}
   </Group>
            
  
          </Stack>
        </LayoutNav>
        <Modal
        size="xl"
        opened={openedDetailModal}
        withCloseButton={false}
        onClose={closeDetailModal}
        yOffset="10vh"
        centered
        radius="md"
        
      >
             <Modal.Header>
          <Modal.Title>
            <Title pt="sm" order={3}>
            {activeRecommendationName}
            </Title>
            <Text fw={900} c="gray">{activeRecommendationType}</Text>
          </Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        {activeRecommendationType=="crop"?
   itemsRecommended.map((crop, index) => (
        <Card key={index}>
          <Flex>
            <div >
              <Text fw={500} size="lg">{crop.crop}</Text>
              <Badge color={crop.confidence > 70 ? "green" : crop.confidence > 30 ?"yellow":"red"} ml={-10} >
                Yield : {crop.confidence.toFixed(2)}
              </Badge>
            
            </div>
      
            <div style={{paddingLeft:"20px"}}>
              <Text size="sm" >{crop.details.description}</Text>
              <Flex wrap="wrap" gap="md">
                <Text size="sm"><b>Category:</b> {crop.details.category}</Text>
                <Text size="sm"><b>Food Type:</b> {crop.details.food_type}</Text>
                <Text size="sm"><b>Planting:</b> {crop.details.planting_season}</Text>
                <Text size="sm"><b>Harvesting:</b> {crop.details.harvesting_season}</Text>
                {/* <Text size="sm"><b>Price:</b> {crop.details.price === 0 ? "N/A" : `{crop.details.price}`}</Text> */}
              
              </Flex>
            </div>
          </Flex>
        </Card>
      ))
   :   itemsRecommended.map((fertilizer, index) => (
    <Card key={index} className="shadow-lg">
      <Flex>
        <div >
          <Text fw={500} size="lg">{fertilizer.fertilizer}</Text>
          <Badge color={fertilizer.confidence > 70 ? "green" : fertilizer.confidence > 30 ?"yellow":"red"} className="mt-2">
            Confidence: {fertilizer.confidence}%
          </Badge>
        </div>
        <div style={{paddingLeft:"20px"}}>
          <Text size="sm" className="mb-2">{fertilizer.details.description}</Text>
          <Flex wrap="wrap" gap="md">
            <Text size="sm"><b>Quantity:</b> {fertilizer.details.quantity} {fertilizer.details.unit}</Text>
            <Text size="sm"><b>Price Range:</b> {fertilizer.details.price_range}</Text>
            <Text size="sm"><b>Max Price:</b> TZS {fertilizer.details.maximum_price}</Text>
            <Text size="sm"><b>How to Use:</b> {fertilizer.details.how_to_use}</Text>
          </Flex>
        </div>
      </Flex>
    </Card>
  ))}
          

        </Modal>
      </>
    );
  }

  export default ProfilePage
  