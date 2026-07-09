import { Box } from '@chakra-ui/react';

import { Toaster } from '@/components/ui/toaster';

import Header from '@/components/Header';
import FloatingActionButton from '@/components/FloatingActionButton';

const Home = () => {
  return (
    <Box minH="dvh" bg="bg.subtle">
      <Header />

      <Toaster />

      <FloatingActionButton />
    </Box>
  );
};

export default Home;
