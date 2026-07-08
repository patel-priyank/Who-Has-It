import { Box } from '@chakra-ui/react';

import { Toaster } from '@/components/ui/toaster';

import Header from '@/components/Header';

const Home = () => {
  return (
    <Box minH="dvh" bg="bg.subtle">
      <Header />

      <Toaster />

      {/* Home */}
    </Box>
  );
};

export default Home;
