CREATE TABLE `appointments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firstName` varchar(128) NOT NULL,
	`lastName` varchar(128) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(64) NOT NULL,
	`appointmentType` enum('initial_consultation','home_visit','care_planning','follow_up') NOT NULL DEFAULT 'initial_consultation',
	`preferredDate` timestamp NOT NULL,
	`preferredTime` varchar(64),
	`careGrade` varchar(64),
	`careNeeds` text,
	`notes` text,
	`status` enum('pending','confirmed','completed','cancelled','rescheduled') NOT NULL DEFAULT 'pending',
	`confirmedDate` timestamp,
	`confirmedTime` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `appointments_id` PRIMARY KEY(`id`)
);
