'use client';

import {
  createToaster,
  IconButton,
  Portal,
  Stack,
  Toast as ChakraToast,
  Toaster as ChakraToaster
} from '@chakra-ui/react';

import { LuX } from 'react-icons/lu';

export const Toaster = createToaster({
  placement: 'top-end',
  pauseOnPageIdle: true
});

export const Toast = () => {
  return (
    <Portal>
      <ChakraToaster toaster={Toaster} insetInline={{ mdDown: '4' }}>
        {toast => (
          <ChakraToast.Root width={{ md: 'sm' }}>
            <Stack gap={1} flex={1}>
              {toast.title && <ChakraToast.Title>{toast.title}</ChakraToast.Title>}
              {toast.description && <ChakraToast.Description>{toast.description}</ChakraToast.Description>}
            </Stack>

            <ChakraToast.ActionTrigger asChild colorPalette="gray">
              <IconButton aria-label="Close" variant="outline" size="xs">
                <LuX />
              </IconButton>
            </ChakraToast.ActionTrigger>
          </ChakraToast.Root>
        )}
      </ChakraToaster>
    </Portal>
  );
};
