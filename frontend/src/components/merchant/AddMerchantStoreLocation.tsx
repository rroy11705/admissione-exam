import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Grid,
  Group,
  Modal,
  NativeSelect,
  Select,
  Textarea,
  TextInput,
} from '@mantine/core';
import { isEmpty } from 'lodash';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useCreateStoreLocation } from '../../apis/queries/merchantStoreLocation.queries';
import { IMerchant, RequestMerchantStoreLocation } from '../../types';
import yup from '../../utils/yup';
import GooglePlacesAutocomplete from '../core/GooglePlacesAutocomplete';

type AddMerchantStoreLocationProps = {
  opened: boolean;
  onClose: () => void;
  merchant: IMerchant;
};

const schema = yup.object({
  name: yup.string().trim().typeError('Name is required').required('Name is required'),
  email: yup.string().trim().email().typeError('Email is required').required('Email is required'),
  address: yup.object({
    formattedAddress: yup.string().trim().required('Address is required'),
    city: yup.string().trim().required('City is required'),
    state: yup.string().trim().required('State is required'),
    country: yup.string().trim().required('Country is required'),
    zipCode: yup.number().required('Zip Code is required'),
    coordinates: yup.object({
      lat: yup.number(),
      lng: yup.number(),
    }),
  }),
  owner: yup
    .object({
      firstName: yup.string().trim().stripEmptyString(),
      middleName: yup.string().trim().stripEmptyString(),
      lastName: yup.string().trim().stripEmptyString(),
    })
    .transform((value, originalValue) => {
      if (isEmpty(value?.firstName) && isEmpty(value?.middleName) && isEmpty(value?.lastName))
        return undefined;

      return originalValue;
    })
    .default(undefined),
  publicContactNumber: yup.object({
    countryCode: yup.string().required('Country Code is required'),
    number: yup
      .string()
      .trim()
      .required('Number is required')
      .test('is-valid-number', 'Must be a valid 10 digital number', value => value?.length === 10),
  }),
  privateContactNumber: yup.object({
    countryCode: yup.string().required('Country Code is required'),
    number: yup
      .string()
      .trim()
      .required('Number is required')
      .test('is-valid-number', 'Must be a valid 10 digital number', value => value?.length === 10),
  }),
  description: yup.string().trim().stripEmptyString(),
  gstNumber: yup.string().trim().typeError('GST Number. is required').stripEmptyString(),
  foodLicense: yup.string().trim().typeError('GST Number. is required').stripEmptyString(),
  tradeLicense: yup.string().trim().typeError('GST Number. is required').stripEmptyString(),
  costForOne: yup.number().typeError('Required').required('Required').min(0, 'Cannot be negative'),
});

const AddMerchantStoreLocation: React.FC<AddMerchantStoreLocationProps> = ({
  opened,
  onClose,
  merchant,
}) => {
  const form = useForm<RequestMerchantStoreLocation>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: merchant.name,
      gstNumber: merchant.gstNumber,
      address: {
        formattedAddress: '',
        city: '',
        state: '',
        country: 'India',
        zipCode: undefined,
        coordinates: {
          lat: 22.563, // A default Kolkata location
          lng: 88.357, // A default Kolkata location
        },
      },
    },
  });

  const createStoreLocation = useCreateStoreLocation();

  const onSubmit = form.handleSubmit(async data => {
    console.log(data);

    createStoreLocation.mutate(
      {
        merchantId: merchant._id,
        store: data,
      },
      {
        onSuccess: () => {
          form.reset();
          onClose();
        },
      },
    );
  });

  return (
    <Modal opened={opened} onClose={onClose} title="Add Store Location" size="xl">
      <FormProvider {...form}>
        <form onSubmit={onSubmit}>
          <TextInput
            type="text"
            label="Merchant Name"
            placeholder="Merchant Name"
            required
            mb="md"
            {...form.register('name')}
            error={form.formState.errors.name?.message}
          />

          <Textarea
            placeholder="Description"
            label="Description"
            mb="md"
            {...form.register('description')}
            error={form.formState.errors.description?.message}
          />

          <Grid align="flex-end">
            <Grid.Col md={6}>
              <TextInput
                type="email"
                label="Email"
                placeholder="Email"
                description="We will send you a confirmation email once your merchant is approved."
                required
                mb="md"
                {...form.register('email')}
                error={form.formState.errors.email?.message}
              />
            </Grid.Col>
            <Grid.Col md={6}>
              <TextInput
                type="number"
                label="Cost for one"
                placeholder="Cost for one"
                description="Approximate price"
                required
                mb="md"
                {...form.register('costForOne')}
                error={form.formState.errors.costForOne?.message}
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col md={4}>
              <TextInput
                type="text"
                label="GST number"
                placeholder="GST number"
                mb="md"
                {...form.register('gstNumber')}
                error={form.formState.errors.gstNumber?.message}
              />
            </Grid.Col>
            <Grid.Col md={4}>
              <TextInput
                type="text"
                label="Trade License"
                placeholder="Trade License"
                mb="md"
                {...form.register('tradeLicense')}
                error={form.formState.errors.tradeLicense?.message}
              />
            </Grid.Col>
            <Grid.Col md={4}>
              <TextInput
                type="text"
                label="Food License (FASSAI)"
                placeholder="Food License (FASSAI)"
                mb="md"
                {...form.register('foodLicense')}
                error={form.formState.errors.foodLicense?.message}
              />
            </Grid.Col>
          </Grid>

          <GooglePlacesAutocomplete />

          <Grid align="flex-end">
            <Grid.Col md={6} lg={3}>
              <TextInput
                type="text"
                label="City"
                placeholder="City"
                mb="md"
                required
                {...form.register('address.city')}
                error={form.formState.errors.address?.city?.message}
              />
            </Grid.Col>
            <Grid.Col md={6} lg={3}>
              <TextInput
                type="text"
                label="State"
                placeholder="State"
                mb="md"
                required
                {...form.register('address.state')}
                error={form.formState.errors.address?.state?.message}
              />
            </Grid.Col>
            <Grid.Col md={6} lg={3}>
              <Controller
                control={form.control}
                name="address.country"
                render={({ field, fieldState }) => (
                  <Select
                    data={[{ value: 'India', label: 'India' }]}
                    label="Country"
                    placeholder="Select Country"
                    mb="md"
                    required
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error?.message}
                  />
                )}
              />
            </Grid.Col>
            <Grid.Col md={6} lg={3}>
              <TextInput
                type="text"
                label="Zipcode"
                placeholder="Zipcode"
                mb="md"
                required
                {...form.register('address.zipCode')}
                error={form.formState.errors.address?.zipCode?.message}
              />
            </Grid.Col>
          </Grid>

          <Grid align="flex-end">
            <Grid.Col md={6} lg={4}>
              <TextInput
                type="text"
                label="Owner's First Name"
                placeholder="Owner's First Name"
                mb="md"
                {...form.register('owner.firstName')}
                error={form.formState.errors.owner?.firstName?.message}
              />
            </Grid.Col>
            <Grid.Col md={6} lg={4}>
              <TextInput
                type="text"
                label="Owner's Middle Name"
                placeholder="Owner's Middle Name"
                mb="md"
                {...form.register('owner.middleName')}
                error={form.formState.errors.owner?.middleName?.message}
              />
            </Grid.Col>
            <Grid.Col md={6} lg={4}>
              <TextInput
                type="text"
                label="Owner's Last Name"
                placeholder="Owner's Last Name"
                mb="md"
                {...form.register('owner.lastName')}
                error={form.formState.errors.owner?.lastName?.message}
              />
            </Grid.Col>
          </Grid>

          <Grid align="flex-end">
            <Grid.Col md={6}>
              <Group align="flex-end">
                <NativeSelect
                  data={['+91']}
                  {...form.register('publicContactNumber.countryCode')}
                  mb="md"
                />
                <TextInput
                  type="tel"
                  label="Public Contact Number"
                  placeholder="Contact Number"
                  mb="md"
                  {...form.register('publicContactNumber.number')}
                  error={form.formState.errors.publicContactNumber?.number?.message}
                  required
                />
              </Group>
            </Grid.Col>
            <Grid.Col md={6}>
              <Group align="flex-end">
                <NativeSelect
                  data={['+91']}
                  {...form.register('privateContactNumber.countryCode')}
                  mb="md"
                />
                <TextInput
                  type="tel"
                  label="Private Contact Number"
                  placeholder="Contact Number"
                  mb="md"
                  {...form.register('privateContactNumber.number')}
                  error={form.formState.errors.privateContactNumber?.number?.message}
                  required
                />
              </Group>
            </Grid.Col>
          </Grid>

          <Button fullWidth type="submit" loading={form.formState.isSubmitting}>
            Onboard
          </Button>
        </form>
      </FormProvider>
    </Modal>
  );
};

export default AddMerchantStoreLocation;
