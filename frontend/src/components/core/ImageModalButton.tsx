import { Button, ButtonProps, Modal } from '@mantine/core';
import React from 'react';

type ImageModalButtonProps = { src?: string; children?: ButtonProps['children'] };

const ImageModalButton: React.FC<ImageModalButtonProps> = ({ src, children }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <>
      <Button onClick={toggle}>{children}</Button>

      <Modal opened={isOpen} onClose={toggle} size="60%">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="modal" className="w-full h-[60vh]" />
      </Modal>
    </>
  );
};

export default ImageModalButton;
