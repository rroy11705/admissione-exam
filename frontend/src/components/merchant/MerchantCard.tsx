import React from 'react';
import {
  faBriefcase,
  faCheckCircle,
  faClose,
  faEnvelope,
  faMap,
  faPhone,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Divider, Grid, Group, Stack, Text, Title } from '@mantine/core';
import { isEmpty } from 'lodash';
import dynamic from 'next/dynamic';
import { IMerchant } from '../../types';
import { normalizeName } from '../../utils';

const QRCode = dynamic(() => import('./QRCode'), { ssr: false });

const MerchantCard: React.FC<{ merchant: IMerchant }> = ({ merchant }) => (
  <Card shadow="sm" p="lg" mb="md">
    <Group position="apart">
      <Title order={5} className="">
        {merchant.name}
      </Title>
      <Text size="sm">{merchant.gstNumber}</Text>
    </Group>
    <Divider mb="sm" />

    {!isEmpty(merchant.description) ? (
      <div className="mb-3">
        <small className="block text-gray-500 text-xs">Description</small>
        <Text size="sm" mb="md" color="gray">
          {merchant.description}
        </Text>
      </div>
    ) : null}

    <Grid mb="md">
      <Grid.Col sm={12} md={6}>
        <QRCode uniqueId={merchant.uniqueId} />
      </Grid.Col>
      <Grid.Col sm={12} md={6}>
        <Stack>
          <Group>
            <FontAwesomeIcon icon={faEnvelope} />
            <div>
              <small className="block text-gray-500 text-xs">Email</small>
              <span>{merchant.email}</span>
            </div>
          </Group>

          <Group>
            <FontAwesomeIcon icon={faPhone} />
            <div>
              <small className="block text-gray-500 text-xs">Public Contact Number</small>
              <span>
                {merchant.publicContactNumber?.countryCode} {merchant.publicContactNumber?.number}
              </span>
            </div>
          </Group>

          <Group>
            <FontAwesomeIcon icon={faPhone} />
            <div>
              <small className="block text-gray-500 text-xs">Private Contact Number</small>
              <span>
                {merchant.privateContactNumber?.countryCode} {merchant.privateContactNumber?.number}
              </span>
            </div>
          </Group>
        </Stack>
      </Grid.Col>
    </Grid>

    <div className="flex items-center gap-4 mb-4">
      <FontAwesomeIcon icon={faMap} />

      <div className="flex-grow">
        <small className="block text-gray-500 text-sm">Address</small>
        <span className="block mb-2">{merchant.address?.formattedAddress}</span>

        <Grid>
          <Grid.Col md={6} lg={3}>
            <small className="block text-gray-500 text-sm">City</small>
            <span className="block">{merchant.address?.city}</span>
          </Grid.Col>

          <Grid.Col md={6} lg={3}>
            <small className="block text-gray-500 text-sm">State</small>
            <span className="block">{merchant.address?.state}</span>
          </Grid.Col>

          <Grid.Col md={6} lg={3}>
            <small className="block text-gray-500 text-sm">Country</small>
            <span className="block">{merchant.address?.country}</span>
          </Grid.Col>

          <Grid.Col md={6} lg={3}>
            <small className="block text-gray-500 text-sm">Zipcode</small>
            <span className="block">{merchant.address?.zipCode}</span>
          </Grid.Col>
        </Grid>
      </div>
    </div>

    <Grid>
      <Grid.Col md={4}>
        <Group>
          <FontAwesomeIcon icon={faUser} />

          <div>
            <small className="block text-gray-500 text-sm">Owner's Name</small>
            <span className="block">{normalizeName(merchant.owner)}</span>
          </div>
        </Group>
      </Grid.Col>

      <Grid.Col md={4}>
        <Group>
          <FontAwesomeIcon icon={faBriefcase} />

          <div>
            <small className="block text-gray-500 text-sm">Business Type</small>
            <span className="block">{merchant.businessType}</span>
          </div>
        </Group>
      </Grid.Col>
    </Grid>

    <Grid>
      <Grid.Col md={4}>
        <Group>
          <FontAwesomeIcon
            icon={merchant.isOnline ? faCheckCircle : faClose}
            className={merchant.isOnline ? 'text-green-500' : 'text-red-500'}
          />
          <p>Is Online</p>
        </Group>
      </Grid.Col>
      <Grid.Col md={4}>
        <Group>
          <FontAwesomeIcon
            icon={merchant.isVerified ? faCheckCircle : faClose}
            className={merchant.isVerified ? 'text-green-500' : 'text-red-500'}
          />
          <p>Verified</p>
        </Group>
      </Grid.Col>
      <Grid.Col md={4}>
        <Group>
          <FontAwesomeIcon
            icon={merchant.isActive ? faCheckCircle : faClose}
            className={merchant.isActive ? 'text-green-500' : 'text-red-500'}
          />
          <p>Active</p>
        </Group>
      </Grid.Col>
    </Grid>
  </Card>
);

export default MerchantCard;
