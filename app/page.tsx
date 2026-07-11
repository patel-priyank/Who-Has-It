import { Box } from '@chakra-ui/react';

import { Toast } from '@/components/ui/toaster';

import FloatingActionButton from '@/components/FloatingActionButton';
import Header from '@/components/Header';
import ItemTabs from '@/components/ItemTabs';

const Home = () => {
  return (
    <Box minH="dvh" bg="bg.subtle">
      <Header />

      <Toast />

      <FloatingActionButton />

      <ItemTabs />
    </Box>
  );
};

export default Home;
