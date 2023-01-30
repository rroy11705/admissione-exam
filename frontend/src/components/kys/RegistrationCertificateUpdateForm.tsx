import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Checkbox, Title } from '@mantine/core';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useUpdateRegistrationCertificateDetails } from '../../apis/queries/kys.queries';
import { IKYSDetails } from '../../types';
import yup from '../../utils/yup';

type RegistrationCertificateUpdateFormProps = {
  studentId: string;
  kys?: IKYSDetails;
};

type FormInputs = {
  isRegistrationCertificateNumberMatching: boolean;
};

const schema = yup.object({
  isRegistrationCertificateNumberMatching: yup.boolean(),
});

const RegistrationCertificateUpdateForm: React.FC<RegistrationCertificateUpdateFormProps> = ({
  studentId,
  kys,
}) => {
  const form = useForm<FormInputs>({ resolver: yupResolver(schema), defaultValues: {} });

  const update = useUpdateRegistrationCertificateDetails(studentId);

  const onSubmit = form.handleSubmit(async data => {
    update.mutate(data);
  });

  React.useEffect(() => {
    if (kys) {
      form.reset({
        isRegistrationCertificateNumberMatching:
          !!kys.registrationCertificateDetails?.isRegistrationCertificateNumberMatching,
      });
    }
  }, [kys]);

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit}>
        <Title order={5}>Update Registration Certificate Details</Title>

        <Controller
          control={form.control}
          name="isRegistrationCertificateNumberMatching"
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onChange={event => field.onChange(event.currentTarget.checked)}
              label="Is Name Matching?"
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

export default RegistrationCertificateUpdateForm;
