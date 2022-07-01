import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm, useToggle, upperFirst } from '@mantine/hooks';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  Button,
  Checkbox,
  Anchor,
  LoadingOverlay,
  Alert,
} from '@mantine/core';
import { AlertCircle } from 'tabler-icons-react';
import {
  Auth,
  useLoginMutation,
  useSignUpMutation,
} from 'apps/frontend/generated/graphql';

export default function SignUpPage() {
  const router = useRouter();
  const [type, toggle] = useToggle('login', ['login', 'register']);
  const form = useForm({
    initialValues: {
      email: '',
      fullname: '',
      password: '',
      terms: true,
    },

    validationRules: {
      email: (val) => /^\S+@\S+$/.test(val),
      password: (val) => val.length >= 6,
    },
  });

  const submitHendlerType = {
    login: useLoginMutation,
    register: useSignUpMutation,
  };

  const [submitHandler, { loading, error }] = submitHendlerType[type]({
    variables: form.values,
    onError: () => {},
    onCompleted: (data) => {
      const authResponse: Auth = data.login || data.signup;
      localStorage.setItem('accessToken', authResponse.accessToken);
      localStorage.setItem('refreshToken', authResponse.refreshToken);
      router.replace('/');
    },
  });

  return (
    <Paper radius="md" p="xl" withBorder>
      <LoadingOverlay visible={loading} />

      <Text size="lg" weight={500}>
        Welcome to Fonbnk, ${type} with
      </Text>

      <form onSubmit={form.onSubmit(() => submitHandler())}>
        <Group direction="column" grow>
          <TextInput
            required
            label="Email"
            placeholder="hello@example.com"
            value={form.values.email}
            onChange={(event) =>
              form.setFieldValue('email', event.currentTarget.value)
            }
            error={form.errors.email && 'Invalid email'}
          />

          {type == 'register' && (
            <TextInput
              required
              label="Full name"
              placeholder="Ivanov Ivan"
              value={form.values.fullname}
              onChange={(event) =>
                form.setFieldValue('fullname', event.currentTarget.value)
              }
              error={form.errors.fullname}
            />
          )}

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) =>
              form.setFieldValue('password', event.currentTarget.value)
            }
            error={
              form.errors.password &&
              'Password should include at least 6 characters'
            }
          />

          {type === 'register' && (
            <Checkbox
              label="I accept terms and conditions"
              checked={form.values.terms}
              onChange={(event) =>
                form.setFieldValue('terms', event.currentTarget.checked)
              }
            />
          )}
        </Group>

        <Group position="apart" mt="xl">
          <Anchor
            component="button"
            type="button"
            color="gray"
            onClick={() => toggle()}
            size="xs"
          >
            {type === 'register'
              ? 'Already have an account? Login'
              : "Don't have an account? Register"}
          </Anchor>
          <Button type="submit">{upperFirst(type)}</Button>
        </Group>

        {error && (
          <Alert
            icon={<AlertCircle size={16} />}
            mt={10}
            title="Filed"
            color="red"
          >
            {error.message}
          </Alert>
        )}
      </form>
    </Paper>
  );
}
