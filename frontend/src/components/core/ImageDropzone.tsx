import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AspectRatio, Image, Stack, Text, useMantineTheme } from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

const ImageDropzone = () => {
  const theme = useMantineTheme();
  const form = useFormContext();
  const fileValue = form.watch('file');
  const logoURL = form.watch('logo');

  return (
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
          <AspectRatio ratio={1} sx={{ maxWidth: 300 }} mx="auto">
            <div>
              {fileValue ? (
                <Image
                  src={URL.createObjectURL(fileValue as unknown as Blob)}
                  imageProps={{
                    onLoad: () =>
                      URL.revokeObjectURL(URL.createObjectURL(fileValue as unknown as Blob)),
                  }}
                  fit="contain"
                />
              ) : logoURL ? (
                <Image
                  src={logoURL.path}
                  fit="cover"
                  styles={{ image: { aspectRatio: '1/1', borderRadius: '10px' } }}
                />
              ) : (
                <Stack>
                  <Dropzone.Accept>
                    <FontAwesomeIcon
                      icon={faUpload}
                      size="4x"
                      color={theme.colors[theme.primaryColor]['6']}
                    />
                  </Dropzone.Accept>
                  <Dropzone.Reject>
                    <FontAwesomeIcon
                      icon={faUpload}
                      size="4x"
                      color={theme.colors[theme.primaryColor]['6']}
                    />
                  </Dropzone.Reject>
                  <Dropzone.Idle>
                    <FontAwesomeIcon
                      icon={faUpload}
                      size="4x"
                      color={theme.colors[theme.primaryColor]['6']}
                    />
                  </Dropzone.Idle>

                  <div>
                    <Text size="xl" inline align="center" color={theme.colors.gray['5']}>
                      Drag images here or click to select files
                    </Text>
                    {fieldState.error?.message ? (
                      <Text size="sm" color="red" inline mt={7} align="center">
                        {fieldState.error?.message}
                      </Text>
                    ) : null}
                  </div>
                </Stack>
              )}
            </div>
          </AspectRatio>
        </Dropzone>
      )}
    />
  );
};

export default ImageDropzone;
