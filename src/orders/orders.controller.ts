import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { isOrderStatus, OrderInput } from './order.entity';
import { AuthGuard } from '../auth/auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  createOrder(@Body() orderData: OrderInput) {
    return this.ordersService.createOrder(orderData);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getOrderById(@Param('id') orderId: number) {
    return this.ordersService.getOrderById(orderId);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
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

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  deleteOrder(@Param('id') orderId: number) {
    return this.ordersService.deleteOrder(orderId);
  }
}
