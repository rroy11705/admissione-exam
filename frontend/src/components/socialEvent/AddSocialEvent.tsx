import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, Modal, TextInput, MultiSelect, Textarea } from '@mantine/core';
import { DatePicker, TimeInput } from '@mantine/dates';
import React, { useEffect } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { isDate } from 'date-fns';
import { faClock, faCalendar } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCreateSocialEvent } from '../../apis/queries/socialEvents.queries';
import { useUpload } from '../../apis/queries/upload.queries';
import { RequestSocialEvent } from '../../types';
import { PAYMENT_METHODS } from '../../types/enums';
import yup from '../../utils/yup';
import ImageDropzone from '../core/ImageDropzone';

type SocialEventProps = {
  opened: boolean;
  onClose: () => void;
};

type FormInput = Omit<RequestSocialEvent, 'image'> & {
  file: File | null;
  startTime: string;
  endTime: string;
};

const schema = yup.object({
  file: yup.mixed().required('Required'),
  name: yup.string().trim().typeError('Name is required.').required('Name is required.'),
  startDate: yup
    .string()
    .transform((value, originalValue) => {
      const parsedDate = isDate(originalValue)
        ? new Date(originalValue).toISOString()
        : originalValue;

      return parsedDate;
    })
    .required('Start date is required.'),
  startTime: yup
    .string()
    .transform((value, originalValue) => {
      const parsedDate = isDate(originalValue)
        ? new Date(originalValue).toISOString()
        : originalValue;

      return parsedDate;
    })
    .required('Start date is required.'),
  endDate: yup
    .string()
    .when(
      'startDate',
      (startDate, field) =>
        startDate &&
        field.min(new Date(startDate) > field.value, 'End date cannot be less than start date'),
    )
    .transform((value, originalValue) => {
      const parsedDate = isDate(originalValue)
        ? new Date(originalValue).toISOString()
        : originalValue;

      return parsedDate;
    })
    .required('End date is required.'),
  endTime: yup
    .string()
    .when(
      'startDate',
      (startDate, field) =>
        startDate &&
        field.min(new Date(startDate) > field.value, 'End date cannot be less than start date'),
    )
    .transform((value, originalValue) => {
      const parsedDate = isDate(originalValue)
        ? new Date(originalValue).toISOString()
        : originalValue;

      return parsedDate;
    })
    .required('End date is required.'),
  paymentMethods: yup.array(yup.string().trim().stripEmptyString()),
  upiId: yup
    .string()
    .trim()
    .when('paymentMethods', (paymentMethods, field) =>
      paymentMethods.includes(PAYMENT_METHODS.UPI) ? field.required() : field,
    )
    .stripEmptyString(),
  actualPrice: yup
    .string()
    .trim()
    .typeError('Actual Price is required.')
    .required('Actual Price is required.'),
  discountPercentage: yup
    .string()
    .trim()
    .typeError('Discount Percentage is required.')
    .required('Discount Percentage is required.'),
  discountedPrice: yup
    .string()
    .trim()
    .typeError('Discounted Price is required.')
    .required('Discounted Price is required.'),
  instructions: yup.string().trim(),
});

const AddSocialEvent: React.FC<SocialEventProps> = ({ opened, onClose }) => {
  const form = useForm<FormInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      paymentMethods: [PAYMENT_METHODS.UPI],
    },
  });

  const createSocialEvent = useCreateSocialEvent();
  const uploadFile = useUpload();

  const onSubmit = form.handleSubmit(async (data: FormInput) => {
    const { file, startTime, endTime, ...payload } = data;

    const updatedPayload = {
      ...payload,
      startDate: new Date(
        `${new Date(payload.startDate).toLocaleDateString()} ${new Date(
          startTime,
        ).toLocaleTimeString()}`,
      ).toISOString(),
      endDate: new Date(
        `${new Date(payload.endDate).toLocaleDateString()} ${new Date(
          endTime,
        ).toLocaleTimeString()}`,
      ).toISOString(),
    };

    try {
      if (file) {
        const formData = new FormData();
        if (data.file) formData.append('file', file);

        const uploadedFile = await uploadFile.mutateAsync(formData);

        await createSocialEvent.mutateAsync(
          { ...updatedPayload, image: uploadedFile._id },
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

  const isPaymentMethodUPI = form.watch('paymentMethods').includes(PAYMENT_METHODS.UPI);
  const discountPercent = parseFloat(form.watch('discountPercentage') as string) || 0;
  const actualPrice = parseFloat(form.watch('actualPrice') as string) || 0;
  useEffect(() => {
    form.setValue('discountedPrice', (actualPrice * (1 - 0.01 * discountPercent)).toFixed(2));
  }, [actualPrice, discountPercent]);

  return (
    <Modal opened={opened} onClose={onClose} title="Add Social Event" size="xl">
      <FormProvider {...form}>
        <form onSubmit={onSubmit}>
          <Grid align="flex-start">
            <Grid.Col md={4}>
              <ImageDropzone />
            </Grid.Col>
            <Grid.Col md={8}>
              <TextInput
                type="text"
                label="Event Name"
                placeholder="Event Name"
                required
                {...form.register('name')}
                mb="md"
                error={form.formState.errors.name?.message}
              />
              <Grid align="flex-end">
                <Grid.Col md={8}>
                  <Controller
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <DatePicker
                        value={new Date(field.value)}
                        onChange={field.onChange}
                        id="startDate"
                        label="Start Date"
                        placeholder="Start Date"
                        required
                        mb="md"
                        icon={<FontAwesomeIcon icon={faCalendar} />}
                        error={form.formState.errors?.startDate?.message}
                      />
                    )}
                  />
                </Grid.Col>
                <Grid.Col md={4}>
                  <Controller
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <TimeInput
                        value={new Date(field.value)}
                        onChange={field.onChange}
                        id="startTime"
                        required
                        withSeconds
                        mb="md"
                        icon={<FontAwesomeIcon icon={faClock} />}
                        error={form.formState.errors.startTime?.message}
                      />
                    )}
                  />
                </Grid.Col>
              </Grid>

              <Grid align="flex-end">
                <Grid.Col md={8}>
                  <Controller
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <DatePicker
                        value={new Date(field.value)}
                        onChange={field.onChange}
                        id="endDate"
                        label="End Date"
                        placeholder="End Date"
                        required
                        mb="md"
                        icon={<FontAwesomeIcon icon={faCalendar} />}
                        error={form.formState.errors?.endDate?.message}
                      />
                    )}
                  />
                </Grid.Col>
                <Grid.Col md={4}>
                  <Controller
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <TimeInput
                        value={new Date(field.value)}
                        onChange={field.onChange}
                        id="endTime"
                        required
                        withSeconds
                        mb="md"
                        icon={<FontAwesomeIcon icon={faClock} />}
                        error={form.formState.errors.endTime?.message}
                      />
                    )}
                  />
                </Grid.Col>
              </Grid>
            </Grid.Col>
          </Grid>

          <Grid align="flex-end">
            <Grid.Col md={6}>
              <Controller
                control={form.control}
                name="paymentMethods"
                render={({ field }) => (
                  <MultiSelect
                    value={field.value}
                    id="paymentMethods"
                    onChange={field.onChange}
                    data={Object.values(PAYMENT_METHODS)}
                    defaultValue={[PAYMENT_METHODS.UPI]}
                    label="Payment Methods"
                    placeholder="Payment Methods"
                    required
                    mb="md"
                    error={form.formState.errors.upiId?.message}
                  />
                )}
              />
            </Grid.Col>
            <Grid.Col md={6}>
              <TextInput
                type="text"
                label="UPI Id"
                placeholder="UPI Id"
                mb="md"
                required={isPaymentMethodUPI}
                disabled={!isPaymentMethodUPI}
                {...form.register('upiId')}
                error={form.formState.errors.upiId?.message}
              />
            </Grid.Col>
          </Grid>

          <Grid align="flex-end">
            <Grid.Col md={4}>
              <TextInput
                type="text"
                defaultValue="0"
                label="Actual Percentage"
                placeholder="Actual Percentage"
                mb="md"
                required
                {...form.register('actualPrice')}
                error={form.formState.errors.actualPrice?.message}
              />
            </Grid.Col>
            <Grid.Col md={4}>
              <TextInput
                type="text"
                defaultValue="0"
                label="Discount Percentage"
                placeholder="Discount Percentage"
                mb="md"
                required
                {...form.register('discountPercentage')}
                error={form.formState.errors.discountPercentage?.message}
              />
            </Grid.Col>
            <Grid.Col md={4}>
              <Controller
                control={form.control}
                name="discountedPrice"
                render={({ field }) => (
                  <TextInput
                    type="text"
                    value={field.value}
                    label="Discounted Price"
                    placeholder="Discounted Price"
                    mb="md"
                    required
                    {...form.register('discountedPrice')}
                    error={form.formState.errors.discountedPrice?.message}
                  />
                )}
              />
            </Grid.Col>
          </Grid>

          <Grid align="flex-start">
            <Grid.Col md={12}>
              <Textarea
                label="Instructions"
                placeholder="Instructions"
                autosize
                minRows={4}
                required
                {...form.register('instructions')}
                mb="md"
                error={form.formState.errors.instructions?.message}
              />
            </Grid.Col>
          </Grid>

          <Button fullWidth type="submit" loading={form.formState.isSubmitting}>
            Add Social Event
          </Button>
        </form>
      </FormProvider>
    </Modal>
  );
};

export default AddSocialEvent;
