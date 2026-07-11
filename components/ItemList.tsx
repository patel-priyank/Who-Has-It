import { useEffect, useState } from 'react';

import { SimpleGrid } from '@chakra-ui/react';

import ItemCard from '@/components/ItemCard';
import EditItemDialog from '@/components/EditItemDialog';

import { Item } from '@/context/UserProvider';

interface ItemListProps {
  items: Item[];
  itemsLoading: boolean;
}

const ItemList = ({ items, itemsLoading }: ItemListProps) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [editItemDialogOpen, setEditItemDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!editItemDialogOpen) {
      setSelectedItem(null);
    }
  }, [editItemDialogOpen]);

  const handleEditItem = (item: Item) => {
    setSelectedItem(item);
    setEditItemDialogOpen(true);
  };

  if (itemsLoading) {
    return <>Loading items</>;
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
