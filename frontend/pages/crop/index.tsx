import {
  Group,
  Container,
  Divider,
  Title,
  useMantineTheme,
  Text,
  Flex,
  Image,
  AppShell,
  Burger,
  Skeleton,
  Grid,
  Paper,
  Anchor,
  Button,
  Checkbox,
  PasswordInput,
  Stack,
  TextInput,
  Center,
  Collapse,
  UnstyledButton,
  Space,
  rem,
  ScrollArea,
  Popover,
  NumberInput,
  Select,
  CloseButton,
  Card,
  Modal,
  Autocomplete,
  Loader,
  Alert,
} from '@mantine/core';
import { useDisclosure, useMediaQuery, useScrollIntoView, useToggle } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import LayoutNav from '../Layout';
import dynamic from 'next/dynamic';
import { useForm } from '@mantine/form';
import {
  IconCalendar,
  IconChevronDown,
  IconCurrentLocation,
  IconInfoCircle,
  IconLocation,
  IconMap,
  IconMapPin,
  IconPin,
  IconSearch,
} from '@tabler/icons-react';
import { createContext, useEffect, useState } from 'react';
import { useAuth } from '@/context/Authentication';
import { useScreenHeight } from '@/components/Utils/ScreenHeight';
import { BarChart } from '@/components/Crop/barchart';
import OpenAIChat from '@/components/Crop/descriptionOpenAI';
import { debounce } from 'lodash';
import { url } from 'inspector';

export const LocationContext = createContext({});

const MapComponent = dynamic(() => import('@/components/Crop/map'), {
  ssr: false, // Disable server-side rendering
  loading: () => <div>Loading Map...</div>,
});

export default function CropPage() {
  var tzsFormatter = new Intl.NumberFormat('sw-TZ', {
    style: 'currency',
    currency: 'TZS',
  });
  const screenHeight = useScreenHeight();
  const { user, logout_user, loggedIn, get_user_data } = useAuth();
  const url = process.env.URL;
  const [location, setLocation] = useState([0, 0]);
  const [tempData, setTempData] = useState<
    { crop: string; confidence: number; show: boolean; details: any }[]
  >([]);
  const [predictedCrops, setPredictedCrops] = useState<
    { crop: string; confidence: number; show: boolean; details: any }[]
  >([]);
  const [soilData, setSoilData] = useState<{
    Nitrogen: number;
    Potassium: number;
    Phosphorus: number;
    ph: number;
    bulk_density: number | string;
    landcover: string;
    temperature: number;
    humidity: number;
    rainfall: number;
    moisture: number | string;
  }>({
    Nitrogen: 0.0,
    Potassium: 0,
    Phosphorus: 0,
    ph: 0,
    bulk_density: 0,
    landcover: 'Unknown',
    temperature: 0,
    humidity: 0,
    rainfall: 0,
    moisture: 0,
  });
  const [manualPrediction, setManualPrediction] = useState(false);

  const [opened, { toggle }] = useDisclosure(false);
  const [openForm, setOpenForm] = useState(false);
  const [crop_loader, setCropLoader] = useState(false);
  const theme = useMantineTheme();
  const isLargeScreen = useMediaQuery(`(min-width: 644px)`);
  const [type, toggle1] = useToggle(['login', 'register']);
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [globalLocation, setGlobalLocation] = useState([-5.5504, 35.3321]);
  const [openPopOver, setOpenPopOver] = useState(false);
  const [openMaps, setOpenMaps] = useState(true);
  const [measurements, setMeasurements] = useState(['']);
  const [foodCategoryFilter, setFoodCategoryFilter] = useState<string[]>(['']);
  const [foodTypeFilter, setFoodTypeFilter] = useState<string[]>(['']);
  const [recommendPlaces, setRecommendPlaces] = useState<string[]>(['']);
  const [allRecommendInfo, setallRecommendInfo] = useState<any[]>([]);
  const [saveRecommendationLoader, setSaveRecommendationLoader] = useState<boolean>(false);
  const [recommendationName, setRecommendationName] = useState<string>('');
  const [dropdownOpened, { open:openSearchDropDown,close:closeSearchDropDown }] = useDisclosure();
  // const [foodCategoryFilter,setFoodCategoryFilter] = useState([])
  const [loaderMapSearch,setLoaderMapSearch] = useState<boolean>(false);
  const [cropRequirements, setCropRequirements] = useState<{
    crop: string;
    description:string;
    requirements: {
      nitrogen: number;
      potassium: number;
      phosphorus: number;
      pH: number;
      bulk_density: number;
    };
  }>({
    crop: '',
    description:"",
    requirements: {
      nitrogen: 0.0,
      potassium: 0,
      phosphorus: 0,
      pH: 0,
      bulk_density: 0,
    },
  });

  const { scrollIntoView: srollIntoCropDetails, targetRef: cropDetailsTarget } =
    useScrollIntoView<HTMLDivElement>({
      offset: 60,
    });
  const { scrollIntoView: srollIntoCoordinatesBox, targetRef: coordinatesBoxTarget } =
    useScrollIntoView<HTMLDivElement>({
      offset: 60,
    });

  //   const [type, toggle] = useToggle(['login', 'register']);
  const form = useForm({
    initialValues: {
      latitude: '',
      longitude: '',
    },

    // validate: {
    //   email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
    //   password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    // },
  });

  const categoryform = useForm({
    initialValues: {
      Cereals: true,
      Legumes: true,
      Fruit: true,
      Fibers: true,
      Beverage: true,
      "Grass plant":true
    },

    onValuesChange: (values) => {},
  });

  const foodtypeform = useForm({
    initialValues: {
      'Cash Crop': true,
      'Food Crop': true,
    },

    onValuesChange: (values) => {},
  });

  const yieldform = useForm({
    initialValues: {
      high: true,
      medium: true,
      low: true,
    },

    onValuesChange: (values) => {},

    // Medium confidence crops
  });
  const [openedDetailModal, { open: openDetailModal, close: closeDetailModal }] =
    useDisclosure(false);
  const [
    openedSaveRecommendationModal,
    { open: openSaveRecommendationModal, close: closeSaveRecommendationModal },
  ] = useDisclosure(false);

  useEffect(() => {
    console.log(yieldform.values);
    console.log(predictedCrops);
    predictedCrops.forEach((item) => {
      if (item.confidence > 60) {
        item.show = yieldform.values.high;
      }

      if (item.confidence <= 60 && item.confidence > 30) {
        item.show = yieldform.values.medium;
      }

      if (item.confidence <= 30) {
        item.show = yieldform.values.low;
      }
    });
    const updatedCrops = [...predictedCrops];

    console.log(updatedCrops);

    setPredictedCrops(updatedCrops);
  }, [yieldform.values.high, yieldform.values.medium, yieldform.values.low]);

  useEffect(() => {
    const new_filter: string[] = [''];

    Object.keys(categoryform.values).forEach((key) => {
      if (categoryform.getValues()[key as keyof typeof categoryform.values]) {
        new_filter.push(key);
      }
    });

    // Assuming `updatedCrops` is computed based on `new_filter`
    const newFilterToUpdate = [...new_filter];
    console.log('Hereeeee');
    console.log(newFilterToUpdate); // Replace with your logic to update crops
    setFoodCategoryFilter(newFilterToUpdate);
  }, [categoryform.getValues()]);

  useEffect(() => {
    const new_filter: string[] = [''];

    Object.keys(foodtypeform.values).forEach((key) => {
      if (foodtypeform.getValues()[key as keyof typeof foodtypeform.values]) {
        new_filter.push(key);
      }
    });

    const newFilterToUpdate = [...new_filter];
    console.log('Hereeeee');
    console.log(newFilterToUpdate); // Replace with your logic to update crops
    setFoodTypeFilter(newFilterToUpdate);
  }, [foodtypeform.getValues()]);

  const manualForm = useForm({
    initialValues: {
      nitrogen: '',
      potassium: '',
      phosphorus: '',
      ph: '',
      temperature: '',
      humidity: '',
      rainfall: '',
    },
    validate: {
      nitrogen: (value) => (typeof value === 'string' && value.trim() === '' ? 'Nitrogen is required' : null),
      potassium: (value) => (typeof value === 'string' && value.trim() === '' ? 'Potassium is required' : null),
      phosphorus: (value) => (typeof value === 'string' && value.trim() === '' ? 'Phosphorus is required' : null),
      ph: (value) => (typeof value === 'string' && value.trim() === '' ? 'pH is required' : null),
      temperature: (value) => (typeof value === 'string' && value.trim() === '' ? 'Temperature is required' : null),
      humidity: (value) => (typeof value === 'string' && value.trim() === '' ? 'Humidity is required' : null),
      rainfall: (value) => (typeof value === 'string' && value.trim() === '' ? 'Rainfall is required' : null),
    },
  });

  const getAutocompleteSuggestions = async (query: string) => {
    setLoaderMapSearch(true)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}&addressdetails=1&limit=5`,
      {
        method: 'GET',
      }
    ).catch((e) => {
      setCropLoader(false);
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
  const [valueSearch, setValueSearch] = useState('');

  // Function to handle the change event
  const handleChange = (event: any) => {
    console.log('market');
    setValueSearch(event);
  };

  // Debounced function to capture value after user stops typing
  const debouncedChangeHandler = debounce((newValue: string) => {
    console.log('User stopped typing, value:', newValue);
    getAutocompleteSuggestions(newValue);
    // Here you can add any action you want to perform after user stops typing
  }, 2000); // 300ms delay

  // Use effect to call debounced function whenever value changes
  // useEffect(() => {
  //   debouncedChangeHandler(valueSearch);

  //   // Cleanup the debounced function
  //   return () => {
  //     debouncedChangeHandler.cancel();
  //   };
  // }, [valueSearch]);

  async function getcrops() {
    setPredictedCrops([]);
    setTempData([]);
    setManualPrediction(false);
    var response = await fetch(
      `${url}/v2/recommend/crop?latitude=${location[0]}&longitude=${location[1]}`,
      {
        method: 'GET',
      }
    ).catch((e) => {
      setCropLoader(false);
      console.log(e);
    });

    if (response) {
      var response_json = await response.json();
      console.log(response_json);

      const output = response_json['response'];
      const required_output = output['output'].map((item: any) => ({ ...item, show: true }));
      console.log(required_output);
      setPredictedCrops(required_output);
      setTempData(required_output);
      setSoilData(response_json['response']['data']);
      console.log(response_json['response']['data']);
      setMeasurements(response_json['response']['measurements']);
      console.log(response_json['response']['measurements']);
      setCropLoader(false);
    }
  }

  async function saveRecommendation() {
    setSaveRecommendationLoader(true);
    var response = await fetch(`${url}/data/recommendation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recommendation_type: 'crop',
        recommendation: predictedCrops,
        recommendation_description: recommendationName,
        soil_data: soilData,
        user_id: get_user_data()['id'],
        environmental_data: {},
      }),
    }).catch((e) => {
      setSaveRecommendationLoader(false);
      notifications.show({
        color:"red",
        message: "Failed to save recommendation"
      })
      console.log(e);
    });

    if (response) {
      var response_json = await response.json();
      setSaveRecommendationLoader(false);
      notifications.show({
        color:"green",
        message: "Saved Recommendation Successfully"
      })
      setRecommendationName('');
      console.log(response_json);
    } else {
      setSaveRecommendationLoader(false);
      notifications.show({
        color:"red",
        message: "Failed to save recommendation"
      })
    }
  }

  async function getcropsdummy() {
    setPredictedCrops([]);
    setTempData([]);
    setManualPrediction(false);
    var required_output = [
      {
        crop: 'Watermelon',
        confidence: 78,
        details: {
          description:
            'It require well-drained, sandy soils and plenty of space to spread along with regular watering, especially during fruit development.',
          price: 0,
          category: 'Fruit',
          food_type: 'Food Crop',
          planting_season: 'March-May',
          harvesting_season: 'June-August',
          required_nutrients: {
            nitrogen: 123,
            phosphorus: 45,
            potassium: 56,
            pH: 5,
            bulk_density: 1.3,
          },
        },
        show: true,
      },
      {
        crop: 'Jute',
        confidence: 47,
        details: {
          description:
            'It requires slightly acidic soils, adequate drainage, and moderate rainfall and often to areas with warm temperatures and well-drained soils.',
          price: 2345454,
          category: 'Fibers',
          food_type: 'Cash Crop',
          planting_season: 'March-May',
          harvesting_season: 'July-September',
          required_nutrients: {
            nitrogen: 123,
            phosphorus: 45,
            potassium: 56,
            pH: 5,
            bulk_density: 1.3,
          },
        },
        show: true,
      },
      {
        crop: 'Grapes',
        confidence: 15,
        details: {
          description:
            'It require well-drained, sandy-loam soils and plenty of sunlight also a dry climate during the fruiting season to prevent fungal diseases.',
          price: 3434322,
          category: 'Fruit',
          food_type: 'Cash Crop',
          planting_season: 'September-November',
          harvesting_season: 'February-April',
          required_nutrients: {
            nitrogen: 123,
            phosphorus: 45,
            potassium: 56,
            pH: 5,
            bulk_density: 1.3,
          },
        },
        show: true,
      },
    ];
    setPredictedCrops(required_output);
    setTempData(required_output);
    setSoilData({
      Nitrogen: 1.1,
      Potassium: 163,
      Phosphorus: 12.5,
      ph: 6.6,
      bulk_density: 1.36,
      landcover: 'Urban / built up',
      temperature: 26.32,
      humidity: 78.53,
      rainfall: 494.57,
      moisture: 0.52,
    });

    setMeasurements(['g/kg', 'ppm', 'ppm', '', 'g/cm3', '', '°C', '%', 'mm', 'm3']);

    setCropLoader(false);
  }

  async function downLoadPdfApi() {
    var response = await fetch(`${url}/download/pdf/crops`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ soil_data: soilData, crops: predictedCrops }),
    }).catch((error) => {
      console.error('Error Generate pdf api:', error);
      notifications.show({
        color:"red",
        message: "Failed Download"
      })
    });

    if (response) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'output.pdf';
      document.body.appendChild(a); // Append anchor to body
      a.click(); // Trigger download
      document.body.removeChild(a); // Remove anchor from body
      window.URL.revokeObjectURL(url);
      notifications.show({
        color:"green",
        message: "Successful Download"
      })
    }
  }

  async function getCropsManually() {
    setPredictedCrops([]);
    setManualPrediction(true);
    setTempData([]);
    const params = {
      N: manualForm.values.nitrogen,
      P: manualForm.values.phosphorus,
      K: manualForm.values.potassium,
      ph: manualForm.values.ph,
      temperature: manualForm.values.temperature,
      humidity: manualForm.values.humidity,
      rainfall: manualForm.values.rainfall,
    };
    console.log(params);
    const queryString = new URLSearchParams(params).toString();

    var response = await fetch(`${url}/predict/crop?${queryString}`, {
      method: 'GET',
    }).catch((e) => {
      setCropLoader(false);
      console.log(e);
    });

    if (response) {
      var response_json = await response.json();
      console.log(response_json);

      const output = response_json['response'];

      const required_output = output.map((item: any) => ({ ...item, show: true }));
      console.log(required_output);
      setPredictedCrops(required_output);
      setSoilData({
        Nitrogen: parseFloat(manualForm.values.nitrogen)/100,
        Potassium: parseFloat(manualForm.values.potassium),
        Phosphorus: parseFloat(manualForm.values.phosphorus),
        ph: parseFloat(manualForm.values.ph),
        bulk_density: 'Unknown',
        landcover: 'Unknown',
        temperature: parseFloat(manualForm.values.temperature),
        humidity: parseFloat(manualForm.values.humidity),
        rainfall: parseFloat(manualForm.values.rainfall),
        moisture: 'Unknown',
      });
      setTempData(required_output);
      setCropLoader(false);
    }
    setCropLoader(false)
  }

  return (
    <>
      <LayoutNav>
        <Grid>
          <Grid.Col span={isLargeScreen ? 3 : 12} pt={0} mt={-8}>
            <Paper
              radius={0}
              p="xl"
              mb="2px"
              withBorder
              shadow="xl"
              style={{ borderLeft: 0, boxShadow: '4px 0px 8px rgba(0, 0, 0, 0.1)' }}
            >
              <form
                onSubmit={form.onSubmit(() => {
                  getcrops()
                  // getcropsdummy();
                })}
              >
                <Stack>
                  <div ref={cropDetailsTarget}></div>
                  <Popover
                    width={200}
                    position="bottom"
                    withArrow
                    shadow="md"
                    opened={openPopOver}
                    onChange={setOpenPopOver}
                  >
                    <Popover.Target>
                      <TextInput
                        label="Location Coordinates"
                        description="Provide a location for recommendations"
                        placeholder="Enter your location coordinates"
                        value={`lat: ${location[0].toFixed(4)} , long ${location[1].toFixed(4)}`}
                        leftSection={<IconMap style={{ width: rem(18), height: rem(18) }} />}
                        radius="md"
                        onClick={() => {
                          setOpenPopOver(true);
                        }}
                      />
                    </Popover.Target>
                    <Popover.Dropdown w="300">
                      {openForm ? (
                        <form
                          onSubmit={() => {
                            setLocation([latitude as number, longitude as number]);
                            setOpenPopOver(false);
                          }}
                        >
                          <Stack gap="xs">
                            <NumberInput
                              required
                              label="Latitude"
                              value={latitude}
                              onChange={(value) => {
                                setLatitude(value as number);
                              }}
                              hideControls
                            />
                            <NumberInput
                              required
                              label="Longitude"
                              value={longitude}
                              onChange={(value) => {
                                setLongitude(value as number);
                              }}
                              hideControls
                            />
                            <Group justify="center" gap="xl" grow>
                              <UnstyledButton
                                style={{ textDecoration: 'underline' }}
                                onClick={() => {
                                  setOpenForm(false);
                                }}
                              >
                                Back
                              </UnstyledButton>
                              <Button type="submit" radius="md" w={100} color="#83E819">
                                Save
                              </Button>
                            </Group>
                          </Stack>{' '}
                        </form>
                      ) : (
                        <>
                          <Group grow>
                            <UnstyledButton
                              pb="xs"
                              onClick={() => {
                                if ('geolocation' in navigator) {
                                  // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
                                  navigator.geolocation.getCurrentPosition(({ coords }) => {
                                    const { latitude, longitude } = coords;
                                    setLocation([latitude, longitude]);
                                    setOpenPopOver(false);
                                  });
                                }
                              }}
                            >
                              {<IconCurrentLocation size={15} />} Get your Location
                            </UnstyledButton>
                          </Group>
                          <Divider />
                          <Group grow>
                            <UnstyledButton
                              py="xs"
                              onClick={() => {
                                setOpenForm(true);
                              }}
                            >
                              {<IconPin size={15} />} Enter Coordinates
                            </UnstyledButton>
                          </Group>
                          <Divider />
                          <Group grow>
                            <UnstyledButton
                              py="xs"
                              onClick={() => {
                                setOpenMaps(true);
                                setPredictedCrops([]);
                                srollIntoCropDetails({
                                  alignment: 'center',
                                });
                              }}
                            >
                              {<IconMap size={15} />} Use Maps
                            </UnstyledButton>
                          </Group>
                          <Divider />
                        </>
                      )}
                    </Popover.Dropdown>
                  </Popover>

                  {/* <Select
                    leftSection={<IconCalendar style={{ width: rem(18), height: rem(18) }} />}
                    label="Crop Recommendation Type"
                    description="Duration the crop will be grown"
                    placeholder="Annual"
                    data={["Annual"]}
                  /> */}

                  <Center>
                  
                    <Button
                      type="submit"
                      radius="md"
                      w={300}
                      color="#83E819"
                      onClick={() => {
                        srollIntoCropDetails({
                          alignment: 'center',
                        });
                        setOpenMaps(false);
                        setCropLoader(true);
                      }}
                    >
                      Recommend
                    </Button>
                  </Center>
                  <Divider
                    label={
                      <UnstyledButton onClick={toggle}>
                        <>
                          <Group gap={0}>
                            <IconChevronDown /> <Text size="sm">Enter Data Manually</Text>
                          </Group>
                        </>
                      </UnstyledButton>
                    }
                  />
                </Stack>
              </form>
              <Collapse in={opened}>
                <form
                  onSubmit={manualForm.onSubmit(() => {
                    manualForm.validate();

                    if(manualForm.isValid()){
                    srollIntoCropDetails({
                      alignment: 'center',
                    });
                    setCropLoader(true);
                    setOpenMaps(false);
                    getCropsManually();
                    }
                  })}
                >
                  <Stack pt="md">
                    <NumberInput
                      hideControls
                      description="ppm"
                      label="Nitrogen"
                      placeholder="78.4"
                      min={0}
                      radius="md"
                      {...manualForm.getInputProps('nitrogen')}
                    />

                    <NumberInput
                      hideControls
                      description="ppm"
                      label="Potassium"
                      placeholder="78.4"
                      min={0}
                      radius="md"
                      {...manualForm.getInputProps('potassium')}
                    />

                    <NumberInput
                      hideControls
                      description="ppm"
                      label="Phosphorus"
                      placeholder="78.4"
                      min={0}
                      radius="md"
                      {...manualForm.getInputProps('phosphorus')}
                    />

                    <NumberInput
                      hideControls
                      label="Ph"
                      placeholder="7"
                      radius="md"
                      min={0}
                      max={14}
                      {...manualForm.getInputProps('ph')}
                    />
                    <NumberInput
                      hideControls
                      description="°C"
                      label="Temperature"
                      placeholder="25"
                      radius="md"
                      min={-273}
                      max={50}
                      {...manualForm.getInputProps('temperature')}
                    />

                    <NumberInput
                      hideControls
                      description="%"
                      label="Humidity"
                      placeholder="80"
                      radius="md"
                      min={0}
                      max={100}
                      {...manualForm.getInputProps('humidity')}
                    />

                    <NumberInput
                      hideControls
                      description="mm"
                      label="Rainfall"
                      placeholder="200"
                      min={0}
                      radius="md"
                      {...manualForm.getInputProps('rainfall')}
                    />
                    <Center>
                      {' '}
                      <Button type="submit" radius="md" w={300} color="#83E819">
                        Recommend
                      </Button>
                    </Center>
                  </Stack>
                </form>
              </Collapse>
            </Paper>

            <Paper
              h="500px"
              radius={0}
              p="xl"
              withBorder
              shadow="xl"
              style={{ borderLeft: 0, boxShadow: '4px 0px 8px rgba(0, 0, 0, 0.1)' }}
            >
              <Stack>
                {/* <Title order={4}>Popular Filters</Title>
                <Checkbox
                  color='#83E819'
                  size='xs'
                  defaultChecked
                  disabled
                  label={<Text size="sm">Low Cost Crops</Text>}
                />
                <Checkbox
                  color='#83E819'
                  size='xs'
                  defaultChecked
                  disabled
                  label={<Text size="sm">High Yielding Crops</Text>}

                />
                <Checkbox
                  color='#83E819'
                  size='xs'
                  defaultChecked
                  disabled
                  label={<Text size="sm">Medium Yielding Crops</Text>}
                /> */}

                <Title order={4}>Category of Crops</Title>
                <Group gap="lg" w="60%">
                  {Object.keys(categoryform.getValues()).map((value, index) => {
                    return (
                      <Checkbox
                        color="#83E819"
                        size="xs"
                        defaultChecked
                        label={<Text size="sm">{value}</Text>}
                        {...categoryform.getInputProps(value)}
                      />
                    );
                  })}
                </Group>
                <Title order={4}>Type of Crops</Title>
                <Group gap="lg" w="60%">
                  {Object.keys(foodtypeform.getValues()).map((value, index) => {
                    return (
                      <Checkbox
                        color="#83E819"
                        size="xs"
                        defaultChecked
                        label={<Text size="sm">{value}</Text>}
                        {...foodtypeform.getInputProps(value)}
                      />
                    );
                  })}
                </Group>
                <Title order={4}>{manualPrediction?"Confidence":"Yield Potential"}</Title>
                <Checkbox
                  color="#83E819"
                  size="xs"
                  defaultChecked
                  label={<Text size="sm">High</Text>}
                  {...yieldform.getInputProps('high')}
                />
                <Checkbox
                  color="#83E819"
                  size="xs"
                  defaultChecked
                  label={<Text size="sm">Medium</Text>}
                  {...yieldform.getInputProps('medium')}
                />
                <Checkbox
                  color="#83E819"
                  size="xs"
                  defaultChecked
                  label={
                    <Text mt={-5} size="sm">
                      Low
                    </Text>
                  }
                  {...yieldform.getInputProps('low')}
                />
              </Stack>
            </Paper>
          </Grid.Col>

          <Grid.Col span={isLargeScreen ? 9 : 12}>
            <Stack pl="lg">
              <Title order={isLargeScreen?2:3} ref={cropDetailsTarget}>
                Crop Details
              </Title>
              {predictedCrops.length > 0 && !manualPrediction && !["Urban / built up","Permanent water bodies"].includes(soilData["landcover"])&& (<Group align='flex-start'>
                <Card
                  shadow="sm"
                  p="lg"
                  radius="md"
                  withBorder
                  bg="#FAFAFA"
                  w={isLargeScreen ? '40%' : '100%'}
                >
                  <Title order={4}>Soil Data</Title>
                  {Object.entries(soilData).map(([key, value], index) => (
                    <Group key={key}  grow>
                      <Text c="gray">{key.charAt(0).toUpperCase() + key.slice(1)}:</Text>
                      <Text fw={500}>{value}</Text>
                      <Text fw={500}>{measurements[index]}</Text>
                    </Group>
                  ))}
                </Card>
                <Card
                  shadow="sm"
                  p="lg"
                  radius="md"
                  withBorder
                  bg="#FAFAFA"
                  w={isLargeScreen ? '40%' : '100%'}
                >
                 <Text fw={500}>Yield Potential:</Text>
                 <Text >Harvested economic yield in metric tonnes per hectare per harvested area reported at standard moisture content appropriate for each commodity. 1 tonne is 1000 kg.</Text>
                </Card>
                </Group>
              )}

              {openMaps && (
                <div style={{ width: isLargeScreen ? '95%' : '98%' }}>
                  <Group justify="flex-end" pb="md">
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
                      label="Search for Location"
                      mt={-20}
                      style={{ width: 300 }}
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
                    <Paper bg="#F0F0F0" shadow="sm" radius="lg" withBorder>
                      <Text p="xs" fw={500} fz="sm">
                        {' '}
                        lat: {globalLocation[0].toFixed(4)}
                      </Text>
                    </Paper>
                    <Paper bg="#F0F0F0" shadow="sm" radius="lg" withBorder>
                      <Text p="xs" fw={500} fz="sm">
                        long: {globalLocation[1].toFixed(4)}
                      </Text>
                    </Paper>
                    <Button
                      color="#83E819"
                      onClick={() => {
                        setLocation(globalLocation);
                        srollIntoCoordinatesBox({
                          alignment: 'center',
                        });
                        notifications.show({
                          color:"green",
                          message: "Location Updated"
                        })
                      }}
                    >
                      Use the Location
                    </Button>
                    <CloseButton
                      onClick={() => {
                        setOpenMaps(false);
                      }}
                    />
                  </Group>
                  <LocationContext.Provider value={{ globalLocation, setGlobalLocation }}>
                    <MapComponent />
                  </LocationContext.Provider>
                </div>
              )}

              {crop_loader ? (
                <>
                  {' '}
                  
                  <Center pt="lg" style={{ height: isLargeScreen ? `400px` : '200px' }}>
                   
                    <div className="loader" style={{ zIndex: 9998 }}>
                      <div className="loader-square"></div>
                      <div className="loader-square"></div>
                      <div className="loader-square"></div>
                      <div className="loader-square"></div>
                      <div className="loader-square"></div>
                      <div className="loader-square"></div>
                      <div className="loader-square"></div>
                    </div>
                  </Center>
                 
                 
                </>
              ) :(!manualPrediction && !openMaps && ["Urban / built up","Permanent water bodies"].includes(soilData["landcover"]) )?
              <Alert variant="outline" color="yellow" title={<Text fw={900} fz="lg">Invalid Area</Text>} icon= {<IconInfoCircle />} w={isLargeScreen?"50%":"100%"}>
             Satellite imagery indicates the area lacks suitable planting grounds, possibly due to the presence of structures or challenging terrain.
            </Alert>
              
              
              : (
                <>
                  {/* <ScrollArea h={800} scrollbars="y"> */}
                  <Stack>
                    {predictedCrops.length != 0 && (
                      <Group justify={isLargeScreen ? 'flex-end' : 'flex-start'}>
                        <Button
                          onClick={() => {
                            downLoadPdfApi();
                          }}
                          variant="outline"
                          color="#83E819"
                        >
                          Download pdf
                        </Button>
                        {loggedIn && (
                          <Button
                            variant="outline"
                            color="#83E819"
                            loading={saveRecommendationLoader}
                            onClick={() => {
                              openSaveRecommendationModal();
                              // saveRecommendation()
                            }}
                          >
                            Save Recommendation
                          </Button>
                        )}
                      </Group>
                    )}
                    {predictedCrops.length != 0 ? predictedCrops.map(
                      (
                        value: { crop: string; confidence: number; show: boolean; details: any },
                        index
                      ) => {
                        return value['show'] &&
                          foodCategoryFilter.includes(value['details']['category']) &&
                          foodTypeFilter.includes(value['details']['food_type']) && (!manualPrediction || value["confidence"] > 0) ? (
                          <Paper
                            key={index}
                            shadow="sm"
                            radius="md"
                            p="md"
                            w={isLargeScreen ?"90%":"95%"}
                            bg="#F0F0F0"
                            withBorder
                          >
                            <Grid>
                              <Grid.Col span={isLargeScreen ? 3 : 12}>
                                <Image
                                  height={200}
                                  width={90}
                                  radius="lg"
                                  src={`/crops_images/${value['crop']}.jpg`}
                                />
                              </Grid.Col>
                              <Grid.Col span={isLargeScreen ? 6 : 12}>
                                <Stack gap={0}>
                                  <Title order={3}>{value['crop']} Crop</Title>
                                  <Space h="lg" />
                                  <Text fz="sm">
                                    Planting Season: {value['details']['planting_season']}
                                  </Text>
                                  <Space h="md" />
                                  <Text fz="sm" p={0}>
                                    Crop Type: {value['details']['food_type']}
                                  </Text>
                                  <Text fz="sm">
                                    Crop Harvest: {value['details']['harvesting_season']}
                                  </Text>
                                  <Space h="lg" />
                                  <Paper
                                    w="100px"
                                    withBorder
                                    shadow="md"
                                    radius="md"
                                    py={2}
                                    px="xs"
                                  >
                                    <Text>#{value['details']['category']}</Text>
                                  </Paper>
                                </Stack>
                              </Grid.Col>
                              <Grid.Col span={isLargeScreen ? 3 : 12}>
                                <Flex
                                h="100%"
                                  gap="xl"
                                  justify="flex-end"
                                  align="flex-end"
                                  direction={isLargeScreen ? 'column' : 'row'}
                                  wrap="wrap"
                                  
                                >
                                  <Group>
                                    <Text fw={500}>{manualPrediction?"Confidence":value["confidence"]<0?"":"Yield Potential"}</Text>
                                    {value["confidence"]>0 &&
                                    <Paper
                                    
                                      bg={
                                        manualPrediction ? (value['confidence'] < 50
                                          ? '#EAD106'
                                          :  'green'):(value['confidence'] < 25
                                            ? '#EAD106':'green')
                                      }
                                      withBorder
                                      shadow="md"
                                      radius="md"
                                      py={2}
                                      px="xs"
                                    >
                                      <Text c="white">{value['confidence'].toFixed(2)} </Text>
                                    </Paper>}
                                  </Group>
                                  {isLargeScreen && (
                                    <Space h={value['details']['price'] != 0 ? 10 : 50} />
                                  )}
                                  {value['details']['price'] != 0 ? (
                                    <Text fw={500}>
                                      {tzsFormatter.format(value['details']['price'] / 100)} /= per
                                      kg
                                    </Text>
                                  ):<Space h="1px"/>}

                                  <Button
                                    bg="#83E819"
                                    onClick={() => {
                                      setCropRequirements({
                                        crop: value['crop'],
                                        description: value["details"]["description"],
                                        requirements: value['details']['required_nutrients'],
                                      });
                                      openDetailModal();
                                    }}
                                  >
                                    See Details
                                  </Button>
                                </Flex>
                              </Grid.Col>
                            </Grid>
                          </Paper>
                        ) : (
                          <></>
                        );
                      }
                    ): ( !openMaps && <>  <Alert variant="outline" w={isLargeScreen?"50%":"100%"} color="yellow" title="" icon={<IconInfoCircle />}>
                    <Text fw={500} fz="md">No Recommendations Available</Text>
                  </Alert></>)}
                  </Stack>
                  {/* </ScrollArea> */}
                </>
              )}
            </Stack>
          </Grid.Col>
        </Grid>
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
            {' '}
            <Title py="md" order={3}>
              Soil Nutrient Analysis ({cropRequirements['crop']})
            </Title>
          </Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>

        <Paper py="md" w="95%" h={300}>
          <BarChart
            data={{
              'actual values': [
                soilData['Nitrogen'],
                soilData['Phosphorus'],
                soilData['Potassium'],
                soilData['ph'],
               
              ],
              'required values': [
                cropRequirements['requirements']['nitrogen'],
                cropRequirements['requirements']['phosphorus'],
                cropRequirements['requirements']['potassium'],
                cropRequirements['requirements']['pH'],
  
              ],
            }}
          />
        </Paper>
        <Title pt="md" order={4}>
          Description
        </Title>
        <Text>{cropRequirements["description"]}</Text>
        <Title pt="md" order={4}>
          Analysis
        </Title>
        <OpenAIChat
          data={{
            crop: cropRequirements['crop'],
            'real values': soilData,
            'required values': cropRequirements['requirements'],
          }}
        />
      </Modal>
      <Modal
        opened={openedSaveRecommendationModal}
        withCloseButton={true}
        onClose={closeSaveRecommendationModal}
        yOffset="10vh"
      >
        <TextInput
          pb="md"
          label="Name the Recommendation"
          value={recommendationName}
          onChange={(value: any) => {
            setRecommendationName(value.target.value);
          }}
        />
        <Button
          color="#83E819"
          onClick={() => {
            saveRecommendation();
            closeSaveRecommendationModal();
          }}
        >
          Done
        </Button>
      </Modal>
    </>
  );
}
