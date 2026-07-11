import { useEffect, useRef, useState } from 'react';

import { IconButton, Portal, Stack, Text } from '@chakra-ui/react';

import { LuX } from 'react-icons/lu';

import { Dialog } from '@/components/ui/dialog';

import { Item } from '@/context/ItemsProvider';

interface NotesDialogProps {
  item: Item | null;
  notesDialogOpen: boolean;
  setNotesDialogOpen: (notesDialogOpen: boolean) => void;
}

const NotesDialog = ({ item, notesDialogOpen, setNotesDialogOpen }: NotesDialogProps) => {
  const [notes, setNotes] = useState<string>('');

  const notesInitialFocusRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (notesDialogOpen && item) {
      setNotes(item.notes || '');
    }
  }, [notesDialogOpen]);

  if (!item) {
    return null;
  }

  return (
    <Dialog.Root
      size="sm"
      open={notesDialogOpen}
      onOpenChange={e => setNotesDialogOpen(e.open)}
      initialFocusEl={() => notesInitialFocusRef.current}
    >
      <Portal>
        <Dialog.Backdrop backdropFilter="blur(2px)" />

        <Dialog.Positioner>
          <Dialog.Content mx={4}>
            <Dialog.Header px={6} pt={6} pb={0} gap={4} alignItems="center" justifyContent="space-between">
              <Dialog.Title lineClamp={1}>{item.item_name}</Dialog.Title>

              <Dialog.CloseTrigger asChild position="unset" colorPalette="gray" ref={notesInitialFocusRef}>
                <IconButton aria-label="Close" variant="outline" size="xs" color="inherit">
                  <LuX />
                </IconButton>
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body p={6}>
              <Stack gap={6}>
                {item.notes ? (
                  <Text fontSize="md">{notes}</Text>
                ) : (
                  <Text fontSize="md" color="fg.subtle">
                    No notes added.
                  </Text>
                )}
              </Stack>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default NotesDialog;
