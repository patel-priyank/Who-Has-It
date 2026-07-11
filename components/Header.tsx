'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { Avatar, Box, Flex, Heading, Link as ChakraLink, Menu, Portal, Span, Text } from '@chakra-ui/react';

import { LuBraces, LuHandshake, LuInfo, LuLogIn, LuLogOut, LuSquareArrowOutUpRight } from 'react-icons/lu';

import { THEME_STORAGE_KEY, THEMES } from '@/lib/themes';

import AboutDialog from '@/components/AboutDialog';
import SignInDialog from '@/components/SignInDialog';
import SignOutDialog from '@/components/SignOutDialog';

import { useUser } from '@/context/UserProvider';

const Header = () => {
  const { user } = useUser();

  const [aboutDialogOpen, setAboutDialogOpen] = useState<boolean>(false);
  const [signInDialogOpen, setSignInDialogOpen] = useState<boolean>(false);
  const [signOutDialogOpen, setSignOutDialogOpen] = useState<boolean>(false);

  const [theme, setTheme] = useState<string>('system');

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    const applyTheme = (theme: string) => {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
    };

    localStorage.setItem(THEME_STORAGE_KEY, theme);

    if (theme !== 'system') {
      applyTheme(theme);
      return;
    }

    const prefersDarkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    applyTheme(prefersDarkMediaQuery.matches ? 'dark' : 'light');

    const prefersDarkMediaQueryListener = (e: MediaQueryListEvent) => applyTheme(e.matches ? 'dark' : 'light');

    prefersDarkMediaQuery.addEventListener('change', prefersDarkMediaQueryListener);

    return () => prefersDarkMediaQuery.removeEventListener('change', prefersDarkMediaQueryListener);
  }, [theme]);

  return (
    <Box as="header" position="sticky" top={0} zIndex="sticky" bg="bg" borderBottomWidth="1px" borderColor="border">
      <Flex maxW="breakpoint-lg" mx="auto" px={4} h={16} gap={4} align="center" justify="space-between">
        <ChakraLink href="/">
          <Flex gap={2} align="center">
            <Avatar.Root size="2xs">
              <Avatar.Image src="/logo.svg" />
            </Avatar.Root>

            <Heading textStyle="lg" color="fg">
              Who Has It
            </Heading>
          </Flex>
        </ChakraLink>

        <Menu.Root variant="solid" positioning={{ placement: 'bottom-end' }}>
          <Menu.Trigger rounded="md" focusRing="outside">
            <Avatar.Root size="sm" shape="rounded">
              <Avatar.Fallback name={user?.email || ''} />
              <Avatar.Image src="#" />
            </Avatar.Root>
          </Menu.Trigger>

          <Portal>
            <Menu.Positioner>
              <Menu.Content w="min(75vw, 240px)">
                <Menu.ItemGroup>
                  <Menu.ItemGroupLabel>
                    <Text lineClamp={1}>{user?.email || 'Local user'}</Text>
                  </Menu.ItemGroupLabel>

                  {user ? (
                    <Menu.Item value="sign-out" onClick={() => setSignOutDialogOpen(true)}>
                      <LuLogOut />
                      <Span flex={1} mr={4}>
                        Sign out
                      </Span>
                    </Menu.Item>
                  ) : (
                    <Menu.Item value="sign-in" onClick={() => setSignInDialogOpen(true)}>
                      <LuLogIn />
                      <Span flex={1} mr={4}>
                        Sign in
                      </Span>
                    </Menu.Item>
                  )}
                </Menu.ItemGroup>

                <Menu.Separator />

                <Menu.ItemGroup>
                  <Menu.ItemGroupLabel>Theme</Menu.ItemGroupLabel>

                  <Menu.RadioItemGroup value={theme} onValueChange={e => e.value && setTheme(e.value)}>
                    {THEMES.map(theme => (
                      <Menu.RadioItem key={theme.value} value={theme.value}>
                        <Menu.ItemIndicator />
                        <Span mr={4}>{theme.label}</Span>
                      </Menu.RadioItem>
                    ))}
                  </Menu.RadioItemGroup>
                </Menu.ItemGroup>

                <Menu.Separator />

                <Menu.Item asChild value="source-code">
                  <Link href="https://github.com/patel-priyank/Who-Has-It" target="_blank" rel="noopener noreferrer">
                    <LuBraces />
                    <Span flex={1} mr={4}>
                      Source code
                    </Span>
                    <LuSquareArrowOutUpRight />
                  </Link>
                </Menu.Item>

                <Menu.Item asChild value="support-the-project">
                  <Link href="https://buymeacoffee.com/priyankp" target="_blank" rel="noopener noreferrer">
                    <LuHandshake />
                    <Span flex={1} mr={4}>
                      Support the project
                    </Span>
                    <LuSquareArrowOutUpRight />
                  </Link>
                </Menu.Item>

                <Menu.Item value="about" onClick={() => setAboutDialogOpen(true)}>
                  <LuInfo />
                  <Span flex={1} mr={4}>
                    About
                  </Span>
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </Flex>

      <SignInDialog signInDialogOpen={signInDialogOpen} setSignInDialogOpen={setSignInDialogOpen} />

      <SignOutDialog signOutDialogOpen={signOutDialogOpen} setSignOutDialogOpen={setSignOutDialogOpen} />

      <AboutDialog aboutDialogOpen={aboutDialogOpen} setAboutDialogOpen={setAboutDialogOpen} />
    </Box>
  );
};

export default Header;
