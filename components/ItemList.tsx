import { useEffect, useState } from 'react';

import { SimpleGrid } from '@chakra-ui/react';

import EditItemDialog from '@/components/EditItemDialog';
import ItemCard from '@/components/ItemCard';
import NotesDialog from '@/components/NotesDialog';

import { Item } from '@/context/UserProvider';

interface ItemListProps {
  items: Item[];
  itemsLoading: boolean;
}

const ItemList = ({ items, itemsLoading }: ItemListProps) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [notesDialogOpen, setNotesDialogOpen] = useState<boolean>(false);
  const [editItemDialogOpen, setEditItemDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!notesDialogOpen && !editItemDialogOpen) {
      setTimeout(() => setSelectedItem(null), 250);
    }
  }, [notesDialogOpen, editItemDialogOpen]);

  const handleViewNotes = (item: Item) => {
    setSelectedItem(item);
    setNotesDialogOpen(true);
  };

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
          <ItemCard
            key={item.id}
            item={item}
            onViewNotes={() => handleViewNotes(item)}
            onEditItem={() => handleEditItem(item)}
          />
        ))}
      </SimpleGrid>

      <NotesDialog item={selectedItem} notesDialogOpen={notesDialogOpen} setNotesDialogOpen={setNotesDialogOpen} />

      <EditItemDialog
        item={selectedItem}
        editItemDialogOpen={editItemDialogOpen}
        setEditItemDialogOpen={setEditItemDialogOpen}
      />
    </>
  );
};

export default ItemList;
