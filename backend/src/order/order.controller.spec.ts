import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { OrderController } from './order.controller';
import { CreateOrderDto, OrderedTicketDto } from './dto/order.dto';
import { OrderService } from './order.service';

describe('OrderController', () => {
  let controller: OrderController;
  const orderServiceMock: jest.Mocked<Pick<OrderService, 'createOrder'>> = {
    createOrder: jest.fn(),
  };

  const payload: CreateOrderDto = {
    email: 'user@example.com',
    phone: '+79991234567',
    tickets: [{ film: 'film-1', session: 'session-1', row: 1, seat: 1 }],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [{ provide: OrderService, useValue: orderServiceMock }],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delegate order creation to OrderService with the given payload', async () => {
    const expected: { total: number; items: OrderedTicketDto[] } = {
      total: 1,
      items: [
        {
          id: 'ticket-1',
          film: 'film-1',
          session: 'session-1',
          daytime: '2026-09-06T18:00:00.000Z',
          row: 1,
          seat: 1,
          price: 350,
        },
      ],
    };
    orderServiceMock.createOrder.mockResolvedValue(expected);

    const result = await controller.createOrder(payload);

    expect(orderServiceMock.createOrder).toHaveBeenCalledWith(payload);
    expect(result).toBe(expected);
  });

  it('should propagate errors thrown by OrderService without catching them', async () => {
    orderServiceMock.createOrder.mockRejectedValue(
      new BadRequestException('Одно или несколько выбранных мест уже заняты'),
    );

    await expect(controller.createOrder(payload)).rejects.toThrow(
      BadRequestException,
    );
  });
});