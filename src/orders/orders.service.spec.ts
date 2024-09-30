import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order, OrderStatus } from './order.entity';
import { HttpException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';

const mockRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOneBy: jest.fn(),
});

describe('OrdersService', () => {
  let service: OrdersService;
  let repository: Repository<Order>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    repository = module.get<Repository<Order>>(getRepositoryToken(Order));
  });

  describe('createOrder', () => {
    it('should create and save a new order', async () => {
      const orderInput: CreateOrderDto = {
        customer: 'John Doe',
        product: 'Test',
      };
      const savedOrder: Order = {
        ...orderInput,
        id: 1,
        status: OrderStatus.PENDING,
        isDeleted: false,
      };

      (repository.create as jest.Mock).mockReturnValue(savedOrder);
      (repository.save as jest.Mock).mockResolvedValue(savedOrder);

      const result = await service.createOrder(orderInput);

      expect(repository.create).toHaveBeenCalledWith(orderInput);
      expect(repository.save).toHaveBeenCalledWith(savedOrder);
      expect(result).toEqual(savedOrder);
    });
  });

  describe('getOrderById', () => {
    it('should return an order if it exists', async () => {
      const order: Order = {
        id: 1,
        customer: 'John Doe',
        product: 'Test',
        isDeleted: false,
        status: OrderStatus.PENDING,
      };

      (repository.findOneBy as jest.Mock).mockResolvedValue(order);

      const result = await service.getOrderById(1);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(order);
    });

    it('should throw an error if order is not found', async () => {
      (repository.findOneBy as jest.Mock).mockResolvedValue(null);

      await expect(service.getOrderById(1)).rejects.toThrow(HttpException);
    });

    it('should throw an error if order is deleted', async () => {
      const order: Order = {
        id: 1,
        customer: 'John Doe',
        product: 'Test',
        status: OrderStatus.PENDING,
        isDeleted: true,
      };

      (repository.findOneBy as jest.Mock).mockResolvedValue(order);

      await expect(service.getOrderById(1)).rejects.toThrow(HttpException);
    });
  });

  describe('changeOrderStatus', () => {
    it('should change the status of an order', async () => {
      const order: Order = {
        id: 1,
        customer: 'John Doe',
        product: 'Test',
        status: OrderStatus.PENDING,
        isDeleted: false,
      };
      const newStatus = OrderStatus.COMPLETED;

      service.getOrderById = jest.fn().mockResolvedValue(order);

      await service.changeOrderStatus(1, newStatus);

      expect(service.getOrderById).toHaveBeenCalledWith(1);
      expect(order.status).toEqual(newStatus);
      expect(repository.save).toHaveBeenCalledWith(order);
    });
  });

  describe('deleteOrder', () => {
    it('should soft delete an order', async () => {
      const order: Order = {
        id: 1,
        customer: 'John Doe',
        product: 'Test',
        status: OrderStatus.PENDING,
        isDeleted: false,
      };

      service.getOrderById = jest.fn().mockResolvedValue(order);

      await service.deleteOrder(1);

      expect(service.getOrderById).toHaveBeenCalledWith(1);
      expect(order.isDeleted).toBe(true);
      expect(repository.save).toHaveBeenCalledWith(order);
    });
  });
});
