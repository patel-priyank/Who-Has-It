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

const MAX_TOASTS = 3;

const createToast = Toaster.create;
const dismissing = new Set<string>();

Toaster.create = data => {
  const visible = Toaster.getVisibleToasts();
  const visibleIds = new Set(visible.map(toast => toast.id));

  for (const id of dismissing) {
    if (!visibleIds.has(id)) dismissing.delete(id);
  }

  const active = visible.filter(toast => toast.id && !dismissing.has(toast.id));

  for (let i = active.length; i >= MAX_TOASTS; i--) {
    const oldest = active[i - 1];

    if (oldest.id) {
      dismissing.add(oldest.id);
      Toaster.dismiss(oldest.id);
    }
  }

  return createToast(data);
};

export const Toast = () => {
  return (
    <Portal>
      <ChakraToaster toaster={Toaster} insetInline={{ mdDown: '4' }}>
        {toast => (
          <ChakraToast.Root width={{ md: 'sm' }} paddingInlineEnd={4}>
            <Stack gap={1} flex={1}>
              {toast.title && <ChakraToast.Title>{toast.title}</ChakraToast.Title>}
              {toast.description && <ChakraToast.Description>{toast.description}</ChakraToast.Description>}
            </Stack>

            <ChakraToast.ActionTrigger asChild colorPalette="gray">
              <IconButton aria-label="Close" variant="outline" size="xs" color="inherit">
                <LuX />
              </IconButton>
            </ChakraToast.ActionTrigger>
          </ChakraToast.Root>
        )}
      </ChakraToaster>
    </Portal>
  );
};
