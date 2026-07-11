'use client';

import { Badge, Button, Card, HStack, IconButton, Span, Stack, Text } from '@chakra-ui/react';

import {
  LuCircleArrowDown,
  LuCircleArrowUp,
  LuCircleCheckBig,
  LuCircleDashed,
  LuPencil,
  LuStickyNote
} from 'react-icons/lu';

import { Tooltip } from '@/components/ui/tooltip';

import { Item } from '@/context/UserProvider';

import { formatDate } from '@/lib/date';

interface ItemCardProps {
  item: Item;
}

const ItemCard = ({ item }: ItemCardProps) => {
  const isReturned = Boolean(item.returned_at);

  return (
    <Card.Root>
      <Card.Body gap={4}>
        <HStack gap={4} justify="space-between">
          {isReturned ? (
            <Badge size="md" colorPalette="green">
              Returned
            </Badge>
          ) : (
            <Badge size="md" colorPalette="yellow">
              {item.is_borrowed ? 'Borrowed' : 'Lent'}
            </Badge>
          )}

          <HStack gap={4}>
            {item.notes && (
              <Tooltip content="Note added" showArrow positioning={{ placement: 'top', offset: { mainAxis: 4 } }}>
                <Span fontSize="xl" color="fg.subtle">
                  <LuStickyNote />
                </Span>
              </Tooltip>
            )}

            <IconButton aria-label="Edit item" variant="surface" size="xs" colorPalette="gray">
              <LuPencil />
            </IconButton>
          </HStack>
        </HStack>

        <Stack gap={1}>
          <Card.Title truncate>{item.item_name}</Card.Title>

          <Text fontSize="md" truncate color="fg.subtle">
            {item.person_name}
          </Text>
        </Stack>

        <Stack gap={1} fontSize="sm">
          <HStack gap={2}>
            {item.is_borrowed ? <LuCircleArrowDown /> : <LuCircleArrowUp />}
            <Text truncate>{formatDate(item.lent_at)}</Text>
          </HStack>

          {isReturned ? (
            <HStack gap={2}>
              <LuCircleCheckBig />
              <Text truncate>{formatDate(item.returned_at!)}</Text>
            </HStack>
          ) : (
            <HStack gap={2} color="fg.subtle">
              <LuCircleDashed />
              <Text truncate>Pending</Text>
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
