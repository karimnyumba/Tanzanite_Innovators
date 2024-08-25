import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/Authentication'; // Adjust this import path as needed
import { NextPage } from 'next';
import { ComponentType } from 'react';

export function withAuth<P extends object>(WrappedComponent: ComponentType<P>): NextPage<P> {
  const AuthWrapper: NextPage<P> = (props) => {
    const router = useRouter();
    const {loggedIn} = useAuth();

    useEffect(() => {
      if ( !loggedIn) {
        router.push('/');
      }
    }, [ loggedIn]);



    return <WrappedComponent {...props} />;
  };



  return AuthWrapper;
}