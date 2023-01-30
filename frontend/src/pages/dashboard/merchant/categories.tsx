import { faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Card,
  Group,
  Table,
  Text,
  TextInput,
  Title,
  Image as MantineImage,
} from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { openConfirmModal } from '@mantine/modals';
import Head from 'next/head';
import Image from 'next/image';
import React, { ReactElement } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import {
  useCreateMerchantCategory,
  useDeleteMerchantCategory,
  useMerchantCategories,
} from '../../../apis/queries/merchantCategories.queries';
import { useUpload } from '../../../apis/queries/upload.queries';
import AppLayout from '../../../components/layouts/AppLayout';
import { CategoryRequest, NextPageWithLayout } from '../../../types';
import { withAuth } from '../../../utils/authentication';

const schema = yup.object({
  name: yup.string().required(),
  file: yup.mixed(),
});

type FormInput = Omit<CategoryRequest, 'image'> & {
  file: File | null;
};

const CategoriesPage: NextPageWithLayout = () => {
  const uploadFile = useUpload();
  const categories = useMerchantCategories();
  const createCategory = useCreateMerchantCategory();
  const deleteCategory = useDeleteMerchantCategory();

  const form = useForm<FormInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      file: null,
    },
  });

  const fileValue = form.watch('file');

  React.useEffect(() => console.log(fileValue), [fileValue]);

  const onSubmit = form.handleSubmit(async data => {
    console.log({ data });

    try {
      let fileId: string | undefined;

      if (data.file) {
        const formData = new FormData();
        formData.append('file', data.file);

        const uploadedFile = await uploadFile.mutateAsync(formData);

        fileId = uploadedFile._id;
      }

      await createCategory.mutateAsync({
        name: data.name,
        image: fileId,
      });

      form.reset();
    } catch (err) {
      console.log(err);
    }
  });

  const handleDelete = async (categoryId: string) => {
    openConfirmModal({
      title: 'Please confirm your action',
      children: <p>Deleting the category will remove all data from this category</p>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onCancel: () => {},
      onConfirm: () => {
        console.log('delete category', categoryId);
        deleteCategory.mutate(categoryId);
      },
    });
  };

  return (
    <main>
      <Head>
        <title>Categories</title>
        <meta name="description" content="merchant categories" />
      </Head>

      <Title order={3} className="">
        Merchant Categories
      </Title>

      <Card>
        <form onSubmit={onSubmit}>
          <Controller
            name="file"
            control={form.control}
            render={({ field: { onChange }, fieldState }) => (
              <Dropzone
                onDrop={files => {
                  console.log('accepted files', files);
                  onChange(files[0]);
                }}
                onReject={files => console.log('rejected files', files)}
                maxSize={3 * 1024 ** 2}
                accept={[MIME_TYPES.png, MIME_TYPES.jpeg]}
                loading={form.formState.isSubmitting}
              >
                <Group position="center" spacing="xl">
                  <Dropzone.Accept>
                    <FontAwesomeIcon icon={faUpload} />
                  </Dropzone.Accept>
                  <Dropzone.Reject>
                    <FontAwesomeIcon icon={faUpload} />
                  </Dropzone.Reject>
                  <Dropzone.Idle>
                    <FontAwesomeIcon icon={faUpload} />
                  </Dropzone.Idle>

                  <div>
                    <Text size="xl" inline>
                      Drag images here or click to select files
                    </Text>
                    {fieldState.error?.message ? (
                      <Text size="sm" color="red" inline mt={7}>
                        {fieldState.error?.message}
                      </Text>
                    ) : null}
                  </div>

                  {fileValue ? (
                    <MantineImage
                      src={URL.createObjectURL(fileValue as unknown as Blob)}
                      imageProps={{
                        onLoad: () =>
                          URL.revokeObjectURL(URL.createObjectURL(fileValue as unknown as Blob)),
                      }}
                      width={80}
                      height={80}
                      fit="contain"
                    />
                  ) : null}
                </Group>
              </Dropzone>
            )}
          />

          <TextInput
            type="text"
            label="Name"
            placeholder="Merchant category name"
            mb="md"
            required
            {...form.register('name')}
            error={form.formState.errors.name?.message}
            disabled={form.formState.isSubmitting}
          />

          <Group position="right">
            <Button type="submit" loading={createCategory.isLoading || form.formState.isSubmitting}>
              Save
            </Button>
          </Group>
        </form>
      </Card>

      <Table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th align="right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.data?.map(category => (
            <tr key={category._id}>
              <td>
                {category.image?._id ? (
                  <Image
                    src={category?.image?.path}
                    alt="upload"
                    height={80}
                    width={80}
                    layout="fixed"
                    objectFit="contain"
                  />
                ) : null}
              </td>
              <td>{category.name}</td>
              <td align="right">
                <Button
                  color="red"
                  onClick={() => handleDelete(category._id)}
                  loading={deleteCategory.isLoading}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </main>
  );
};

CategoriesPage.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export const getServerSideProps = withAuth(async context => ({
  props: {
    user: context.req.user,
  },
}));

export default CategoriesPage;
