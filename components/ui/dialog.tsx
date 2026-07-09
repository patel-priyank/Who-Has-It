'use client';

import { Dialog as ChakraDialog } from '@chakra-ui/react';

const getToastGroupEl = () => document.querySelector('[data-scope="toast"][data-part="group"]');

const Root = ({ persistentElements, ...props }: ChakraDialog.RootProps) => (
  <ChakraDialog.Root persistentElements={[getToastGroupEl, ...(persistentElements ?? [])]} {...props} />
);

export const Dialog = { ...ChakraDialog, Root };
