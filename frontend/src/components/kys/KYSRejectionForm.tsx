import { yupResolver } from '@hookform/resolvers/yup';
import { Button, NativeSelect, TextInput } from '@mantine/core';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useCreateKYSRejection } from '../../apis/queries/kys.queries';
import { KYSRejectionLogs } from '../../types';
import { KYS_STEP } from '../../types/enums';
import yup from '../../utils/yup';

type KYSRejectionFormProps = {
  studentId: string;
};

const schema = yup.object({
  reason: yup.string().required(),
  issueFor: yup.string().required().oneOf(Object.keys(KYS_STEP)),
});

const KYSRejectionForm: React.FC<KYSRejectionFormProps> = ({ studentId }) => {
  const reject = useCreateKYSRejection(studentId);
  const form = useForm<Pick<KYSRejectionLogs, 'reason' | 'issueFor'>>({
    resolver: yupResolver(schema),
    defaultValues: {
      reason: '',
      issueFor: KYS_STEP.COLLEGE_ID_CARD,
    },
  });

  const onSubmit = form.handleSubmit(async data => {
    reject.mutate(data, {
      onSuccess: () => {
        form.reset();
      },
    });
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit}>
        <TextInput
          {...form.register('reason')}
          id="reason"
          label="Reason"
          type="text"
          placeholder="reason"
          required
          className="mb-5"
          error={form.formState.errors?.reason?.message}
        />

        <NativeSelect
          data={Object.keys(KYS_STEP)}
          {...form.register('issueFor')}
          id="issueFor"
          label="issueFor"
          placeholder="issueFor"
          required
          className="mb-5"
          error={form.formState.errors?.issueFor?.message}
        />

        <Button type="submit">Create</Button>
      </form>
    </FormProvider>
  );
};

export default KYSRejectionForm;
