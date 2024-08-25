import { Welcome } from '../components/Welcome/Welcome';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { AuthenticationForm } from '@/components/Authentication/Authentication';
import { BackgroundImage, Center, Container } from '@mantine/core';

export default function HomePage() {
  return (
    <>
    <Container fluid px={0} size="100%" h="100%">
    <BackgroundImage
    h={900}
    src="webimages/cropfield.jpg"
    radius="sm">
<Container p="xl" size="sm">
     <AuthenticationForm/>
     </Container>
     </BackgroundImage>
     </Container>

    </>
  );
}
