import { useRef } from 'react';

import { IconButton, Portal, Stack, Text } from '@chakra-ui/react';

import { LuX } from 'react-icons/lu';

import { Dialog } from '@/components/ui/dialog';

interface AboutDialogProps {
  aboutDialogOpen: boolean;
  setAboutDialogOpen: (aboutDialogOpen: boolean) => void;
}

const AboutDialog = ({ aboutDialogOpen, setAboutDialogOpen }: AboutDialogProps) => {
  const initialFocusRef = useRef<HTMLButtonElement | null>(null);

  return (
    <Dialog.Root
      size="sm"
      open={aboutDialogOpen}
      onOpenChange={e => setAboutDialogOpen(e.open)}
      initialFocusEl={() => initialFocusRef.current}
    >
      <Portal>
        <Dialog.Backdrop backdropFilter="blur(2px)" />

        <Dialog.Positioner>
          <Dialog.Content mx={4}>
            <Dialog.Header px={6} pt={6} pb={0} gap={4} alignItems="center" justifyContent="space-between">
              <Dialog.Title>About</Dialog.Title>

              <Dialog.CloseTrigger asChild position="unset" colorPalette="gray" ref={initialFocusRef}>
                <IconButton aria-label="Close" variant="outline" size="xs" color="inherit">
                  <LuX />
                </IconButton>
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body p={6}>
              <Stack gap={6}>
                <Text fontSize="md">
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cumque, sint. Pariatur enim consequuntur
                  illo culpa at molestiae, deleniti aut eligendi nulla ullam! Nulla placeat perspiciatis odit quod
                  aperiam assumenda ipsa eum animi dolorum sit veritatis recusandae provident cumque tempora labore ex
                  sed sapiente culpa, repellat consequatur fugit asperiores autem quia.
                </Text>

                <Text fontSize="md">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam sapiente vitae deleniti velit,
                  repellat ducimus animi corrupti veritatis fugiat mollitia doloribus accusantium aperiam saepe eligendi
                  amet expedita est porro reiciendis. Quidem provident similique maxime laboriosam tempore, dignissimos
                  maiores, iusto corrupti magni sed neque quia quod dolorum nostrum eaque quasi quaerat.
                </Text>
              </Stack>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default AboutDialog;
