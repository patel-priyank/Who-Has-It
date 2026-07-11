'use client';

import { Badge, Button, Card, HStack, IconButton, Popover, Portal, Skeleton, Stack, Text } from '@chakra-ui/react';

import {
  LuCircleArrowDown,
  LuCircleArrowUp,
  LuCircleCheckBig,
  LuCircleDashed,
  LuPencil,
  LuStickyNote
} from 'react-icons/lu';

import { Toaster } from '@/components/ui/toaster';

import { Item } from '@/context/ItemsProvider';

import { formatDate, getDaysAgo } from '@/lib/date';

interface ItemCardProps {
  item?: Item;
  onEditItem?: () => void;
}

const ItemCard = ({ item, onEditItem }: ItemCardProps) => {
  const handleMarkActive = () => {
    Toaster.create({
      type: 'info',
      title: 'Under development',
      description: 'Feature will be available soon.'
    });
  };

  const handleMarkReturned = () => {
    Toaster.create({
      type: 'info',
      title: 'Under development',
      description: 'Feature will be available soon.'
    });
  };

  return (
    <Card.Root>
      <Card.Body gap={4}>
        <HStack gap={4} justify="space-between">
          {item ? (
            item.returned_at ? (
              <Badge size="md" variant="surface" colorPalette="green">
                Returned
              </Badge>
            ) : (
              <Badge size="md" variant="surface" colorPalette="yellow">
                {item.is_borrowed ? 'Borrowed' : 'Lent'}
              </Badge>
            )
          ) : (
            <Skeleton width="50%" height="32px" />
          )}

          {item && (
            <HStack gap={2}>
              {item.notes && (
                <Popover.Root>
                  <Popover.Trigger asChild>
                    <IconButton aria-label="View notes" variant="surface" size="xs" colorPalette="gray">
                      <LuStickyNote />
                    </IconButton>
                  </Popover.Trigger>

                  <Portal>
                    <Popover.Positioner>
                      <Popover.Content overflow="auto">
                        <Popover.Body>
                          <Stack gap={2}>
                            <Popover.Title fontWeight="semibold">Notes</Popover.Title>
                            <Text>{item.notes}</Text>
                          </Stack>
                        </Popover.Body>
                      </Popover.Content>
                    </Popover.Positioner>
                  </Portal>
                </Popover.Root>
              )}

              <IconButton aria-label="Edit item" variant="surface" size="xs" colorPalette="gray" onClick={onEditItem}>
                <LuPencil />
              </IconButton>
            </HStack>
          )}
        </HStack>

        <Stack gap={1}>
          {item ? <Card.Title lineClamp={1}>{item.item_name}</Card.Title> : <Skeleton width="full" height="28px" />}

          {item ? (
            <Text fontSize="md" lineClamp={1} color="fg.subtle">
              {item.person_name}
            </Text>
          ) : (
            <Skeleton width="full" height="24px" />
          )}
        </Stack>

        <Stack gap={1} fontSize="sm">
          {item ? (
            <HStack gap={2}>
              {item.is_borrowed ? <LuCircleArrowDown /> : <LuCircleArrowUp />}
              <Text lineClamp={1}>{formatDate(item.lent_at)}</Text>
            </HStack>
          ) : (
            <Skeleton width="full" height="21px" />
          )}

          {item ? (
            item.returned_at ? (
              <HStack gap={2}>
                <LuCircleCheckBig />
                <Text lineClamp={1}>{formatDate(item.returned_at!)}</Text>
              </HStack>
            ) : (
              <HStack gap={2} color="fg.subtle">
                <LuCircleDashed />
                <Text lineClamp={1}>
                  {getDaysAgo(item.lent_at)} day{getDaysAgo(item.lent_at) !== 1 ? 's' : ''} pending
                </Text>
              </HStack>
            )
          ) : (
            <Skeleton width="full" height="21px" />
          )}
        </Stack>
      </Card.Body>

      <Card.Footer px={6} pt={0} pb={6}>
        {item ? (
          item.returned_at ? (
            <Button variant="outline" width="full" onClick={handleMarkActive}>
              Mark as {item.is_borrowed ? 'borrowed' : 'lent'}
            </Button>
          ) : (
            <Button width="full" onClick={handleMarkReturned}>
              Mark as returned
            </Button>
          )
        ) : (
          <Skeleton width="full" height="40px" />
        )}
      </Card.Footer>
    </Card.Root>
  );
};

export default ItemCard;
