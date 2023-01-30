import * as yup from 'yup';

yup.addMethod(yup.string, 'stripEmptyString', function () {
  return this.transform(value => (value === '' ? undefined : value));
});

export default yup;
