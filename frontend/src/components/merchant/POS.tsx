import React from 'react';
import QRCodeStyling from 'qr-code-styling';
import { UnstyledButton } from '@mantine/core';
import html2canvas from 'html2canvas';
import { showNotification } from '@mantine/notifications';
import POSTemplate from './POSTemplate';
import { downloadImage } from '../../utils';

const qrCode = new QRCodeStyling({
  'width': 310,
  'height': 300,
  'data': 'SCM-10000000',
  'margin': 0,
  'qrOptions': {
    'typeNumber': 0,
    'mode': 'Byte',
    'errorCorrectionLevel': 'Q',
  },
  'imageOptions': {
    'hideBackgroundDots': true,
    'imageSize': 0.4,
    'margin': 0,
  },
  'dotsOptions': {
    'type': 'dots',
    'color': '#ffffff',
  },
  'backgroundOptions': {
    'color': '#000000',
  },
  'image': undefined,
  'cornersSquareOptions': {
    'type': 'dot',
    'color': '#ffffff',
  },
  'cornersDotOptions': {
    'type': 'dot',
    'color': '#c3f53b',
  },
});

type QRCodeProps = {
  storeName: string;
  uniqueId: string;
};

const QRCode: React.FC<QRCodeProps> = ({ storeName, uniqueId }) => {
  const qrRef = React.useRef<HTMLDivElement>(null);
  const pocRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    qrCode.append(qrRef.current as HTMLDivElement);
  }, []);

  React.useEffect(() => {
    qrCode.update({
      data: uniqueId,
    });
  }, [uniqueId]);

  const exportAsImage = async (element: HTMLDivElement | null, imageFileName: string) => {
    if (element) {
      const canvas = await html2canvas(element);
      const image = canvas.toDataURL('image/png', 1.0);
      downloadImage(image, imageFileName);
    } else {
      showNotification({
        title: 'Unable to Download POS.',
        message: 'Something Went Wrong.',
      });
    }
  };

  return (
    <div>
      <div className="overflow-hidden h-0 w-0">
        <div className="relative w-[384px]" ref={pocRef}>
          <POSTemplate />
          <div className="absolute top-[100px] left-1/2 -translate-x-1/2" ref={qrRef} />
          <div className="absolute whitespace-nowrap rotate-90 origin-right font-sans text-neon font-semibold text-[27.5px] leading-[100%] -tracking-[0.005em] right-[44px] bottom-[60px]">
            {storeName}
          </div>
        </div>
      </div>

      {pocRef && (
        <UnstyledButton
          color="green"
          onClick={() => exportAsImage(pocRef.current, `${storeName} - POS`)}
        >
          Download POS
        </UnstyledButton>
      )}
    </div>
  );
};

export default QRCode;
