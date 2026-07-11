'use client';

import { Badge, Button, Card, HStack, IconButton, Stack, Text } from '@chakra-ui/react';

import {
  LuCircleArrowDown,
  LuCircleArrowUp,
  LuCircleCheckBig,
  LuCircleDashed,
  LuPencil,
  LuStickyNote
} from 'react-icons/lu';

import { Item } from '@/context/ItemsProvider';

import { formatDate } from '@/lib/date';

interface ItemCardProps {
  item: Item;
  onViewNotes: () => void;
  onEditItem: () => void;
}

const ItemCard = ({ item, onViewNotes, onEditItem }: ItemCardProps) => {
  const isReturned = Boolean(item.returned_at);

  return (
    <Card.Root>
      <Card.Body gap={4}>
        <HStack gap={4} justify="space-between">
          {isReturned ? (
            <Badge size="md" variant="surface" colorPalette="green">
              Returned
            </Badge>
          ) : (
            <Badge size="md" variant="surface" colorPalette="yellow">
              {item.is_borrowed ? 'Borrowed' : 'Lent'}
            </Badge>
          )}

          <HStack gap={2}>
            {item.notes && (
              <IconButton aria-label="View notes" variant="surface" size="xs" colorPalette="gray" onClick={onViewNotes}>
                <LuStickyNote />
              </IconButton>
            )}

            <IconButton aria-label="Edit item" variant="surface" size="xs" colorPalette="gray" onClick={onEditItem}>
              <LuPencil />
            </IconButton>
          </HStack>
        </HStack>

        <Stack gap={1}>
          <Card.Title lineClamp={1}>{item.item_name}</Card.Title>

          <Text fontSize="md" lineClamp={1} color="fg.subtle">
            {item.person_name}
          </Text>
        </Stack>

        <Stack gap={1} fontSize="sm">
          <HStack gap={2}>
            {item.is_borrowed ? <LuCircleArrowDown /> : <LuCircleArrowUp />}
            <Text lineClamp={1}>{formatDate(item.lent_at)}</Text>
          </HStack>

          {isReturned ? (
            <HStack gap={2}>
              <LuCircleCheckBig />
              <Text lineClamp={1}>{formatDate(item.returned_at!)}</Text>
            </HStack>
          ) : (
            <HStack gap={2} color="fg.subtle">
              <LuCircleDashed />
              <Text lineClamp={1}>Pending</Text>
            </HStack>
          )}
        </Stack>
      </Card.Body>

      <Card.Footer px={6} pt={0} pb={6}>
        {isReturned ? (
          <Button variant="outline" width="full">
            Mark as {item.is_borrowed ? 'borrowed' : 'lent'}
          </Button>
        ) : (
          <Button width="full">Mark as returned</Button>
        )}
      </Card.Footer>
    </Card.Root>
  );
};

export default ItemCard;
