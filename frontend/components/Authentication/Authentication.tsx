import { useToggle, upperFirst, useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/router'
import { useForm } from '@mantine/form';
import { Notification } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Checkbox,
  Anchor,
  Stack,
  Title,
  Center,
  Container,
} from '@mantine/core';

import { IconCircleMinus } from '@tabler/icons-react';
import { useState } from 'react';
import { useAuth } from '@/context/Authentication';
import { json } from 'stream/consumers';




export function AuthenticationForm(props: PaperProps) {
  const auth = useAuth();

const { user, login_user } = auth;
  const url = process.env.URL
    const router = useRouter()
  const [type, toggle] = useToggle(['login', 'register']);
  const [loginFailed,setLoginFailed] = useState(false)
  const [loginButtonLoader,setLoginButtonLoader] = useState(false)
  const [loading, { open,close }] = useDisclosure(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const form = useForm({
    initialValues: {
      email: '',
      username: '',
      password: '',
      name:""

    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    },
  });

  async function autheniticate(){

    
    var response = await fetch(`${url}/user/verify`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "email":form.values.email,
        "password":form.values.password
      })
    }).catch((e) => {
      close()
      notifications.show({
        color:"red",
        message: "Network Error",
      })
      console.log(e)
    });

    if (response) {

      var response_json = await response.json()
      console.log(response_json)

      if(response_json["exists"]){
        login_user(response_json["data"]["email"],response_json["data"]["username"],response_json["data"]["id"])
        await router.push("/dashboard")
        close()
      }
      else{
        console.log("Wrong email and password")
        setLoginFailed(true)
        close()
      
      }

    }
  }



  async function signUp(){
    var response = await fetch(`${url}/user`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "username":form.values.username,
        "email":form.values.email,
        "password":form.values.password
      })
    }).catch((e) => {
      close()
      notifications.show({
        color:"red",
        message: "Network Error",
      })
      console.log(e)
    });

    if (response) {

  var response_json = await response.json()
  console.log(response_json)
  close()
  if(response_json["status_code"] == 400){
  notifications.show({
    color:"orange",
    message: response_json["detail"],
  })
}else{
  notifications.show({
    color:"green",
    message: "Successfully Registered",
  })
  toggle()

}

      

    
      
      }

    }
  



  return (
    <Paper radius="md" p="xl" withBorder {...props}>
        
        <Center>
            <Title order={2} fw={500} px="xl">
            {type === 'register'? "Sign Up":"Login"}
      </Title></Center>
      

      {/* <Group grow mb="md" mt="md">
        <GoogleButton radius="xl">Google</GoogleButton>
        <TwitterButton radius="xl">Twitter</TwitterButton>
      </Group> */}
      
    {type === 'register'?
      <Divider label="Sign up to access personalized recommendations" labelPosition="center" my="lg" />:
      <Divider label="Sign in to access personalized recommendations" labelPosition="center" my="lg" />}
  

      <form onSubmit={form.onSubmit(() => {
setLoginButtonLoader(true)
console.log("here1")
open()
if(type === 'register'){
  console.log("here2")
  signUp()

}
else{
autheniticate()
}

      })}>
        <Stack >
          {loginFailed&&
        <Notification color="red" title="Login Failed" onClose={()=>{setLoginFailed(false)}}>
      Wrong Email or Password
    </Notification>}
          {type === 'register' && (
            <>
 
            <TextInput
            required
            label="Username"
            placeholder="Your username"
            value={form.values.username}
            onChange={(event) => form.setFieldValue('username', event.currentTarget.value)}
            radius="md"
          />
          </>
          )}

          <TextInput
            required
            label="Email Address"
            placeholder="xxx@gmail.com"
            value={form.values.email}
            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
            error={form.errors.email && 'Invalid email'}
            radius="md"
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password && 'Password should include at least 6 characters'}
            radius="md"
          />

          {type === 'register' && (
            <>
            <PasswordInput
            required
            label="Confirm Password"
            placeholder="Your password"
            onChange={(event) => {
              console.log(event.currentTarget.value)
              if(form.values.password !== event.currentTarget.value){
                setConfirmPasswordError("Does not match the password")
              }
            else{
              setConfirmPasswordError("")
            }
            }}
            error={confirmPasswordError}
            radius="md"
        />
        
            </>
          )}
        </Stack>

        {type === 'login' &&(
        <Group justify="flex-end" mt="xl" py="sm">
        {/* <Checkbox
        size='xs'
      defaultChecked
      label="Remember me"
    /> */}
          <Anchor component="button" type="button" c="dimmed" onClick={() => toggle()} size="xs">
            Forgot your password?
          </Anchor>
        </Group>)}
        <Group justify='center' pt="md">
        <Button type="submit" radius="md" w={400} color='#83E819'
         loading={loading} loaderProps={{ type: 'dots' }}>
        {type === 'register'? "Sign Up":"Sign In"}
            </Button>
        </Group>
      </form>

      <Divider label=" " labelPosition="center" my="sm" />
      <Group justify='center' py="sm">
      <Anchor component="button" type="button" c="dimmed" onClick={() => toggle()} size="xs">
      {type === 'register'?"Already have an Account? Login":"Don't have an account yet?Sign up"}
          </Anchor>
        </Group>

        <Group justify='center' py="sm">
      <Anchor component="button" type="button" c="dimmed" onClick={() => { router.push("/crop") }} size="xs">
      Login as Guest
          </Anchor>
        </Group>
    </Paper>
  );
}

