CREATE TABLE `reviews` (
	`id` varchar(36) NOT NULL DEFAULT UUID(),
	`patientName` varchar(128) NOT NULL,
	`patientEmail` varchar(320) NOT NULL,
	`rating` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`serviceType` varchar(128),
	`isApproved` boolean NOT NULL DEFAULT false,
	`isPublished` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
