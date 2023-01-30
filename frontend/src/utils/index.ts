import { isEmpty } from 'lodash';
import { IContactNumber, IName } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const normalizeName = (name: IName | undefined | null) => {
  if (!name) return '';

  const formattedName = [name?.firstName, name?.middleName, name?.lastName]
    .filter(i => !isEmpty(i))
    .join(' ');

  return formattedName.length > 0 ? formattedName : undefined;
};

export const normalizeContact = (contact: IContactNumber | undefined | null) => {
  if (!contact) return '';

  const formattedContact = [contact?.countryCode, contact?.number]
    .filter(i => !isEmpty(i))
    .join(' ');

  return formattedContact.length > 0 ? formattedContact : undefined;
};

export const downloadImage = (blob: string, fileName: string) => {
  const fakeLink = window.document.createElement('a');
  fakeLink.setAttribute('style', 'display:none;');
  fakeLink.download = fileName;
  fakeLink.setAttribute('href', blob);

  document.body.appendChild(fakeLink);
  fakeLink.click();
  document.body.removeChild(fakeLink);

  fakeLink.remove();
};
