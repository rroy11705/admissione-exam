import { faCheckCircle, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card } from '@mantine/core';
import dayjs from 'dayjs';
import React from 'react';
import { useResolveRejectionLog } from '../../apis/queries/kys.queries';
import { KYSRejectionLogs } from '../../types';

type KYSRejectionLogProps = {
  log: KYSRejectionLogs;
  studentId: string;
};
const KYSRejectionLog: React.FC<KYSRejectionLogProps> = ({ log, studentId }) => {
  const resolve = useResolveRejectionLog(studentId);

  const handlePress = () => {
    resolve.mutate({ logId: log._id, isResolved: true });
  };

  return (
    <Card shadow="lg" my="md">
      <p>
        Reason: <strong>{log.reason}</strong>
      </p>
      <p>
        Issue For: <strong>{log.issueFor}</strong>
      </p>
      <p>
        Created On: <strong>{dayjs(log.date).format('hh:mm A DD MMM YYYY')}</strong>
      </p>
      <p>
        Resolved:{' '}
        <strong>
          {log.resolved ? (
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />
          ) : (
            <FontAwesomeIcon icon={faCircleXmark} className="text-red-600" />
          )}
        </strong>
      </p>

      <Button color="green" mt="md" loading={resolve.isLoading} onClick={handlePress}>
        Mark as Resolved
      </Button>
    </Card>
  );
};

export default KYSRejectionLog;
