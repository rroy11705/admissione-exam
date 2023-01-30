import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, TextInput } from '@mantine/core';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useCreateInstitution } from '../../apis/queries/institution.queries';
import { RequestInstitution } from '../../types';
import yup from '../../utils/yup';

const schema = yup.object({
  name: yup.string().required().trim(),
});

const AddInstitution = () => {
  const form = useForm<RequestInstitution>({
    resolver: yupResolver(schema),
    defaultValues: { name: '' },
  });

  const createInstitution = useCreateInstitution();

  const onSubmit = form.handleSubmit(async data => {
    createInstitution.mutate(data, {
      onSuccess: () => {
        form.reset({ name: '' });
      },
    });
  });

  return (
    <FormProvider {...form}>
      <Card component="form" onSubmit={onSubmit}>
        <TextInput
          type="text"
          label="Institution Name"
          placeholder="Institution Name"
          required
          mb="md"
          {...form.register('name')}
          error={form.formState.errors.name?.message}
        />

        <Button fullWidth type="submit" loading={form.formState.isSubmitting}>
          Create
        </Button>
      </Card>
    </FormProvider>
  );
};

export default AddInstitution;
