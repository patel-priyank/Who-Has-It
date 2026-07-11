'use client';

import { useEffect, useRef, useState } from 'react';

import { Button, Dialog, Field, Fieldset, IconButton, Input, Portal, Stack, Textarea } from '@chakra-ui/react';

import { LuX } from 'react-icons/lu';

import { Toaster } from '@/components/ui/toaster';

import { Item, useItems } from '@/context/ItemsProvider';

const MAX_LENGTH_ITEM_NAME = 255;
const MAX_LENGTH_PERSON_NAME = 100;
const MAX_LENGTH_NOTES = 1000;

interface EditItemDialogProps {
  item: Item | null;
  editItemDialogOpen: boolean;
  setEditItemDialogOpen: (editItemDialogOpen: boolean) => void;
}

const EditItemDialog = ({ item, editItemDialogOpen, setEditItemDialogOpen }: EditItemDialogProps) => {
  const { updateItem } = useItems();

  const [itemName, setItemName] = useState<string>('');
  const [personName, setPersonName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const [saving, setSaving] = useState<boolean>(false);

  const editItemInitialFocusRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editItemDialogOpen && item) {
      setItemName(item.item_name);
      setPersonName(item.person_name);
      setNotes(item.notes || '');
    }
  }, [editItemDialogOpen]);

  const handleSave = async (e: any) => {
    e.preventDefault();

    if (!item) {
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('who-has-it:token');

      if (!token) {
        Toaster.create({
          type: 'error',
          title: 'Session expired',
          description: 'You need to sign in again.'
        });

        setEditItemDialogOpen(false);

        return;
      }

      const res = await fetch('/api/items', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: item.id, item_name: itemName, person_name: personName, notes })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        Toaster.create({
          type: 'error',
          title: 'Failed to update item',
          description: data.error ?? 'Please try again.'
        });

        return;
      }

      updateItem(data.item);

      Toaster.create({
        type: 'success',
        title: 'Changes saved',
        description: 'The item has been updated successfully.'
      });

      setEditItemDialogOpen(false);
    } catch (error) {
      console.error(error);

      Toaster.create({
        type: 'error',
        title: 'Something went wrong',
        description: 'Please try again.'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog.Root
      size="sm"
      open={editItemDialogOpen}
      onOpenChange={e => setEditItemDialogOpen(e.open)}
      initialFocusEl={() => editItemInitialFocusRef.current}
    >
      <Portal>
        <Dialog.Backdrop backdropFilter="blur(2px)" />

        <Dialog.Positioner>
          <Dialog.Content mx={4}>
            <Dialog.Header px={6} pt={6} pb={0} gap={4} alignItems="center" justifyContent="space-between">
              <Dialog.Title>Edit item</Dialog.Title>

              <Dialog.CloseTrigger asChild position="unset" colorPalette="gray">
                <IconButton aria-label="Close" variant="outline" size="xs" color="inherit">
                  <LuX />
                </IconButton>
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <form onSubmit={handleSave}>
              <Dialog.Body p={6}>
                <Stack gap={6}>
                  <Fieldset.Root>
                    <Fieldset.Content>
                      <Field.Root required>
                        <Field.Label>
                          Item name <Field.RequiredIndicator />
                        </Field.Label>

                        <Input
                          ref={editItemInitialFocusRef}
                          placeholder={itemName}
                          value={itemName}
                          onChange={e => setItemName(e.currentTarget.value.slice(0, MAX_LENGTH_ITEM_NAME))}
                          maxLength={MAX_LENGTH_ITEM_NAME}
                        />

                        <Field.HelperText fontVariantNumeric="tabular-nums">
                          {itemName.length} / {MAX_LENGTH_ITEM_NAME}
                        </Field.HelperText>
                      </Field.Root>

                      <Field.Root required>
                        <Field.Label>
                          Person name <Field.RequiredIndicator />
                        </Field.Label>

                        <Input
                          placeholder={personName}
                          value={personName}
                          onChange={e => setPersonName(e.currentTarget.value.slice(0, MAX_LENGTH_PERSON_NAME))}
                          maxLength={MAX_LENGTH_PERSON_NAME}
                        />

                        <Field.HelperText fontVariantNumeric="tabular-nums">
                          {personName.length} / {MAX_LENGTH_PERSON_NAME}
                        </Field.HelperText>
                      </Field.Root>

                      <Field.Root>
                        <Field.Label>Notes</Field.Label>

                        <Textarea
                          placeholder={notes}
                          value={notes}
                          onChange={e => setNotes(e.currentTarget.value.slice(0, MAX_LENGTH_NOTES))}
                          maxLength={MAX_LENGTH_NOTES}
                          rows={5}
                          resize="vertical"
                        />

                        <Field.HelperText fontVariantNumeric="tabular-nums">
                          {notes.length} / {MAX_LENGTH_NOTES}
                        </Field.HelperText>
                      </Field.Root>
                    </Fieldset.Content>
                  </Fieldset.Root>
                </Stack>
              </Dialog.Body>

              <Dialog.Footer px={6} pt={0} pb={6} justifyContent="flex-start">
                <Button type="submit" loading={saving}>
                  Save changes
                </Button>

                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </Dialog.ActionTrigger>
              </Dialog.Footer>
            </form>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default EditItemDialog;
