import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, Modal, Select, TextInput } from '@mantine/core';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import {
  useCreateMerchantStaff,
  useCreateMerchantStaffForStore,
} from '../../apis/queries/merchantStaff.queries';
import { IMerchantStaffCreateRequest } from '../../types';
import { MERCHANT_STAFF_ROLES } from '../../types/enums';
import yup from '../../utils/yup';

type AddMerchantStaffFormProps = {
  opened: boolean;
  onClose: () => void;
  merchantId?: string;
  storeId?: string;
  name: string;
  owner?: boolean;
};

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
});

const storeRoleOptions = [
  { value: MERCHANT_STAFF_ROLES.MANAGER, label: 'Manager' },
  { value: MERCHANT_STAFF_ROLES.STAFF, label: 'Staff' },
];

const merchantRoleOptions = [{ value: MERCHANT_STAFF_ROLES.OWNER, label: 'Owner' }];

const AddMerchantStaffForm: React.FC<AddMerchantStaffFormProps> = ({
  opened,
  onClose,
  storeId,
  merchantId,
  name,
  owner,
}) => {
  const createMerchantStaff = useCreateMerchantStaff();
  const createMerchantStaffForStore = useCreateMerchantStaffForStore();

  const form = useForm<CreateMerchantStaffInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      role: owner ? MERCHANT_STAFF_ROLES.OWNER : MERCHANT_STAFF_ROLES.MANAGER,
    },
  });

  const onSubmit = form.handleSubmit(async data => {
    const { ...payload } = data;

    if (!owner && storeId) {
      createMerchantStaffForStore.mutate(
        {
          storeId,
          payload,
        },
        {
          onSuccess: () => {
            form.reset();
            onClose();
          },
        },
      );
    } else if (owner && merchantId) {
      createMerchantStaff.mutate(
        {
          merchantId,
          payload,
        },
        {
          onSuccess: () => {
            form.reset();
            onClose();
          },
        },
      );
    }
  });

  return (
    <Modal opened={opened} onClose={onClose} title={`Add New Staff for ${name}`} size="xl">
      <FormProvider {...form}>
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
                    data={owner ? merchantRoleOptions : storeRoleOptions}
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
          </Grid>

          <Button
            fullWidth
            type="submit"
            loading={owner ? createMerchantStaff.isLoading : createMerchantStaffForStore.isLoading}
          >
            ADD
          </Button>
        </form>
      </FormProvider>
    </Modal>
  );
};

export default AddMerchantStaffForm;
