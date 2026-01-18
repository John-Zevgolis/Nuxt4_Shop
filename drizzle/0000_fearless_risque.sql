CREATE TABLE `CartItem` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`userId` int NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	CONSTRAINT `CartItem_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `OrderItem` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`productId` int NOT NULL,
	`quantity` int NOT NULL,
	`price` decimal(10,2) NOT NULL,
	CONSTRAINT `OrderItem_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Order` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`totalAmount` decimal(10,2) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `Order_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Product` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`price` decimal(10,2) NOT NULL,
	`description` text NOT NULL,
	`imageUrl` varchar(500) NOT NULL,
	`userId` int NOT NULL,
	`isDeleted` boolean NOT NULL DEFAULT false,
	CONSTRAINT `Product_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `User` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	CONSTRAINT `User_id` PRIMARY KEY(`id`),
	CONSTRAINT `User_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_productId_Product_id_fk` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_userId_User_id_fk` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_orderId_Order_id_fk` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_productId_Product_id_fk` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Order` ADD CONSTRAINT `Order_userId_User_id_fk` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Product` ADD CONSTRAINT `Product_userId_User_id_fk` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE no action ON UPDATE no action;