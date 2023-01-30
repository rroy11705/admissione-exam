import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Checkbox, Title } from '@mantine/core';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useUpdateCollegeIDCardDetails } from '../../apis/queries/kys.queries';
import { IKYSDetails } from '../../types';
import yup from '../../utils/yup';

type CollegeIDUpdateFormProps = {
  studentId: string;
  kys?: IKYSDetails;
};

type FormInputs = {
  isNameMatching: boolean;
  isCollegeIdMatching: boolean;
};

const schema = yup.object({});

const CollegeIDUpdateForm: React.FC<CollegeIDUpdateFormProps> = ({ studentId, kys }) => {
  const form = useForm<FormInputs>({ resolver: yupResolver(schema), defaultValues: {} });

  const update = useUpdateCollegeIDCardDetails(studentId);

  const onSubmit = form.handleSubmit(async data => {
    console.log(data);
    update.mutate(data);
  });

  React.useEffect(() => {
    if (kys) {
      form.reset({
        isNameMatching: !!kys.collegeIdCardDetails?.isNameMatching,
        isCollegeIdMatching: !!kys.collegeIdCardDetails?.isCollegeIdMatching,
      });
    }
  }, [kys]);

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit}>
        <Title order={5}>Update College ID Details</Title>

        <Controller
          control={form.control}
          name="isNameMatching"
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onChange={event => field.onChange(event.currentTarget.checked)}
              label="Is Name Matching?"
              mb="lg"
            />
          )}
        />

        <Controller
          control={form.control}
          name="isCollegeIdMatching"
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onChange={event => field.onChange(event.currentTarget.checked)}
              label="Is College ID Number Matching?"
              mb="lg"
            />
          )}
        />

        <Button type="submit" loading={update.isLoading}>
          Save
        </Button>
      </form>
    </FormProvider>
  );
};

export default CollegeIDUpdateForm;
