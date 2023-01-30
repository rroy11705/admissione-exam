import { Button, ButtonProps, Modal } from '@mantine/core';
import React from 'react';

type VideoModalButtonProps = { src?: string; children?: ButtonProps['children'] };

const VideoModalButton: React.FC<VideoModalButtonProps> = ({ src, children }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <>
      <Button onClick={toggle}>{children}</Button>

      <Modal opened={isOpen} onClose={toggle} size="60%">
        <div className="w-full h-[60vh]">
          <video controls src={src} className="w-full h-full">
            <track kind="captions" />
          </video>
        </div>
      </Modal>
    </>
  );
};

export default VideoModalButton;
