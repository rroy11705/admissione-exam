import { Grid, Image } from '@mantine/core';
import React from 'react';
import { IKYSDetails, IStudent } from '../../types';
import Avatar from '../../assets/images/Avatar.png';

interface Props {
  kysDetails: IKYSDetails | undefined;
  studentDetails: IStudent | undefined;
}

const KYSLayout = (props: Props) => {
  const { kysDetails, studentDetails } = props;

  return (
    <Grid>
      <Grid.Col sm={12}>
        <Grid>
          <Grid.Col sm={6}>
            <Image
              width={100}
              height={100}
              src={studentDetails?.profilePicture ? studentDetails.profilePicture : Avatar.src}
            />
          </Grid.Col>
          <Grid.Col sm={6}>
            <div>
              <div className="flex items-start flex-col mb-3">
                <small className="block text-gray-500 text-sm">Name</small>
                <span className="block">
                  {studentDetails?.firstName} {studentDetails?.middleName}{' '}
                  {studentDetails?.lastName}
                </span>
              </div>
              <div className="flex items-start flex-col mb-3">
                <small className="block text-gray-500 text-sm">Aadhar Number</small>
                <span className="block font-bold text-lg">
                  {kysDetails?.aadhaarNumber ? kysDetails?.aadhaarNumber : '-'}
                </span>
              </div>
            </div>
          </Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col>
            <div className="mb-5">
              <small className="block text-gray-500 text-lg mb-5">Aadhar Card Image</small>
              <span className="block">
                {/* <Image width={300} height={150} src={kysDetails?.aadhaarCardPhoto?.path} /> */}
              </span>
            </div>
          </Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col>
            <div className="mb-5">
              <small className="block text-gray-500 text-lg mb-5">Identity Card Details</small>
              <span className="block">
                {/* <Image width={300} height={150} src={kysDetails?.institutionIdentityCard?.path} /> */}
              </span>
            </div>
          </Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col>
            <div className="mb-5">
              <small className="block text-gray-500 text-lg mb-2">Video Details</small>
              <span className="block">
                {/* <a href={kysDetails?.institutionIdentityCard?.path}>
                  <Button>Download Video</Button>
                </a> */}
              </span>
            </div>
          </Grid.Col>
        </Grid>
      </Grid.Col>
    </Grid>
  );
};

export default KYSLayout;
