import { Box } from '@chakra-ui/react';

import { Toast } from '@/components/ui/toaster';

import Header from '@/components/Header';
import FloatingActionButton from '@/components/FloatingActionButton';

const Home = () => {
  return (
    <Box minH="dvh" bg="bg.subtle">
      <Header />

      <Toast />

      <FloatingActionButton />
    </Box>
  );
};

export default Home;
