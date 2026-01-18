import {
  mysqlTable,
  varchar,
  decimal,
  boolean,
  int,
  timestamp,
  text,
} from 'drizzle-orm/mysql-core';

export const users = mysqlTable('User', {
  id: int('id').primaryKey().autoincrement(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
});

export const products = mysqlTable('Product', {
  id: int('id').primaryKey().autoincrement(),
  title: varchar('title', { length: 255 }).notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  description: text('description').notNull(),
  imageUrl: varchar('imageUrl', { length: 500 }).notNull(),
  userId: int('userId')
    .notNull()
    .references(() => users.id),
  isDeleted: boolean('isDeleted').notNull().default(false),
});

export const cartItems = mysqlTable('CartItem', {
  id: int('id').primaryKey().autoincrement(),
  productId: int('productId')
    .notNull()
    .references(() => products.id),
  userId: int('userId')
    .notNull()
    .references(() => users.id),
  quantity: int('quantity').notNull().default(1),
});

export const orders = mysqlTable('Order', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('userId')
    .notNull()
    .references(() => users.id),
  totalAmount: decimal('totalAmount', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
});

export const orderItems = mysqlTable('OrderItem', {
  id: int('id').primaryKey().autoincrement(),
  orderId: int('orderId')
    .notNull()
    .references(() => orders.id),
  productId: int('productId')
    .notNull()
    .references(() => products.id),
  quantity: int('quantity').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
});
