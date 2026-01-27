import { isValidZIP, isValidPIN, validateInputs } from './App';

test('ZIP must be exactly 5 digits', () => {
  expect(isValidZIP('12345')).toBe(true);
  expect(isValidZIP('1234')).toBe(false);
  expect(isValidZIP('12a45')).toBe(false);
});

test('PIN must be exactly 6 digits', () => {
  expect(isValidPIN('560001')).toBe(true);
  expect(isValidPIN('5600')).toBe(false);
  expect(isValidPIN('56A001')).toBe(false);
});

test('validateInputs returns no errors when all fields are valid', () => {
  const { valid, errors } = validateInputs({
    shippingType: 'document',
    sourceCountry: 'USA',
    zipCode: '12345',
    destinationCountry: 'india',
    pinCode: '560001',
    chooseCourier: 'fedex',
  });
  expect(valid).toBe(true);
  expect(errors).toEqual({});
});

test('validateInputs flags missing/invalid fields', () => {
  const { valid, errors } = validateInputs({
    shippingType: 'select',
    sourceCountry: 'select',
    zipCode: '1234',
    destinationCountry: 'select',
    pinCode: '5600',
    chooseCourier: 'select',
  });
  expect(valid).toBe(false);
  expect(errors.form).toBe('Please fill all fields correctly');
  expect(errors.shippingType).toBeDefined();
  expect(errors.sourceCountry).toBeDefined();
  expect(errors.zipCode).toBeDefined();
  expect(errors.destinationCountry).toBeDefined();
  expect(errors.pinCode).toBeDefined();
  expect(errors.chooseCourier).toBeDefined();
});
