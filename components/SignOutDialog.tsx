import { useRef } from 'react';

import { Button, Dialog, IconButton, Portal, Stack, Text } from '@chakra-ui/react';

import { LuX } from 'react-icons/lu';

import { Toaster } from '@/components/ui/toaster';

import { useUser } from '@/context/UserProvider';

interface SignOutDialogProps {
  signOutDialogOpen: boolean;
  setSignOutDialogOpen: (signOutDialogOpen: boolean) => void;
}

const SignOutDialog = ({ signOutDialogOpen, setSignOutDialogOpen }: SignOutDialogProps) => {
  const { signOut } = useUser();

  const signOutInitialFocusRef = useRef<HTMLButtonElement | null>(null);

  const handleSignOut = () => {
    signOut();

    Toaster.create({
      type: 'success',
      title: 'Signed out',
      description: 'You are now signed out of your account.'
    });

    setSignOutDialogOpen(false);
  };

  return (
    <Dialog.Root
      size="sm"
      open={signOutDialogOpen}
      onOpenChange={e => setSignOutDialogOpen(e.open)}
      initialFocusEl={() => signOutInitialFocusRef.current}
    >
      <Portal>
        <Dialog.Backdrop backdropFilter="blur(2px)" />

        <Dialog.Positioner>
          <Dialog.Content mx={4}>
            <Dialog.Header px={6} pt={6} pb={0} gap={4} alignItems="center" justifyContent="space-between">
              <Dialog.Title>Sign out</Dialog.Title>

              <Dialog.CloseTrigger asChild position="unset" colorPalette="gray">
                <IconButton aria-label="Close" variant="outline" size="xs" color="inherit">
                  <LuX />
                </IconButton>
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body p={6}>
              <Stack gap={6}>
                <Text fontSize="md">
                  Are you sure you want to sign out? You'll need to sign in again to access your list.
                </Text>
              </Stack>
            </Dialog.Body>

            <Dialog.Footer px={6} pt={0} pb={6} justifyContent="flex-start">
              <Button ref={signOutInitialFocusRef} onClick={handleSignOut}>
                Sign out
              </Button>

              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default SignOutDialog;
