import { faArrowRightFromBracket, faChevronCircleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Accordion,
  AppShell,
  Avatar,
  Box,
  Burger,
  Button,
  Footer,
  Group,
  Header,
  MediaQuery,
  Menu,
  Modal,
  Navbar,
  Paper,
  ScrollArea,
  SimpleGrid,
  Text,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import classNames from 'classnames';
import Cookies from 'js-cookie';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useStore } from '../../store';
import ActiveLink from '../core/ActiveLink';

type AppLayoutProps = {
  children: React.ReactNode;
};

const links = [
  { name: 'Home', href: '/dashboard' },
  {
    name: 'Internal Modules',
    links: [
      { name: 'Subjects', href: '/dashboard/internal-modules/subjects' },
      { name: 'Questions', href: '/dashboard/internal-modules/questions' },
    ],
  },
  { name: 'Examinations', href: '/dashboard/examinations' },
  { name: 'Users', href: '/dashboard/users' },
];

const AppLayout: NextPage<AppLayoutProps> = ({ children }) => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const router = useRouter();
  const user = useStore(state => state.user);

  const [showLogout, setShowLogout] = useToggle();

  const handleLogout = () => {
    Cookies.remove('token');

    setShowLogout(false);

    router.push('/');
  };

  return (
    <Paper className="min-h-screen rounded-none bg-background-dark">
      <AppShell
        navbarOffsetBreakpoint="sm"
        asideOffsetBreakpoint="sm"
        fixed
        navbar={
          <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
            <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
              {links.map(link => {
                if (link.href) {
                  return (
                    <ActiveLink
                      key={link.name}
                      href={link.href}
                      className={classNames(
                        'w-full block rounded-md px-3 py-2 text-primary transition-colors mb-3',
                        'hover:bg-primary hover:bg-opacity-10',
                      )}
                      activeClassName="bg-primary bg-opacity-40 font-bold"
                    >
                      {link.name}
                    </ActiveLink>
                  );
                }

                return (
                  <Accordion>
                    <Accordion.Item value={link.name}>
                      <Accordion.Control>{link.name}</Accordion.Control>
                      <Accordion.Panel>
                        {link.links?.map(subLink => (
                          <ActiveLink
                            key={subLink.name}
                            href={subLink.href}
                            className={classNames(
                              'w-full block rounded-md px-3 py-2 text-primary transition-colors mb-3',
                              'hover:bg-primary hover:bg-opacity-10',
                            )}
                            activeClassName="bg-primary bg-opacity-40 font-bold"
                          >
                            {subLink.name}
                          </ActiveLink>
                        ))}
                      </Accordion.Panel>
                    </Accordion.Item>
                  </Accordion>
                );
              })}
            </Navbar.Section>

            <Navbar.Section>
              <Box
                sx={{
                  paddingTop: theme.spacing.sm,
                  borderTop: `1px solid ${
                    theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
                  }`,
                }}
              >
                <UnstyledButton
                  sx={{
                    display: 'block',
                    width: '100%',
                    padding: theme.spacing.xs,
                    borderRadius: theme.radius.sm,
                    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

                    '&:hover': {
                      backgroundColor:
                        theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                    },
                  }}
                >
                  <Group>
                    <Avatar radius="xl">
                      {user?.first_name
                        .split(' ')
                        .map(word => word[0])
                        .join('')}
                    </Avatar>

                    <Box sx={{ flex: 1 }}>
                      <Text size="sm" weight={500}>
                        {user?.first_name} {user?.middle_name} {user?.last_name}
                      </Text>
                      <Text color="dimmed" size="xs">
                        {user?.email}
                      </Text>
                    </Box>

                    <Menu position="right">
                      <Menu.Target>
                        <FontAwesomeIcon icon={faChevronCircleRight} size="1x" />
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          color="red"
                          icon={<FontAwesomeIcon icon={faArrowRightFromBracket} />}
                          onClick={() => setShowLogout(true)}
                        >
                          Logout
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                </UnstyledButton>
              </Box>
            </Navbar.Section>
          </Navbar>
        }
        // aside={
        //   <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
        //     <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
        //       {/* <Text>Application sidebar</Text> */}
        //     </Aside>
        //   </MediaQuery>
        // }
        footer={
          <Footer height={50} p="md" className="text-gray-400">
            <small>Copyright © 2023. Vimashankara Services Pvt. Ltd.</small>
          </Footer>
        }
        header={
          <Header height={70} p="md">
            <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                <Burger
                  opened={opened}
                  onClick={() => setOpened(o => !o)}
                  size="sm"
                  color={theme.colors.gray[6]}
                  mr="xl"
                />
              </MediaQuery>
              <Text>Admissione Dashboard</Text>
            </div>
          </Header>
        }
      >
        {children}

        <Modal
          opened={showLogout}
          onClose={() => setShowLogout(false)}
          title="Are you sure you want to logout?"
        >
          <SimpleGrid cols={2}>
            <Button variant="outline" onClick={() => setShowLogout(false)}>
              Cancel
            </Button>
            <Button onClick={handleLogout} color="red">
              Logout
            </Button>
          </SimpleGrid>
        </Modal>
      </AppShell>
    </Paper>
  );
};

export default AppLayout;
