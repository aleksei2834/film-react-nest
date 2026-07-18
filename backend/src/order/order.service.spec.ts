import { BadRequestException } from '@nestjs/common';

import { FilmsRepository } from '../repository/films.repository';
import { OrderService } from './order.service';

describe('OrderService', () => {
  const repository = {
    findSession: jest.fn(),
    reserveSeats: jest.fn(),
  };
  const service = new OrderService(repository as unknown as FilmsRepository);
  const schedule = {
    id: 'session-1',
    daytime: '2024-06-28T10:00:53+03:00',
    hall: 0,
    rows: 5,
    seats: 10,
    price: 350,
    taken: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    repository.findSession.mockResolvedValue(schedule);
    repository.reserveSeats.mockResolvedValue(true);
  });

  it('books a place and returns canonical session data', async () => {
    const result = await service.createOrder({
      email: 'user@example.com',
      phone: '+79999999999',
      tickets: [
        {
          film: 'film-1',
          session: 'session-1',
          row: 2,
          seat: 3,
          daytime: 'incorrect client value',
          price: 1,
        },
      ],
    });

    expect(repository.reserveSeats).toHaveBeenCalledWith(
      'film-1',
      'session-1',
      ['2:3'],
    );
    expect(result.total).toBe(1);
    expect(result.items[0]).toMatchObject({
      film: 'film-1',
      session: 'session-1',
      daytime: schedule.daytime,
      row: 2,
      seat: 3,
      price: schedule.price,
    });
    expect(result.items[0].id).toEqual(expect.any(String));
  });

  it('rejects an occupied place', async () => {
    repository.findSession.mockResolvedValue({
      ...schedule,
      taken: ['2:3'],
    });

    await expect(
      service.createOrder({
        email: 'user@example.com',
        phone: '+79999999999',
        tickets: [
          {
            film: 'film-1',
            session: 'session-1',
            row: 2,
            seat: 3,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(repository.reserveSeats).not.toHaveBeenCalled();
  });

  it('rejects a place outside the hall', async () => {
    await expect(
      service.createOrder({
        email: 'user@example.com',
        phone: '+79999999999',
        tickets: [
          {
            film: 'film-1',
            session: 'session-1',
            row: 6,
            seat: 1,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
