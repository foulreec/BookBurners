-- SQL migration: add `avatar` column to `users` table
-- Run this in your MySQL console or phpMyAdmin for the BookBurners database.

ALTER TABLE `users`
  ADD COLUMN `avatar` VARCHAR(255) DEFAULT NULL AFTER `user_password`;

-- After running, existing users will have NULL avatar until they upload one.
