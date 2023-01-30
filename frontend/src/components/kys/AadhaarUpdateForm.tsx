import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Checkbox, Radio, Title } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useUpdateAadhaarDetails } from '../../apis/queries/kys.queries';
import { IKYSDetails } from '../../types';
import yup from '../../utils/yup';

type AadhaarUpdateFormProps = {
  studentId: string;
  kys?: IKYSDetails;
};

type FormInputs = {
  birthDate: Date;
  gender: string;
  isPictureMatching: boolean;
  isNameMatching: boolean;
  isAadhaarNumberMatching: boolean;
};

const schema = yup.object({
  birthDate: yup.date().required(),
  gender: yup.string().required(),
});

const AadhaarUpdateForm: React.FC<AadhaarUpdateFormProps> = ({ studentId, kys }) => {
  const form = useForm<FormInputs>({ resolver: yupResolver(schema), defaultValues: {} });

  const update = useUpdateAadhaarDetails(studentId);

  const onSubmit = form.handleSubmit(async data => {
    update.mutate(data);
  });

  React.useEffect(() => {
    if (kys) {
      form.reset({
        birthDate: dayjs(kys.aadhaarDetails?.birthDate).toDate(),
        gender: kys.aadhaarDetails?.gender,
        isPictureMatching: kys.aadhaarDetails?.isPictureMatching,
        isNameMatching: kys.aadhaarDetails?.isNameMatching,
        isAadhaarNumberMatching: kys.aadhaarDetails?.isAadhaarNumberMatching,
      });
    }
  }, [kys]);

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit}>
        <Title order={5}>Update Aadhaar Details</Title>
        <Controller
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <DatePicker
              value={field.value}
              onChange={field.onChange}
              id="dob"
              label="Date of Birth"
              placeholder="Date of Birth"
              required
              className="mb-5"
              error={form.formState.errors?.birthDate?.message}
            />
          )}
        />

        <Controller
          control={form.control}
          name="gender"
          render={({ field }) => (
            <Radio.Group
              value={field.value}
              onChange={field.onChange}
              name="gender"
              label="Gender"
              description=""
              withAsterisk
              error={form.formState.errors?.gender?.message}
              mb="lg"
            >
              <Radio value="MALE" label="MALE" />
              <Radio value="FEMALE" label="FEMALE" />
              <Radio value="NON-BINARY" label="NON BINARY" />
            </Radio.Group>
          )}
        />

        <Controller
          control={form.control}
          name="isAadhaarNumberMatching"
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onChange={event => field.onChange(event.currentTarget.checked)}
              label="Is Aadhaar Number Matching?"
              mb="lg"
            />
          )}
        />

        <Controller
          control={form.control}
          name="isNameMatching"
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onChange={event => field.onChange(event.currentTarget.checked)}
              label="Is student's name matching with Aadhaar Card?"
              mb="lg"
            />
          )}
        />

        <Controller
          control={form.control}
          name="isPictureMatching"
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onChange={event => field.onChange(event.currentTarget.checked)}
              label="Is student's picture matching with Aadhaar Card?"
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

export default AadhaarUpdateForm;
