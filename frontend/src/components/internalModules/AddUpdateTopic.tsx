import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, Modal, TextInput } from '@mantine/core';
import { FormProvider, useForm } from 'react-hook-form';
import React from 'react';
import { ITopics, RequestTopic } from '../../types';
import yup from '../../utils/yup';
import { useCreateTopic, useUpdateTopic } from '../../apis/queries/subjects.queries';

type AddUpdateTopicProps = {
  subject_id?: string;
  topic?: ITopics;
  opened: boolean;
  onClose: () => void;
};

const schema = yup.object({
  _id: yup.string().trim().typeError('Topic id is required.').required('Topic id is required.'),
  name: yup
    .string()
    .trim()
    .typeError('Topic name is required.')
    .required('Topic name is required.'),
});

const AddUpdateSubject: React.FC<AddUpdateTopicProps> = ({
  subject_id,
  topic,
  opened,
  onClose,
}) => {
  const form = useForm<RequestTopic>({
    resolver: yupResolver(schema),
    defaultValues: {
      _id: topic ? topic._id : '',
      name: topic ? topic.name : '',
    },
  });

  const createTopic = useCreateTopic();
  const updateTopic = useUpdateTopic();

  const onSubmit = form.handleSubmit(async (data: RequestTopic) => {
    const { ...payload } = data;

    try {
      if (topic) {
        await updateTopic.mutateAsync(
          { ...payload },
          {
            onSuccess: () => {
              form.reset();
              onClose();
            },
          },
        );
      } else {
        await createTopic.mutateAsync(
          { subject_id, data: payload },
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
      title={topic ? `Update ${topic.name}` : 'Add Topic'}
      size="xl"
    >
      <FormProvider {...form}>
        <form onSubmit={onSubmit}>
          <Grid align="flex-start">
            <Grid.Col md={12}>
              <TextInput
                type="text"
                label="Topic Id"
                placeholder="Topic Id"
                required
                {...form.register('_id')}
                disabled={!!topic?._id}
                mb="md"
                error={form.formState.errors._id?.message}
              />
              <TextInput
                type="text"
                label="Topic Name"
                placeholder="Topic Name"
                required
                {...form.register('name')}
                mb="md"
                error={form.formState.errors.name?.message}
              />
            </Grid.Col>
          </Grid>

          <Button fullWidth type="submit" loading={form.formState.isSubmitting}>
            {topic ? 'Update Topic' : 'Add Topic'}
          </Button>
        </form>
      </FormProvider>
    </Modal>
  );
};

export default AddUpdateSubject;
