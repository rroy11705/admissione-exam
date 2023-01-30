import { faPercentage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Card,
  Grid,
  Group,
  NativeSelect,
  Radio,
  Select,
  Switch,
  TextInput,
} from '@mantine/core';
import { capitalize, isEmpty } from 'lodash';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useCreateMerchant } from '../../apis/queries/merchant.queries';
import { useUpload } from '../../apis/queries/upload.queries';
import { RequestMerchant } from '../../types';
import { BUSINESS_TYPES } from '../../types/enums';
import yup from '../../utils/yup';
import GooglePlacesAutocomplete from '../core/GooglePlacesAutocomplete';
import ImageDropzone from '../core/ImageDropzone';

const schema = yup.object({
  file: yup.mixed().required('Required'),
  name: yup.string().trim().typeError('Name is required').required('Name is required'),
  email: yup.string().trim().email().typeError('Email is required').required('Email is required'),
  gstNumber: yup.string().trim().typeError('GST Number. is required').stripEmptyString(),
  foodLicense: yup.string().trim().typeError('GST Number. is required').stripEmptyString(),
  tradeLicense: yup.string().trim().typeError('GST Number. is required').stripEmptyString(),
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
  businessType: yup.string().trim().required('Business Type is required'),
  websiteLink: yup.string().trim().url().stripEmptyString(),
  redirectionLink: yup.string().trim().url().stripEmptyString(),
  isOnline: yup.boolean(),
  discount: yup
    .number()
    .typeError('Discount is required')
    .required('Required')
    .min(1, 'Discount percentage cannot be less than one')
    .max(100, 'Discount percentage cannot be greater than 100'),
});

type FormInput = RequestMerchant & {
  file: File | null;
};

const OnboardMerchantForm = () => {
  const form = useForm<FormInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      businessType: BUSINESS_TYPES.PERSONAL,
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
      isOnline: false,
    },
  });

  const onboardMerchant = useCreateMerchant();
  const uploadFile = useUpload();

  const onSubmit = form.handleSubmit(async data => {
    const { file, ...payload } = data;

    try {
      if (file) {
        const formData = new FormData();
        if (data.file) formData.append('file', file);

        const uploadedFile = await uploadFile.mutateAsync(formData);

        await onboardMerchant.mutateAsync(
          { ...payload, logo: uploadedFile._id },
          {
            onSuccess: () => {
              form.reset();
            },
          },
        );
      }
    } catch (err) {
      //
    }
  });

  return (
    <FormProvider {...form}>
      <Card component="form" onSubmit={onSubmit}>
        <Grid align="flex-start">
          <Grid.Col md={4}>
            <ImageDropzone />
          </Grid.Col>
          <Grid.Col md={8}>
            <TextInput
              type="text"
              label="Merchant Name"
              placeholder="Merchant Name"
              required
              mb="md"
              {...form.register('name')}
              error={form.formState.errors.name?.message}
            />
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

            <TextInput
              type="text"
              label="GST Number"
              placeholder="GST Number"
              mb="md"
              {...form.register('gstNumber')}
              error={form.formState.errors.gstNumber?.message}
            />
            <TextInput
              type="text"
              label="Food License (FSSAI)"
              placeholder="Food License (FSSAI)"
              {...form.register('foodLicense')}
              error={form.formState.errors.foodLicense?.message}
              mb="md"
            />
            <TextInput
              type="text"
              label="Trade License"
              placeholder="Trade License"
              {...form.register('tradeLicense')}
              error={form.formState.errors.tradeLicense?.message}
              mb="md"
            />
          </Grid.Col>
        </Grid>

        <Grid align="flex-end">
          <Grid.Col md={4} lg={4}>
            <TextInput
              required
              type="number"
              label="Discount"
              placeholder="Discount"
              description="Must be the maximum discount percentage the merchant can provide including Sconto's commission percentage"
              mb="md"
              {...form.register('discount')}
              error={form.formState.errors.discount?.message}
              icon={<FontAwesomeIcon icon={faPercentage} />}
            />
          </Grid.Col>
          <Grid.Col md={4} lg={4}>
            <Controller
              control={form.control}
              name="businessType"
              render={({ field, fieldState }) => (
                <Radio.Group
                  label="Business Type"
                  required
                  mb="md"
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                >
                  <Radio
                    value={BUSINESS_TYPES.PERSONAL}
                    label={capitalize(BUSINESS_TYPES.PERSONAL)}
                  />
                  <Radio
                    value={BUSINESS_TYPES.FRANCHISES}
                    label={capitalize(BUSINESS_TYPES.FRANCHISES)}
                  />
                </Radio.Group>
              )}
            />
          </Grid.Col>
          <Grid.Col md={4} lg={4}>
            <label className="font-medium text-sm mb-3 block" htmlFor="isOnline">
              Is online?
            </label>
            <Controller
              control={form.control}
              name="isOnline"
              defaultValue={false}
              render={({ field }) => (
                <Switch
                  label="Is the business online only?"
                  checked={field.value}
                  onChange={event => field.onChange(event.currentTarget.checked)}
                  className="mb-3"
                />
              )}
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

        <Grid>
          <Grid.Col md={4}>
            <TextInput
              type="text"
              label="Website URL"
              placeholder="Website URL"
              mb="md"
              {...form.register('websiteLink')}
              error={form.formState.errors.websiteLink?.message}
            />
          </Grid.Col>
          <Grid.Col md={4}>
            <TextInput
              type="text"
              label="Redirect URL"
              placeholder="Redirect URL"
              mb="md"
              {...form.register('redirectionLink')}
              error={form.formState.errors.redirectionLink?.message}
            />
          </Grid.Col>
        </Grid>

        <Button fullWidth type="submit" loading={form.formState.isSubmitting}>
          Onboard
        </Button>
      </Card>
    </FormProvider>
  );
};

export default OnboardMerchantForm;
