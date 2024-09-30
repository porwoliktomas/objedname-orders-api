import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order, OrderStatus } from './order.entity';
import { AuthModule } from '../auth/auth.module';
import { CreateOrderDto } from './dto/create-order.dto';

const mockOrdersService = () => ({
  createOrder: jest.fn(),
  getOrderById: jest.fn(),
  changeOrderStatus: jest.fn(),
  deleteOrder: jest.fn(),
});

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService(),
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  describe('createOrder', () => {
    it('should create an order', async () => {
      const orderInput: CreateOrderDto = {
        customer: 'John Doe',
        product: 'Test',
      };
      const createdOrder: Order = {
        ...orderInput,
        id: 1,
        status: OrderStatus.PENDING,
        isDeleted: false,
      };

      (service.createOrder as jest.Mock).mockResolvedValue(createdOrder);

      const result = await controller.createOrder(orderInput);

      expect(service.createOrder).toHaveBeenCalledWith(orderInput);
      expect(result).toEqual(createdOrder);
    });
  });

  describe('getOrderById', () => {
    it('should return an order by id', async () => {
      const order: Order = {
        id: 1,
        customer: 'John Doe',
        product: 'Test',
        status: OrderStatus.PENDING,
        isDeleted: false,
      };

      (service.getOrderById as jest.Mock).mockResolvedValue(order);

      const result = await controller.getOrderById({ id: 1 });

      expect(service.getOrderById).toHaveBeenCalledWith(1);
      expect(result).toEqual(order);
    });
  });

  describe('changeOrderStatus', () => {
    it('should change the status of an order', async () => {
      const order = {
        id: 1,
        customer: 'John Doe',
        product: 'Test',
        status: OrderStatus.PENDING,
        isDeleted: false,
      };
      const newStatus = OrderStatus.COMPLETED;

      (service.changeOrderStatus as jest.Mock).mockResolvedValue({
        ...order,
        status: newStatus,
      });

      const result = await controller.changeOrderStatus(
        { id: 1 },
        { status: newStatus },
      );

      expect(service.changeOrderStatus).toHaveBeenCalledWith(1, newStatus);
      expect(result.status).toEqual(newStatus);
    });
  });

  describe('deleteOrder', () => {
    it('should delete an order', async () => {
      (service.deleteOrder as jest.Mock).mockResolvedValue(undefined);

      const result = await controller.deleteOrder({ id: 1 });

      expect(service.deleteOrder).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });
  });
});
