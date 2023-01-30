import React from 'react';
import {
  faHourglassStart,
  faHourglassEnd,
  faMoneyCheckDollar,
  faMoneyBillTransfer,
  faSackDollar,
  faPercent,
  faPencil,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Badge, Box, Card, Divider, Grid, Group, Image, Stack, Title } from '@mantine/core';
import { ISocialEvent } from '../../types';

const SocialEvent: React.FC<{ socialEvent: ISocialEvent }> = ({ socialEvent }) => (
  <Card shadow="sm" p="lg" mb="md">
    <Group position="apart">
      <Title order={5} className="">
        {socialEvent.name}
      </Title>
    </Group>
    <Divider mb="sm" />

    {/* {!isEmpty(socialEvent.description) ? (
      <div className="mb-3">
        <small className="block text-gray-500 text-xs">Description</small>
        <Text size="sm" mb="md" color="gray">
          {merchant.description}
        </Text>
      </div>
    ) : null} */}

    <Grid mb="md">
      <Grid.Col sm={12} md={2}>
        <Image src={socialEvent.image?.path} alt={socialEvent.name} />
      </Grid.Col>
      <Grid.Col sm={12} md={10}>
        <Grid mb="md">
          <Grid.Col sm={12} md={4}>
            <Stack>
              <Group>
                <FontAwesomeIcon icon={faSackDollar} />
                <div>
                  <small className="block text-gray-500 text-xs">Actual Price</small>
                  <span>{`₹ ${parseFloat(socialEvent.actualPrice || '0.00').toFixed(2)}`}</span>
                </div>
              </Group>

              <Group>
                <FontAwesomeIcon icon={faPercent} />
                <div>
                  <small className="block text-gray-500 text-xs">Discount Percentage</small>
                  <span>{`${parseFloat(socialEvent.discountPercentage || '0.00').toFixed(
                    2,
                  )}%`}</span>
                </div>
              </Group>

              <Group>
                <FontAwesomeIcon icon={faSackDollar} />
                <div>
                  <small className="block text-gray-500 text-xs">Discounted Price</small>
                  <span>{`₹ ${parseFloat(socialEvent.discountedPrice || '0.00').toFixed(2)}`}</span>
                </div>
              </Group>
            </Stack>
          </Grid.Col>
          <Grid.Col sm={12} md={4}>
            <Stack>
              <Group>
                <FontAwesomeIcon icon={faMoneyCheckDollar} />
                <div>
                  <small className="block text-gray-500 text-xs mb-1">Payment Methods</small>
                  <Box className="flex flex-row gap-4">
                    {socialEvent.paymentMethods.length > 0
                      ? socialEvent.paymentMethods.map(item => <Badge key={item}>{item}</Badge>)
                      : '-'}
                  </Box>
                </div>
              </Group>

              <Group>
                <FontAwesomeIcon icon={faMoneyBillTransfer} />
                <div>
                  <small className="block text-gray-500 text-xs">upiId</small>
                  <span>{socialEvent.upiId || '-'}</span>
                </div>
              </Group>
            </Stack>
          </Grid.Col>
          <Grid.Col sm={12} md={4}>
            <Stack>
              <Group>
                <FontAwesomeIcon icon={faHourglassStart} />
                <div>
                  <small className="block text-gray-500 text-xs">Start Date</small>
                  <span>{new Date(socialEvent.startDate).toLocaleString()}</span>
                </div>
              </Group>

              <Group>
                <FontAwesomeIcon icon={faHourglassEnd} />
                <div>
                  <small className="block text-gray-500 text-xs">End Date</small>
                  <span>{new Date(socialEvent.endDate).toLocaleString()}</span>
                </div>
              </Group>
            </Stack>
          </Grid.Col>
        </Grid>
      </Grid.Col>
    </Grid>
    <Grid mb="md">
      <Grid.Col sm={12}>
        <Group>
          <FontAwesomeIcon icon={faPencil} />
          <div>
            <small className="block text-gray-500 text-xs">Instructions</small>
          </div>
        </Group>
        <div>{socialEvent.instructions}</div>
      </Grid.Col>
    </Grid>
  </Card>
);

export default SocialEvent;
