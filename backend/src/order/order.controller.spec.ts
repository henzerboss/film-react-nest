import { Test } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

describe('OrderController', () => {
  it('createOrder returns service result', async () => {
    const orderServiceMock = {
      createOrder: jest.fn().mockResolvedValue({
        items: [{ film: 'f1', session: 's1', row: 1, seat: 2, daytime: 'x' }],
      }),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [{ provide: OrderService, useValue: orderServiceMock }],
    }).compile();

    const controller = moduleRef.get(OrderController);

    const dto = {
      email: 'a@b.com',
      phone: '+7000',
      tickets: [{ film: 'f1', session: 's1', row: 1, seat: 2, daytime: 'x' }],
    };

    const res = await controller.createOrder(dto as any);
    expect(orderServiceMock.createOrder).toHaveBeenCalled();
    expect(res.items).toHaveLength(1);
  });
});
