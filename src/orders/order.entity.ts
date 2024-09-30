import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum OrderStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export const isOrderStatus = (status: string): status is OrderStatus =>
  Object.values(OrderStatus).includes(status as OrderStatus);

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customer: string;

  @Column()
  product: string;

  @Column({ default: OrderStatus.PENDING })
  status: string;

  @Column({ default: false })
  isDeleted: boolean;
}

export type OrderInput = Pick<Order, 'customer' | 'product'>;
