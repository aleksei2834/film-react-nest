import 'reflect-metadata';

import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { CreateOrderDto } from './order.dto';

describe('CreateOrderDto', () => {
  const ticket = {
    film: 'film-1',
    session: 'session-1',
    row: 2,
    seat: 3,
  };

  it('accepts a valid order', async () => {
    const order = plainToInstance(CreateOrderDto, {
      email: 'user@example.com',
      phone: '+79999999999',
      tickets: [ticket],
    });

    await expect(validate(order)).resolves.toHaveLength(0);
  });

  it('accepts a formatted Russian phone number', async () => {
    const order = plainToInstance(CreateOrderDto, {
      email: 'user@example.com',
      phone: '+7 (999) 999-99-99',
      tickets: [ticket],
    });

    await expect(validate(order)).resolves.toHaveLength(0);
  });

  it('rejects invalid contacts and an empty ticket list', async () => {
    const order = plainToInstance(CreateOrderDto, {
      email: 'invalid-email',
      phone: '89999999999',
      tickets: [],
    });

    const errors = await validate(order);

    expect(errors.map((error) => error.property)).toEqual(
      expect.arrayContaining(['email', 'phone', 'tickets']),
    );
  });
});
