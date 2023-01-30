import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, Modal, TextInput } from '@mantine/core';
import { FormProvider, useForm } from 'react-hook-form';
import React from 'react';
import { ISubject, RequestSubject } from '../../types';
import yup from '../../utils/yup';
import { useCreateSubject, useUpdateSubject } from '../../apis/queries/subjects.queries';

type AddUpdateSubjectProps = {
  subject?: ISubject;
  opened: boolean;
  onClose: () => void;
};

const schema = yup.object({
  _id: yup.string().trim().typeError('Subject id is required.').required('Subject id is required.'),
  name: yup
    .string()
    .trim()
    .typeError('Subject name is required.')
    .required('Subject name is required.'),
});

const AddUpdateSubject: React.FC<AddUpdateSubjectProps> = ({ subject, opened, onClose }) => {
  const form = useForm<RequestSubject>({
    resolver: yupResolver(schema),
    defaultValues: {
      _id: subject ? subject._id : '',
      name: subject ? subject.name : '',
    },
  });

  const createSubject = useCreateSubject();
  const updateSubject = useUpdateSubject();

  const onSubmit = form.handleSubmit(async (data: RequestSubject) => {
    const { ...payload } = data;

    try {
      if (subject) {
        await updateSubject.mutateAsync(
          { ...payload },
          {
            onSuccess: () => {
              form.reset();
              onClose();
            },
          },
        );
      } else {
        await createSubject.mutateAsync(
          { ...payload },
          {
            onSuccess: () => {
              form.reset();
              onClose();
            },
          },
        );
      }
    } catch (err) {
      // do nothing
    }
  });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={subject ? `Update ${subject.name}` : 'Add Subject'}
      size="xl"
    >
      <FormProvider {...form}>
        <form onSubmit={onSubmit}>
          <Grid align="flex-start">
            <Grid.Col md={12}>
              <TextInput
                type="text"
                label="Subject Id"
                placeholder="Subject Id"
                required
                {...form.register('_id')}
                disabled={!!subject?._id}
                mb="md"
                error={form.formState.errors._id?.message}
              />
              <TextInput
                type="text"
                label="Subject Name"
                placeholder="Subject Name"
                required
                {...form.register('name')}
                mb="md"
                error={form.formState.errors.name?.message}
              />
            </Grid.Col>
          </Grid>

          <Button fullWidth type="submit" loading={form.formState.isSubmitting}>
            {subject ? 'Update Subject' : 'Add Subject'}
          </Button>
        </form>
      </FormProvider>
    </Modal>
  );
};

export default AddUpdateSubject;
