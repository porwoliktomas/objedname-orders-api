import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { OrderInput, OrderStatus } from '../src/orders/order.entity';
import * as jwt from 'jsonwebtoken';

describe('OrdersController (e2e)', () => {
  let app: INestApplication;
  let token: string;

  const login = async (app: INestApplication) => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'test', password: 'test' })
      .expect(200);

    const decodedToken = jwt.decode(response.body.access_token);
    expect(decodedToken).toHaveProperty('custom', 'something');

    return response.body.access_token;
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    token = await login(app);
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /orders - should create a new order', async () => {
    const orderData: OrderInput = {
      customer: 'John Doe',
      product: 'Test',
    };

    const response = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send(orderData)
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        customer: orderData.customer,
        product: orderData.product,
        status: OrderStatus.PENDING,
      }),
    );
  });

  it('GET /orders/:id - should return an order by id', async () => {
    const orderData: OrderInput = {
      customer: 'John Doe',
      product: 'Test',
    };

    const { body: createdOrder } = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send(orderData)
      .expect(201);

    const { body: fetchedOrder } = await request(app.getHttpServer())
      .get(`/orders/${createdOrder.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(fetchedOrder).toEqual(
      expect.objectContaining({
        id: createdOrder.id,
        customer: createdOrder.customer,
        product: createdOrder.product,
      }),
    );
  });

  it('POST /orders/:id/status - should change the order status', async () => {
    const orderData: OrderInput = {
      customer: 'John Doe',
      product: 'Laptop',
    };

    const { body: createdOrder } = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send(orderData)
      .expect(201);

    const newStatus = OrderStatus.COMPLETED;

    const { body: updatedOrder } = await request(app.getHttpServer())
      .post(`/orders/${createdOrder.id}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: newStatus })
      .expect(200);

    expect(updatedOrder.status).toEqual(newStatus);
  });

  it('DELETE /orders/:id - should soft delete the order', async () => {
    const orderData: OrderInput = {
      customer: 'John Doe',
      product: 'Laptop',
    };

    const { body: createdOrder } = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send(orderData)
      .expect(201);

    await request(app.getHttpServer())
      .delete(`/orders/${createdOrder.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/orders/${createdOrder.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });
});
