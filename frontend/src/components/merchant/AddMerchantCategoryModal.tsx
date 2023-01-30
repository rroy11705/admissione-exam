import React from 'react';
import { Box, Button, Modal, Select } from '@mantine/core';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '../../utils/yup';
import { useAddCategoryToMerchant, useMerchantCategory } from '../../apis/queries/merchant.queries';
import { ICategory } from '../../types';

type AddMerchantCategoryModalProps = {
  opened: boolean;
  setOpened: (value: boolean) => void;
  merchantId: string;
};

type AddMerchantCategoryInput = {
  categoryId: string;
};

const schema = yup.object({
  categoryId: yup
    .string()
    .typeError('Merchant category is required.')
    .required('Merchant category is required.')
    .trim(),
});

const AddMerchantCategoryModal: React.FC<AddMerchantCategoryModalProps> = ({
  opened,
  setOpened,
  merchantId,
}) => {
  const addCategoryToMerchant = useAddCategoryToMerchant();
  const merchantCategories = useMerchantCategory();

  const form = useForm<AddMerchantCategoryInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      categoryId: '',
    },
  });

  const onSubmit = form.handleSubmit(async data => {
    const { categoryId } = data;
    addCategoryToMerchant.mutate(
      {
        merchantId,
        categoryId,
      },
      {
        onSuccess: () => {
          setOpened(false);
        },
      },
    );
  });
  return (
    <Modal
      title="Add Merchant Category."
      opened={opened}
      onClose={() => setOpened(false)}
      size="md"
    >
      <Box className="flex flex-col gap-4">
        <form onSubmit={onSubmit}>
          <Controller
            control={form.control}
            name="categoryId"
            render={({ field, fieldState }) => (
              <Select
                data={(merchantCategories.data ?? []).map((item: ICategory) => ({
                  value: item._id,
                  label: item.name,
                }))}
                label="Choose Merchant Category"
                placeholder="Choose Merchant Category"
                mb="md"
                required
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
                clearable
              />
            )}
          />
          <Button fullWidth type="submit" loading={addCategoryToMerchant.isLoading}>
            Submit
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default AddMerchantCategoryModal;
