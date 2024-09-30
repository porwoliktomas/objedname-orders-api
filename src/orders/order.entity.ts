import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum OrderStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

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
