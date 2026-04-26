CREATE TABLE `newsletterSubscribers` (
	`id` varchar(36) NOT NULL DEFAULT UUID(),
	`email` varchar(320) NOT NULL,
	`firstName` varchar(128),
	`isSubscribed` boolean NOT NULL DEFAULT true,
	`isVerified` boolean NOT NULL DEFAULT false,
	`verificationToken` varchar(255),
	`verificationTokenExpiresAt` timestamp,
	`unsubscribeToken` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `newsletterSubscribers_id` PRIMARY KEY(`id`),
	CONSTRAINT `newsletterSubscribers_email_unique` UNIQUE(`email`),
	CONSTRAINT `newsletterSubscribers_unsubscribeToken_unique` UNIQUE(`unsubscribeToken`)
);
