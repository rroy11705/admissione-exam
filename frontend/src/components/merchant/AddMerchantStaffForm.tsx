import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, Grid, Select, TextInput } from '@mantine/core';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMerchants } from '../../apis/queries/merchant.queries';
import {
  useCreateMerchantStaff,
  useCreateMerchantStaffForStore,
} from '../../apis/queries/merchantStaff.queries';
import { useStoreLocations } from '../../apis/queries/merchantStoreLocation.queries';
import { IMerchantStaffCreateRequest } from '../../types';
import { MERCHANT_STAFF_ROLES } from '../../types/enums';
import yup from '../../utils/yup';

type CreateMerchantStaffInput = Omit<
  IMerchantStaffCreateRequest,
  '_id' | 'createdAt' | 'updatedAt'
> & {
  merchantId: string;
  storeId?: string;
};

const schema = yup.object({
  firstName: yup.string().required().trim(),
  lastName: yup.string().required().trim(),
  email: yup.string().required().trim().email(),
  role: yup.string().required().trim(),
  merchantId: yup.string().required().trim(),
  storeId: yup.string().trim().nullable(),
});

const storeRoleOptions = [
  { value: MERCHANT_STAFF_ROLES.MANAGER, label: 'Manager' },
  { value: MERCHANT_STAFF_ROLES.STAFF, label: 'Staff' },
];

const merchantRoleOptions = [
  { value: MERCHANT_STAFF_ROLES.OWNER, label: 'Owner' },
  ...storeRoleOptions,
];

const AddMerchantStaffForm = () => {
  const createMerchantStaff = useCreateMerchantStaff();
  const createMerchantStaffForStore = useCreateMerchantStaffForStore();

  const [searchValue, onSearchChange] = React.useState('');
  React.useEffect(() => console.log({ searchValue }), [searchValue]);

  // TODO: auto-scroll stores
  const merchants = useMerchants(1, 50, searchValue);

  const form = useForm<CreateMerchantStaffInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      role: MERCHANT_STAFF_ROLES.OWNER,
    },
  });

  const merchant = form.watch('merchantId');

  // TODO: auto-scroll stores
  const stores = useStoreLocations(merchant, 1, 50);

  const onSubmit = form.handleSubmit(async data => {
    const { merchantId, storeId, ...payload } = data;

    if (storeId) {
      createMerchantStaffForStore.mutate({
        storeId,
        payload,
      });
    } else {
      createMerchantStaff.mutate({
        merchantId,
        payload,
      });
    }
  });

  return (
    <Card>
      <form onSubmit={onSubmit}>
        <Grid>
          <Grid.Col sm={12} md={6}>
            <TextInput
              type="text"
              label="First Name"
              placeholder="First Name"
              required
              mb="md"
              {...form.register('firstName')}
              error={form.formState.errors.firstName?.message}
            />
          </Grid.Col>

          <Grid.Col sm={12} md={6}>
            <TextInput
              type="text"
              label="Last Name"
              placeholder="Last Name"
              required
              mb="md"
              {...form.register('lastName')}
              error={form.formState.errors.lastName?.message}
            />
          </Grid.Col>

          <Grid.Col sm={12} md={6}>
            <TextInput
              type="email"
              label="Email"
              placeholder="Email"
              required
              mb="md"
              {...form.register('email')}
              error={form.formState.errors.email?.message}
            />
          </Grid.Col>

          <Grid.Col sm={12} md={6}>
            <Controller
              control={form.control}
              name="role"
              render={({ field, fieldState }) => (
                <Select
                  data={merchantRoleOptions}
                  label="Role"
                  placeholder="Role"
                  mb="md"
                  required
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                  clearable
                />
              )}
            />
          </Grid.Col>

          <Grid.Col sm={12} md={6}>
            <Controller
              control={form.control}
              name="merchantId"
              render={({ field, fieldState }) => (
                <Select
                  data={(merchants.data?.merchants ?? []).map(item => ({
                    value: item._id,
                    label: item.name,
                  }))}
                  label="Merchant"
                  placeholder="Merchant"
                  mb="md"
                  required
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                  clearable
                  onSearchChange={onSearchChange}
                  searchValue={searchValue}
                  searchable
                />
              )}
            />
          </Grid.Col>
          <Grid.Col sm={12} md={6}>
            <Controller
              control={form.control}
              name="storeId"
              render={({ field, fieldState }) => (
                <Select
                  data={(stores.data?.merchantStoreLocations ?? []).map(store => ({
                    value: store._id,
                    label: store.name,
                  }))}
                  label="Store"
                  placeholder="Store"
                  mb="md"
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                  clearable
                  searchable
                />
              )}
            />
          </Grid.Col>
        </Grid>

        <Button fullWidth type="submit" loading={createMerchantStaff.isLoading}>
          ADD
        </Button>
      </form>
    </Card>
  );
};

export default AddMerchantStaffForm;
