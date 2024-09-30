import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { isOrderStatus, OrderInput } from './order.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  createOrder(@Body() orderData: OrderInput) {
    return this.ordersService.createOrder(orderData);
  }

  @Get(':id')
  getOrderById(@Param('id') orderId: number) {
    return this.ordersService.getOrderById(orderId);
  }

  @Post(':id/status')
  changeOrderStatus(
    @Param('id') orderId: number,
    @Body('status') newStatus: string,
  ) {
    if (!isOrderStatus(newStatus)) {
      throw new HttpException('Invalid status', HttpStatus.BAD_REQUEST);
    }

    return this.ordersService.changeOrderStatus(orderId, newStatus);
  }

  @Delete(':id')
  deleteOrder(@Param('id') orderId: number) {
    return this.ordersService.deleteOrder(orderId);
  }
}
