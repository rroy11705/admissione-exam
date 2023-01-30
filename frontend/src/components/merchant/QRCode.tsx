import React from 'react';
import QRCodeStyling from 'qr-code-styling';
import { Button, Group } from '@mantine/core';

const qrCode = new QRCodeStyling({
  width: 300,
  height: 300,
  image: '/logo.svg',
  dotsOptions: {
    color: '#000',
    type: 'rounded',
  },
  imageOptions: {
    crossOrigin: 'anonymous',
    margin: 20,
  },
  backgroundOptions: {
    color: 'transparent',
  },
});

type QRCodeProps = {
  uniqueId: string;
};

const QRCode: React.FC<QRCodeProps> = ({ uniqueId }) => {
  const qrRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    qrCode.append(qrRef.current as HTMLDivElement);
  }, []);

  React.useEffect(() => {
    qrCode.update({
      data: uniqueId,
    });
  }, [uniqueId]);

  const handleDownloadSVG = () => {
    qrCode.download({
      extension: 'svg',
    });
  };

  const handleDownloadPNG = () => {
    qrCode.download({
      extension: 'png',
    });
  };

  return (
    <div>
      <div ref={qrRef} />

      <Group mt="md">
        <Button color="green" onClick={handleDownloadSVG}>
          Download as SVG
        </Button>
        <Button onClick={handleDownloadPNG}>Download as PNG</Button>
      </Group>
    </div>
  );
};

export default QRCode;
