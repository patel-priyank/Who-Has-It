'use client';

import { Box, Tabs } from '@chakra-ui/react';

import { LuCircleArrowDown, LuCircleArrowUp } from 'react-icons/lu';

import ItemList from '@/components/ItemList';

import { Item, useUser } from '@/context/UserProvider';

const ItemTabs = () => {
  const { items, itemsLoading } = useUser();

  return (
    <Box maxW="breakpoint-lg" mx="auto" px={4} pt={4} pb={20}>
      <Tabs.Root variant="enclosed" defaultValue="lent" lazyMount unmountOnExit fitted>
        <Tabs.List>
          <Tabs.Trigger value="lent">
            <LuCircleArrowUp />
            Lent
          </Tabs.Trigger>

          <Tabs.Trigger value="borrowed">
            <LuCircleArrowDown />
            Borrowed
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="lent">
          <ItemList items={items.filter((item: Item) => !item.is_borrowed)} itemsLoading={itemsLoading} />
        </Tabs.Content>

        <Tabs.Content value="borrowed">
          <ItemList items={items.filter((item: Item) => item.is_borrowed)} itemsLoading={itemsLoading} />
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
};

export default ItemTabs;
