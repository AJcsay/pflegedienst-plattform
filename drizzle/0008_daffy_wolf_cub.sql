CREATE TABLE `appointmentFeedback` (
	`id` varchar(36) NOT NULL DEFAULT UUID(),
	`appointmentId` int NOT NULL,
	`surveyToken` varchar(255) NOT NULL,
	`rating` int,
	`comments` text,
	`careQuality` int,
	`professionalism` int,
	`communication` int,
	`wouldRecommend` boolean,
	`improvementSuggestions` text,
	`submittedAt` timestamp,
	`emailSentAt` timestamp,
	`status` enum('pending','sent','viewed','submitted') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `appointmentFeedback_id` PRIMARY KEY(`id`),
	CONSTRAINT `appointmentFeedback_surveyToken_unique` UNIQUE(`surveyToken`)
);
--> statement-breakpoint
CREATE TABLE `appointmentReminders` (
	`id` varchar(36) NOT NULL DEFAULT UUID(),
	`appointmentId` int NOT NULL,
	`reminderType` enum('24h_before','1h_before','day_after') NOT NULL,
	`scheduledAt` timestamp NOT NULL,
	`sentAt` timestamp,
	`status` enum('pending','sent','failed','cancelled') NOT NULL DEFAULT 'pending',
	`failureReason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `appointmentReminders_id` PRIMARY KEY(`id`)
);
