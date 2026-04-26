CREATE TABLE `campaignAutomations` (
	`id` varchar(36) NOT NULL DEFAULT UUID(),
	`name` varchar(255) NOT NULL,
	`description` text,
	`triggerEvent` varchar(128) NOT NULL,
	`campaignId` varchar(36) NOT NULL,
	`delayMinutes` int DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdBy` int,
	CONSTRAINT `campaignAutomations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `campaignRecipients` (
	`id` varchar(36) NOT NULL DEFAULT UUID(),
	`campaignId` varchar(36) NOT NULL,
	`subscriberId` varchar(36) NOT NULL,
	`email` varchar(320) NOT NULL,
	`status` enum('pending','sent','opened','clicked','bounced','unsubscribed') NOT NULL DEFAULT 'pending',
	`sentAt` timestamp,
	`openedAt` timestamp,
	`clickedAt` timestamp,
	`unsubscribedAt` timestamp,
	`bounceReason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `campaignRecipients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `emailCampaigns` (
	`id` varchar(36) NOT NULL DEFAULT UUID(),
	`name` varchar(255) NOT NULL,
	`subject` varchar(255) NOT NULL,
	`preheader` varchar(255),
	`htmlContent` text NOT NULL,
	`textContent` text,
	`campaignType` enum('welcome','reminder','promotion','educational','feedback','custom') NOT NULL DEFAULT 'custom',
	`triggerType` enum('manual','scheduled','event_based') NOT NULL DEFAULT 'manual',
	`triggerEvent` varchar(128),
	`scheduledAt` timestamp,
	`status` enum('draft','scheduled','sending','sent','paused','cancelled') NOT NULL DEFAULT 'draft',
	`recipientCount` int DEFAULT 0,
	`sentCount` int DEFAULT 0,
	`openCount` int DEFAULT 0,
	`clickCount` int DEFAULT 0,
	`unsubscribeCount` int DEFAULT 0,
	`bounceCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdBy` int,
	CONSTRAINT `emailCampaigns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `emailTemplates` (
	`id` varchar(36) NOT NULL DEFAULT UUID(),
	`name` varchar(255) NOT NULL,
	`description` text,
	`templateType` enum('welcome','reminder','promotion','educational','feedback','custom') NOT NULL DEFAULT 'custom',
	`htmlContent` text NOT NULL,
	`textContent` text,
	`variables` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdBy` int,
	CONSTRAINT `emailTemplates_id` PRIMARY KEY(`id`)
);
