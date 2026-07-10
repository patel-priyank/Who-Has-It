'use client';

import { IconButton, Menu, Portal, Span } from '@chakra-ui/react';

import { LuCircleArrowDown, LuCircleArrowUp, LuPlus } from 'react-icons/lu';

import { Toaster } from '@/components/ui/toaster';

const FloatingActionButton = () => {
  const handleLendItem = () => {
    Toaster.create({
      type: 'info',
      title: 'Under development',
      description: 'Lend item feature will be available soon.'
    });
  };

  const handleBorrowItem = () => {
    Toaster.create({
      type: 'info',
      title: 'Under development',
      description: 'Borrow item feature will be available soon.'
    });
  };

  return (
    <Menu.Root variant="solid" positioning={{ placement: 'top-end' }}>
      <Menu.Trigger asChild>
        <IconButton pos="fixed" bottom={4} right={4} size="xl" shadow="xl">
          <LuPlus />
        </IconButton>
      </Menu.Trigger>

      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="lend-item" onClick={handleLendItem}>
              <LuCircleArrowUp />
              <Span flex={1} mr={4}>
                Lend item
              </Span>
            </Menu.Item>

            <Menu.Item value="borrow-item" onClick={handleBorrowItem}>
              <LuCircleArrowDown />
              <Span flex={1} mr={4}>
                Borrow item
              </Span>
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

export default FloatingActionButton;
