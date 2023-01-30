import React from 'react';
import {
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
import { IMerchantStoreLocation } from '../../types';
import { normalizeName } from '../../utils';

const QRCode = dynamic(() => import('./QRCode'), { ssr: false });

const MerchantStoreCard: React.FC<{ store: IMerchantStoreLocation }> = ({ store }) => (
  <Card shadow="sm" p="lg" mb="md">
    <Group position="apart">
      <Title order={5} className="">
        {store.name}
      </Title>
      <Text size="sm">{store.gstNumber}</Text>
    </Group>
    <Divider mb="sm" />

    {!isEmpty(store.description) ? (
      <div className="mb-3">
        <small className="block text-gray-500 text-xs">Description</small>
        <Text size="sm" mb="md" color="gray">
          {store.description}
        </Text>
      </div>
    ) : null}

    <Grid mb="md">
      <Grid.Col sm={12} md={6}>
        <QRCode uniqueId={store.uniqueId} />
      </Grid.Col>
      <Grid.Col sm={12} md={6}>
        <Stack>
          <Group>
            <FontAwesomeIcon icon={faEnvelope} />
            <div>
              <small className="block text-gray-500 text-xs">Email</small>
              <span>{store.email}</span>
            </div>
          </Group>

          <Group>
            <FontAwesomeIcon icon={faPhone} />
            <div>
              <small className="block text-gray-500 text-xs">Public Contact Number</small>
              <span>
                {store.publicContactNumber?.countryCode} {store.publicContactNumber?.number}
              </span>
            </div>
          </Group>

          <Group>
            <FontAwesomeIcon icon={faPhone} />
            <div>
              <small className="block text-gray-500 text-xs">Private Contact Number</small>
              <span>
                {store.privateContactNumber?.countryCode} {store.privateContactNumber?.number}
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
        <span className="block mb-2">{store.address?.formattedAddress}</span>

        <Grid>
          <Grid.Col md={6} lg={3}>
            <small className="block text-gray-500 text-sm">City</small>
            <span className="block">{store.address?.city}</span>
          </Grid.Col>

          <Grid.Col md={6} lg={3}>
            <small className="block text-gray-500 text-sm">State</small>
            <span className="block">{store.address?.state}</span>
          </Grid.Col>

          <Grid.Col md={6} lg={3}>
            <small className="block text-gray-500 text-sm">Country</small>
            <span className="block">{store.address?.country}</span>
          </Grid.Col>

          <Grid.Col md={6} lg={3}>
            <small className="block text-gray-500 text-sm">Zipcode</small>
            <span className="block">{store.address?.zipCode}</span>
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
            <span className="block">{normalizeName(store.owner)}</span>
          </div>
        </Group>
      </Grid.Col>
    </Grid>

    <Grid>
      <Grid.Col md={4}>
        <Group>
          <FontAwesomeIcon
            icon={store.isVerified ? faCheckCircle : faClose}
            className={store.isVerified ? 'text-green-500' : 'text-red-500'}
          />
          <p>Verified</p>
        </Group>
      </Grid.Col>
      <Grid.Col md={4}>
        <Group>
          <FontAwesomeIcon
            icon={store.isActive ? faCheckCircle : faClose}
            className={store.isActive ? 'text-green-500' : 'text-red-500'}
          />
          <p>Active</p>
        </Group>
      </Grid.Col>
    </Grid>
  </Card>
);

export default MerchantStoreCard;
