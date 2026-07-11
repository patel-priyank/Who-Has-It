import { useEffect, useState } from 'react';

import { SimpleGrid } from '@chakra-ui/react';

import EditItemDialog from '@/components/EditItemDialog';
import ItemCard from '@/components/ItemCard';

import { Item } from '@/context/ItemsProvider';

interface ItemListProps {
  items: Item[];
  itemsLoading: boolean;
}

const ItemList = ({ items, itemsLoading }: ItemListProps) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [editItemDialogOpen, setEditItemDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!editItemDialogOpen) {
      setTimeout(() => setSelectedItem(null), 250);
    }
  }, [editItemDialogOpen]);

  const handleEditItem = (item: Item) => {
    setSelectedItem(item);
    setEditItemDialogOpen(true);
  };

  if (itemsLoading) {
    return (
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={4}>
        {Array.from({ length: 6 }).map((_, index) => (
          <ItemCard key={index} />
        ))}
      </SimpleGrid>
    );
  }

  if (!itemsLoading && items.length === 0) {
    return <>No items</>;
  }

  return (
    <>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={4}>
        {items.map((item: Item) => (
          <ItemCard key={item.id} item={item} onEditItem={() => handleEditItem(item)} />
        ))}
      </SimpleGrid>

      <EditItemDialog
        item={selectedItem}
        editItemDialogOpen={editItemDialogOpen}
        setEditItemDialogOpen={setEditItemDialogOpen}
      />
    </>
  );
};

export default ItemList;
