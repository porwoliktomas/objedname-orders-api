import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private ordersRepository: Repository<Order>,
  ) {}

  createOrder = async (orderData: CreateOrderDto): Promise<Order> => {
    const order = this.ordersRepository.create(orderData);
    return this.ordersRepository.save(order);
  };

  getOrderById = async (orderId: number): Promise<Order> => {
    const order = await this.ordersRepository.findOneBy({ id: orderId });

    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    if (order.isDeleted) {
      throw new HttpException('Order is deleted', HttpStatus.NOT_FOUND);
    }

    return order;
  };

  changeOrderStatus = async (
    orderId: number,
    newStatus: OrderStatus,
  ): Promise<Order> => {
    const order = await this.getOrderById(orderId);
    order.status = newStatus;
    return this.ordersRepository.save(order);
  };

  deleteOrder = async (orderId: number): Promise<void> => {
    const order = await this.getOrderById(orderId);
    order.isDeleted = true;
    await this.ordersRepository.save(order);
  };
}
