CREATE TABLE `email_verification_tokens` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `email_verification_tokens_token_unique` ON `email_verification_tokens` (`token`);--> statement-breakpoint
ALTER TABLE `users` ADD `headline` text;--> statement-breakpoint
ALTER TABLE `users` ADD `location` text;--> statement-breakpoint
ALTER TABLE `users` ADD `portfolio_url` text;--> statement-breakpoint
ALTER TABLE `users` ADD `email_verified` integer;