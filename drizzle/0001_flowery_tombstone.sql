CREATE TABLE `applications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jobPostingId` int,
	`firstName` varchar(128) NOT NULL,
	`lastName` varchar(128) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(64),
	`message` text,
	`resumeUrl` text,
	`resumeFileName` varchar(255),
	`status` enum('new','reviewing','interview','accepted','rejected') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `applications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `capacityInquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`institutionName` varchar(255) NOT NULL,
	`contactPerson` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(64),
	`careType` varchar(128),
	`region` varchar(255),
	`numberOfPatients` int,
	`desiredStartDate` varchar(64),
	`notes` text,
	`status` enum('new','responded','closed') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `capacityInquiries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contactSubmissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category` enum('patient','insurance','general') NOT NULL DEFAULT 'general',
	`firstName` varchar(128) NOT NULL,
	`lastName` varchar(128) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(64),
	`organization` varchar(255),
	`subject` varchar(255),
	`message` text NOT NULL,
	`status` enum('new','read','replied','closed') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contactSubmissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `jobPostings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`department` varchar(128),
	`location` varchar(255),
	`employmentType` enum('fulltime','parttime','minijob','internship') NOT NULL DEFAULT 'fulltime',
	`description` text NOT NULL,
	`requirements` text,
	`benefits` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `jobPostings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `partnerDocuments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`fileUrl` text NOT NULL,
	`fileKey` text NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileSize` int,
	`category` enum('quality','supply','contract','other') NOT NULL DEFAULT 'other',
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `partnerDocuments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `referralRequests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`referrerType` enum('doctor','clinic','hospital') NOT NULL,
	`institutionName` varchar(255) NOT NULL,
	`contactPerson` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(64),
	`patientName` varchar(255),
	`patientInsurance` varchar(255),
	`careLevel` varchar(64),
	`careNeeds` text,
	`urgency` enum('normal','urgent','emergency') NOT NULL DEFAULT 'normal',
	`notes` text,
	`status` enum('new','inProgress','completed','declined') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `referralRequests_id` PRIMARY KEY(`id`)
);
