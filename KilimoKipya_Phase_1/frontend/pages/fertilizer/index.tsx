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
  NativeSelect,
  NumberInput,
  Popover,
  rem,
  CloseButton,
  Card,
  Modal,
  Autocomplete,
  Loader,
  Alert,
} from '@mantine/core';
import { useDisclosure, useMediaQuery, useScrollIntoView, useToggle } from '@mantine/hooks';
import LayoutNav from '../Layout';
import dynamic from 'next/dynamic';
import { useForm } from '@mantine/form';
import {
  IconChevronDown,
  IconCurrentLocation,
  IconInfoCircle,
  IconMap,
  IconPin,
  IconSearch,
} from '@tabler/icons-react';
import { createContext, useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { BarChart } from '@/components/Fertilizer/barchart';
import OpenAIChat from '@/components/Fertilizer/descriptionOpenAI';
import { useAuth } from '@/context/Authentication';
import { withAuth } from '@/components/Authentication/AuthWrapper';

export const LocationContext = createContext({});

const MapComponent = dynamic(() => import('@/components/Fertilizer/map'), {
  ssr: false, // Disable server-side rendering
  loading: () => <div>Loading Map...</div>,
});

function FetilizerPage() {
  const url = process.env.URL;
  const { user, logout_user, loggedIn, get_user_data } = useAuth();
  var tzsFormatter = new Intl.NumberFormat('sw-TZ', {
    style: 'currency',
    currency: 'TZS',
  });
  const [crop_loader, setCropLoader] = useState(false);
  const [location, setLocation] = useState([0, 0]);
  const [opened, { toggle }] = useDisclosure(false);
  const theme = useMantineTheme();
  const [predicted_fertilizer, setPredictedFertilizer] = useState<[]>([]);
  const isLargeScreen = useMediaQuery(`(min-width: 644px)`);
  const [type, toggle1] = useToggle(['login', 'register']);
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [openForm, setOpenForm] = useState(false);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [globalLocation, setGlobalLocation] = useState([-5.5504, 35.3321]);
  const [manualPrediction, setManualPrediction] = useState(false);
  const [measurements, setMeasurements] = useState(['']);
  const [dropdownOpened, { open: openSearchDropDown, close: closeSearchDropDown }] =
    useDisclosure();
  const [valueSearch, setValueSearch] = useState('');
  const [allRecommendInfo, setallRecommendInfo] = useState<any[]>([]);
  const [recommendPlaces, setRecommendPlaces] = useState<string[]>(['']);
  const [saveRecommendationLoader, setSaveRecommendationLoader] = useState<boolean>(false);
  const [loaderMapSearch, setLoaderMapSearch] = useState<boolean>(false);
  const [
    openedSaveRecommendationModal,
    { open: openSaveRecommendationModal, close: closeSaveRecommendationModal },
  ] = useDisclosure(false);
  const [recommendationName, setRecommendationName] = useState<string>('');

  const { scrollIntoView: srollIntoCoordinatesBox, targetRef: coordinatesBoxTarget } =
    useScrollIntoView<HTMLDivElement>({
      offset: 60,
    });

  const [activeFertilizer, setActiveFertilizer] = useState<{
    fertilizer: string;
    description: string;
  }>({ fertilizer: '', description: '' });

  const [soilData, setSoilData] = useState<{
    Nitrogen: number;
    Potassium: number;
    Phosphorus: number;
    ph: number | undefined;
    bulk_density: number | undefined;
    landcover: string | undefined;
    temperature: number | undefined;
    humidity: number | undefined;
    rainfall: number | undefined;
    moisture: number | undefined;
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

  const [requiredSoilData, setRequiredSoilData] = useState<{
    nitrogen: number;
    potassium: number;
    phosphorus: number;
    pH: number;
    bulk_density: number;
  }>({
    nitrogen: 0.0,
    potassium: 0,
    phosphorus: 0,
    pH: 0,
    bulk_density: 0,
  });

  const [openPopOver, setOpenPopOver] = useState(false);
  const [openMaps, setOpenMaps] = useState(true);

  // const { scrollIntoView: srollIntoCoordinatesBox, targetRef: coordinatesBoxTarget } = useScrollIntoView<HTMLDivElement>({
  //   offset: 60,
  // });
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 60,
  });

  const fertilizerlocform = useForm({
    initialValues: {
      cropType: 'Maize',
      soilType: 'Sandy',
    },
  });

  //   const [type, toggle] = useToggle(['login', 'register']);
  const manualForm = useForm({
    initialValues: {
      nitrogen: '',
      potassium: '',
      phosphorus: '',
      soilMoisture: '',
      temperature: '',
      humidity: '',
      cropType: 'Maize',
      soilType: 'Sandy',
    },
    validate: {
      nitrogen: (value) =>
        typeof value === 'string' && value.trim() === '' ? 'Nitrogen is required' : null,
      potassium: (value) =>
        typeof value === 'string' && value.trim() === '' ? 'Potassium is required' : null,
      phosphorus: (value) =>
        typeof value === 'string' && value.trim() === '' ? 'Phosphorus is required' : null,
      soilMoisture: (value) =>
        typeof value === 'string' && value.trim() === '' ? 'Soil Moisture is required' : null,
      temperature: (value) =>
        typeof value === 'string' && value.trim() === '' ? 'Temperature is required' : null,
      humidity: (value) =>
        typeof value === 'string' && value.trim() === '' ? 'Humidity is required' : null,
    },
  });

  const [openedDetailModal, { open: openDetailModal, close: closeDetailModal }] =
    useDisclosure(false);

  const getAutocompleteSuggestions = async (query: string) => {
    setLoaderMapSearch(true);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}&addressdetails=1&limit=5`,
      {
        method: 'GET',
      }
    ).catch((e) => {
      setCropLoader(false);
      setLoaderMapSearch(false);
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
    setLoaderMapSearch(false);
  };
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

  async function getfertilzer() {
    var response = await fetch(
      `${url}/recommend/fertilizer?latitude=${location[0]}&longitude=${location[1]}&soil_type=${fertilizerlocform.values.soilType}&crop_type=${fertilizerlocform.values.cropType}`,
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

      setPredictedFertilizer(response_json['response']['output']);
      console.log(response_json['response']['data']);
      setSoilData(response_json['response']['data']);
      setRequiredSoilData(response_json['response']['required_nutrients']);
      setMeasurements(response_json['response']['measurements']);
      setManualPrediction(false);
      setCropLoader(false);
    }
  }

  async function getFertilizerManually() {
    setManualPrediction(true);
    const params = {
      nitrogen: manualForm.values.nitrogen,
      phosphorous: manualForm.values.phosphorus,
      potassium: manualForm.values.potassium,
      temperature: manualForm.values.temperature,
      humidity: manualForm.values.humidity,
      moisture: manualForm.values.soilMoisture,
      soil_type: manualForm.values.soilType,
      crop_type: manualForm.values.cropType,
    };
    console.log(params);
    const queryString = new URLSearchParams(params).toString();

    var response = await fetch(`${url}/predict/fertilizer?${queryString}`, {
      method: 'GET',
    }).catch((e) => {
      setCropLoader(false);
      console.log(e);
    });

    if (response) {
      var response_json = await response.json();
      console.log(response_json);

      const output = response_json['response'];
      setRequiredSoilData(response_json['required_nutrients']);
      setSoilData({
        Nitrogen: parseFloat(manualForm.values.nitrogen)/100,
        Potassium: parseFloat(manualForm.values.phosphorus),
        Phosphorus: parseFloat(manualForm.values.potassium),
        ph: undefined,
        bulk_density: undefined,
        landcover: 'Unknown',
        temperature: parseFloat(manualForm.values.temperature),
        humidity: parseFloat(manualForm.values.humidity),
        rainfall: undefined,
        moisture: parseFloat(manualForm.values.soilMoisture),
      });

      const required_output = output.map((item: any) => ({ ...item, show: true }));
      console.log(required_output);
      setPredictedFertilizer(required_output);
      setCropLoader(false);
    }
  }

  const confidenceform = useForm({
    initialValues: {
      high: true,
      medium: true,
      low: true,
    },
  });
  const [confidenceFilter, setConfidenceFilter] = useState<string[]>(['']);

  useEffect(() => {
    const new_filter: string[] = [''];

    Object.keys(confidenceform.values).forEach((key) => {
      if (confidenceform.getValues()[key as keyof typeof confidenceform.values]) {
        new_filter.push(key);
      }
    });

    // Assuming `updatedCrops` is computed based on `new_filter`
    const newFilterToUpdate = [...new_filter];
    console.log('Hereeeee');
    console.log(newFilterToUpdate); // Replace with your logic to update crops
    setConfidenceFilter(newFilterToUpdate);
  }, [confidenceform.getValues()]);

  const pricerangeform = useForm({
    initialValues: {
      high: true,
      medium: true,
      low: true,
    },
  });
  const [priceFilter, setPriceFilter] = useState<string[]>(['']);

  useEffect(() => {
    const new_filter: string[] = [''];

    Object.keys(pricerangeform.values).forEach((key) => {
      if (pricerangeform.getValues()[key as keyof typeof pricerangeform.values]) {
        new_filter.push(key);
      }
    });

    // Assuming `updatedCrops` is computed based on `new_filter`
    const newFilterToUpdate = [...new_filter];
    console.log('Hereeeee');
    console.log(newFilterToUpdate); // Replace with your logic to update crops
    setPriceFilter(newFilterToUpdate);
  }, [pricerangeform.getValues()]);

  async function downLoadPdfApi() {
    var response = await fetch(`${url}/download/pdf/fertilizer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ soil_data: soilData, fertilizer: predicted_fertilizer }),
    }).catch((error) => {
      console.error('Error Generate pdf api:', error);
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
        recommendation_type: 'fertilizer',
        recommendation: predicted_fertilizer,
        recommendation_description: recommendationName,
        soil_data: soilData,
        user_id: get_user_data()['id'],
        environmental_data: {},
      }),
    }).catch((e) => {
      setSaveRecommendationLoader(false);
      console.log(e);
    });

    if (response) {
      var response_json = await response.json();
      setSaveRecommendationLoader(false);
      setRecommendationName('');
      console.log(response_json);
    } else {
      setSaveRecommendationLoader(false);
    }
  }

  return (
    <>
      <LayoutNav>
        <Grid bg="#F0F0F0">
          <Grid.Col span={isLargeScreen ? 3 : 12} pt={0} mt={-8}>
            <Paper
              radius={0}
              p="xl"
              mb="2px"
              bg="#F0F0F0"
              withBorder
              shadow="xl"
              style={{ borderLeft: 0, boxShadow: '4px 0px 8px rgba(0, 0, 0, 0.1)' }}
            >
              <form>
                <Stack>
                  <Popover width={200} position="bottom" withArrow shadow="md">
                    <Popover.Target>
                      <TextInput
                        label="Location Coordinates"
                        placeholder="Enter your location coordinates"
                        value={`lat: ${location[0].toFixed(4)} , long ${location[1].toFixed(4)}`}
                        leftSection={<IconMap style={{ width: rem(18), height: rem(18) }} />}
                        radius="md"
                      />
                    </Popover.Target>
                    <Popover.Dropdown>
                      {openForm ? (
                        <Stack gap="xs">
                          <NumberInput
                            label="Latitude"
                            value={latitude}
                            onChange={(value) => {
                              setLatitude(value as number);
                            }}
                            hideControls
                          />
                          <NumberInput
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
                            <Button
                              type="submit"
                              radius="md"
                              w={100}
                              color="#83E819"
                              onClick={() => {
                                setLocation([latitude as number, longitude as number]);
                                setOpenPopOver(false);
                              }}
                            >
                              Save
                            </Button>
                          </Group>
                        </Stack>
                      ) : (
                        <>
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
                          <Divider />
                          <UnstyledButton
                            py="xs"
                            onClick={() => {
                              setOpenForm(true);
                            }}
                          >
                            {<IconPin size={15} />} Enter Coordinates
                          </UnstyledButton>
                          <Divider />
                          <UnstyledButton
                            py="xs"
                            onClick={() => {
                              setOpenMaps(true);
                              setPredictedFertilizer([]);
                              scrollIntoView({
                                alignment: 'center',
                              });
                            }}
                          >
                            {<IconMap size={15} />} Use Maps
                          </UnstyledButton>
                          <Divider />
                        </>
                      )}
                    </Popover.Dropdown>
                  </Popover>
                  <NativeSelect
                    label="Crop Type"
                    description="Choose Crop Type"
                    data={[
                      'Maize',
                      'Sugarcane',
                      'Cotton',
                      'Tobacco',
                      'Wheat',
                      'Millets',
                      'Ground Nuts',
                    ]}
                    {...fertilizerlocform.getInputProps('cropType')}
                  />
                  <NativeSelect
                    label="Soil Type"
                    description="Choose Soil Type"
                    data={[
                      'Sandy',

                      { label: 'Loam', value: 'Loamy' },
                      'Black',
                      'Red',
                      { label: 'Clay', value: 'Clayey' },
                    ]}
                    {...fertilizerlocform.getInputProps('soilType')}
                  />
                  <Center>
                    {' '}
                    <Button
                      radius="md"
                      w={300}
                      color="black"
                      onClick={() => {
                        scrollIntoView({ alignment: 'center' });
                        setOpenMaps(false);
                        setPredictedFertilizer([]);
                        setCropLoader(true);
                        getfertilzer();
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
                <form>
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
                      description="ppm"
                      label="Potassium"
                      placeholder="78.4"
                      min={0}
                      max={50}
                      radius="md"
                      {...manualForm.getInputProps('temperature')}
                    />

                    <NumberInput
                      description="Units (%)"
                      label="Humidity"
                      placeholder="80"
                      radius="md"
                      min={0}
                      max={100}
                      hideControls
                      {...manualForm.getInputProps('humidity')}
                    />
                    <NativeSelect
                      label="Crop Type"
                      description="Choose Crop Type"
                      data={[
                        'Maize',
                        'Sugarcane',
                        'Cotton',
                        'Tobacco',
                        'Wheat',
                        'Millets',
                        'Ground Nuts',
                      ]}
                      {...fertilizerlocform.getInputProps('cropType')}
                    />
                    <NativeSelect
                      label="Soil Type"
                      description="Choose Soil Type"
                      data={[
                        'Sandy',

                        { label: 'Loam', value: 'Loamy' },
                        'Black',
                        'Red',
                        { label: 'Clay', value: 'Clayey' },
                      ]}
                      {...fertilizerlocform.getInputProps('soilType')}
                    />

                    <TextInput
                      label="Soil Moisture"
                      placeholder="200"
                      radius="md"
                      min={0}
                      {...manualForm.getInputProps('soilMoisture')}
                    />
                    <Center>
                      {' '}
                      <Button
                        onClick={() => {
                          manualForm.validate();
                          if (manualForm.isValid()) {
                            setOpenMaps(false);

                            setCropLoader(true);
                            scrollIntoView({
                              alignment: 'center',
                            });
                            getFertilizerManually();
                          }
                        }}
                        radius="md"
                        w={300}
                        color="black"
                      >
                        Recommend
                      </Button>
                    </Center>
                  </Stack>
                </form>
              </Collapse>
            </Paper>

            <Paper
              radius={0}
              p="xl"
              bg="#F0F0F0"
              withBorder
              shadow="xl"
              style={{ borderLeft: 0, boxShadow: '4px 0px 8px rgba(0, 0, 0, 0.1)' }}
            >
              <Stack>
                <Title order={4}>Confidence</Title>
                {Object.keys(confidenceform.getValues()).map((value, index) => {
                  return (
                    <Checkbox
                      color="black"
                      variant="outline"
                      size="xs"
                      defaultChecked
                      label={<Text size="sm">{value}</Text>}
                      {...confidenceform.getInputProps(value)}
                    />
                  );
                })}

                <Title order={4}>Fertilizer Price</Title>
                <Checkbox
                  color="black"
                  variant="outline"
                  size="xs"
                  defaultChecked
                  label={<Text size="sm">Premium Price</Text>}
                  {...pricerangeform.getInputProps('high')}
                />
                <Checkbox
                  color="black"
                  variant="outline"
                  size="xs"
                  defaultChecked
                  label={<Text size="sm">Moderate Price</Text>}
                  {...pricerangeform.getInputProps('medium')}
                />

                <Checkbox
                  color="black"
                  variant="outline"
                  size="xs"
                  defaultChecked
                  label={<Text size="sm">Budget-friendly Price</Text>}
                  {...pricerangeform.getInputProps('low')}
                />
              </Stack>
            </Paper>
          </Grid.Col>
          <Grid.Col span={isLargeScreen ? 9 : 12} bg="#C3F2CB">
            <Stack pl="lg">
              <Text>Recommended Fertilizer Based on your location Coordinates and Crop grown</Text>
              <Title order={isLargeScreen ? 2 : 3} ref={targetRef}>
                Fertilizer Details
              </Title>

              {predicted_fertilizer.length > 0 && !manualPrediction && !["Urban / built up","Permanent water bodies"].includes(soilData["landcover"] as string)&& (
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
                    <Group key={key} grow>
                      <Text c="gray">{key.charAt(0).toUpperCase() + key.slice(1)}:</Text>
                      <Text fw={500}>{value}</Text>
                      <Text fw={500}>{measurements[index]}</Text>
                    </Group>
                  ))}
                </Card>
              )}

              {openMaps && (
                <div style={{ width: isLargeScreen ? '95%' : '98%' }}>
                  <Group justify="flex-end" pb="md">
                    <Autocomplete
                      dropdownOpened={dropdownOpened}
                      value={valueSearch}
                      onChange={handleChange}
                      onKeyDown={async (event) => {
                        if (event.key === 'Enter') {
                          await getAutocompleteSuggestions(valueSearch);
                          openSearchDropDown();
                        }
                      }}
                      onOptionSubmit={(value: string) => {
                        closeSearchDropDown();
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
                      label="Search for Location"
                      mt={-20}
                      style={{ width: 300 }}
                      rightSection={
                        loaderMapSearch ? (
                          <Loader size="xs" color="green" />
                        ) : (
                          <IconSearch
                            onClick={async () => {
                              await getAutocompleteSuggestions(valueSearch);
                              openSearchDropDown();
                            }}
                            style={{ width: rem(18), height: rem(18) }}
                            stroke={1.5}
                          />
                        )
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
                    <div className="loader">
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
              ) : !manualPrediction && !openMaps &&
                ['Urban / built up', 'Permanent water bodies'].includes(soilData['landcover'] as string) ? (
                <Alert
                  variant="outline"
                  color="gray"
                  title={
                    <Text fw={900} fz="lg">
                      Invalid Area
                    </Text>
                  }
                  icon={<IconInfoCircle />}
                  w={isLargeScreen ? '50%' : '100%'}
                >
                  Satellite imagery indicates the area lacks suitable planting grounds, possibly due
                  to the presence of structures or challenging terrain.
                </Alert>
              ) : (
                <Stack>
                  {predicted_fertilizer.length != 0 && (
                    <Group justify={isLargeScreen ? 'flex-end' : 'flex-start'}>
                      <Button
                        onClick={() => {
                          downLoadPdfApi();
                        }}
                        variant="outline"
                        color="black"
                      >
                        Download pdf
                      </Button>
                      {loggedIn && (
                        <Button
                          variant="outline"
                          color="black"
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

                  {predicted_fertilizer.length != 0
                    ? predicted_fertilizer.map(
                        (
                          value: {
                            fertilizer: string;
                            confidence: number;
                            confidence_range: string;
                            details: any;
                          },
                          index
                        ) => {
                          return (
                            confidenceFilter.includes(value['confidence_range']) &&
                            priceFilter.includes(value['details']['price_range']) &&
                            (!manualPrediction || value['confidence'] > 0) && (
                              <Paper
                                key={index}
                                shadow="sm"
                                radius="md"
                                p="md"
                                w={isLargeScreen ? '90%' : '95%'}
                                bg="#F0F0F0"
                              >
                                <Grid>
                                  <Grid.Col span={isLargeScreen ? 3 : 12}>
                                    <Image
                                      height={200}
                                      width={90}
                                      radius="lg"
                                      src={`/fertilizer_images/${value['fertilizer']}.jpg`}
                                    />
                                  </Grid.Col>
                                  <Grid.Col span={isLargeScreen ? 6 : 12}>
                                    <Stack gap={0}>
                                      <Title order={3}>{value['fertilizer']}</Title>

                                      <Space h="lg" />
                                      <Text fz="sm">{value['details']['description']}</Text>
                                      <Text fz="sm">{value['details']['how_to_use']}</Text>

                                      <Space h="lg" />
                                      {/* <Group gap="xs"><Paper withBorder shadow="md" bg="black" radius="md" py={2} px="xs">
                            <Text c="white">#Popular</Text>
                          </Paper>
                            <Paper withBorder shadow="md" bg="black" radius="md" py={2} px="xs">
                              <Text c="white">#Best Deal</Text>
                            </Paper>
                          </Group> */}
                                    </Stack>
                                  </Grid.Col>
                                  <Grid.Col span={isLargeScreen ? 3 : 12}>
                                    <Group justify="right">
                                      <Text fw={500}>Confidence</Text>
                                      <Paper
                                        bg={
                                          value['confidence'] <50
                                            ? '#EAD106'
                                            :  'green'
                    
                                        }
                                        withBorder
                                        shadow="md"
                                        radius="md"
                                        py={2}
                                        px="xs"
                                      >
                                        <Text c="white">
                                          {(value['confidence']).toFixed(0)}
                                        </Text>
                                      </Paper>
                                    </Group>
                                    <Stack
                                      h="84%"
                                      justify="flex-end"
                                      align="flex-end"
                                      p="sm"
                                      gap="md"
                                    >
                                      <Text fz="h3" fw={500}>
                                        {tzsFormatter.format(value['details']['maximum_price'])}
                                      </Text>
                                      {/* <Text pb="5px">Recommended for 3 months</Text> */}
                                      <Button
                                        bg="black"
                                        w="200px"
                                        radius="lg"
                                        onClick={() => {
                                          setActiveFertilizer({
                                            fertilizer: value['fertilizer'],
                                            description: value['details']['description'],
                                          });
                                          openDetailModal();
                                        }}
                                      >
                                        See Details
                                      </Button>
                                    </Stack>
                                  </Grid.Col>
                                </Grid>
                              </Paper>
                            )
                          );
                        }
                      )
                    : !openMaps && (
                        <>
                          {' '}
                          <Alert
                            variant="outline"
                            w={isLargeScreen ? '50%' : '100%'}
                            color="gray"
                            title=""
                            icon={<IconInfoCircle />}
                          >
                            <Text fw={500} fz="md">
                              No Recommendations Available
                            </Text>
                          </Alert>
                        </>
                      )}
                </Stack>
              )}
            </Stack>
          </Grid.Col>
        </Grid>
      </LayoutNav>

      <Modal
        size="xl"
        opened={openedDetailModal}
        onClose={closeDetailModal}
        withCloseButton={false}
        yOffset="10vh"
        centered
        radius="md"
      >
        <Modal.Header>
          <Modal.Title>
            {' '}
            <Title py="md" order={3}>
              Soil Nutrient Analysis ({activeFertilizer['fertilizer']})
              {/* Soil Nutrient Analysis ({cropRequirements['crop']}) */}
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
                requiredSoilData['nitrogen'],
                requiredSoilData['phosphorus'],
                requiredSoilData['potassium'],
                requiredSoilData['pH'],
           
              ],
            }}
          />
        </Paper>
        <Title pt="md" order={4}>
          Description
        </Title>
        <OpenAIChat
          data={{
            'real values': soilData,
            'required values': requiredSoilData,
            fertilizer: activeFertilizer,
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

export default FetilizerPage;
