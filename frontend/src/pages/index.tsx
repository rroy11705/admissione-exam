import { Button, Card, Container, Divider, PasswordInput, TextInput, Title } from '@mantine/core';
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import React from 'react';
import { NextPageWithLayout } from '../types';
import { useLogin } from '../apis/queries/auth.queries';
import parseCookies from '../utils/authentication';

type FormInput = {
  email: string;
  password: string;
};

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required().min(6),
});

const Home: NextPageWithLayout = () => {
  const form = useForm<FormInput>({ resolver: yupResolver(schema) });

  const router = useRouter();

  const login = useLogin();

  const onSubmit = form.handleSubmit(data => {
    login.mutate(data, {
      onSuccess: () => {
        router.replace('/dashboard');
      },
    });
  });

  const checkUserToken = React.useCallback(() => {
    const cookies = parseCookies();
    console.log(cookies);

    if (cookies.token) {
      router.replace('/dashboard');
    }
  }, []);

  React.useEffect(() => {
    checkUserToken();
  }, []);

  return (
    <div>
      <Head>
        <title>Login | Sconto Admin</title>
        <meta name="description" content="Welcome to Sconto Admin" />
      </Head>

      <main>
        <Container className="my-7" size="sm">
          <Card shadow="sm" p="lg" component="form" onSubmit={onSubmit}>
            <Title align="center">Login</Title>
            <Divider sx={() => ({ marginBottom: '2rem' })} />

            <TextInput
              {...form.register('email')}
              id="email"
              label="Email"
              type="email"
              placeholder="Email"
              required
              className="mb-5"
              error={form.formState.errors?.email?.message}
            />

            <PasswordInput
              {...form.register('password')}
              id="password"
              placeholder="Password"
              label="Password"
              required
              className="mb-5"
              error={form.formState.errors?.password?.message}
            />

            <Button
              type="submit"
              fullWidth
              variant="gradient"
              gradient={{ from: 'indigo', to: 'cyan' }}
              loading={login.isLoading || form.formState.isSubmitting}
            >
              Login
            </Button>
          </Card>
        </Container>
      </main>
    </div>
  );
};

export default Home;
