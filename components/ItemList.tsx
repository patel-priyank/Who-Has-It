import { SimpleGrid } from '@chakra-ui/react';

import ItemCard from '@/components/ItemCard';

import { Item } from '@/context/UserProvider';

interface ItemListProps {
  items: Item[];
  itemsLoading: boolean;
}

const ItemList = ({ items, itemsLoading }: ItemListProps) => {
  if (itemsLoading) {
    return <>Loading items</>;
  }

  if (!itemsLoading && items.length === 0) {
    return <>No items</>;
  }

  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={4}>
      {items.map((item: Item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </SimpleGrid>
  );
};

export default ItemList;
