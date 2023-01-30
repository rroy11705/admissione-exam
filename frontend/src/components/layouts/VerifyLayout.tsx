import { Button } from '@mantine/core';
import React from 'react';
import { IStudent } from '../../types';

interface Props {
  onAffirmation: (e: React.MouseEvent, studentData: IStudent | undefined) => void;
  onNegation: () => void;
  studentData: IStudent | undefined;
}

const VerifyLayout = (props: Props) => {
  const { onAffirmation, onNegation, studentData } = props;
  return (
    <div>
      <div className="text-xl m-5 mb-10">Do you really want to verify this student ?</div>
      <div className="flex flex-row justify-end">
        <div className="mr-2">
          <Button onClick={(e: React.MouseEvent) => onAffirmation(e, studentData)} color="blue">
            Yes
          </Button>
        </div>
        <div>
          <Button onClick={onNegation} color="gray">
            No
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerifyLayout;
