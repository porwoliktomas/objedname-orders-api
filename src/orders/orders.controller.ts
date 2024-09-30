import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrderDto } from './dto/get-order.dto';
import { ChangeOrderStatusDto } from './dto/change-order-status.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  createOrder(@Body() orderData: CreateOrderDto) {
    return this.ordersService.createOrder(orderData);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getOrderById(@Param() params: GetOrderDto) {
    return this.ordersService.getOrderById(params.id);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post(':id/status')
  changeOrderStatus(
    @Param() params: GetOrderDto,
    @Body() changeOrderStatusData: ChangeOrderStatusDto,
  ) {
    return this.ordersService.changeOrderStatus(
      params.id,
      changeOrderStatusData.status,
    );
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  deleteOrder(@Param() params: GetOrderDto) {
    return this.ordersService.deleteOrder(params.id);
  }
}
