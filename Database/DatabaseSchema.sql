CREATE TABLE `Event`(
    `UserID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE KEY,
    `Intensity` INT NOT NULL,
    `ActivityType` TEXT NOT NULL,
    `Length` TIME NOT NULL,
    `StartTime` TIME NOT NULL
);
CREATE TABLE `SharedCalendar`(
    `OwnerID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `SharedID` BIGINT NOT NULL
);
CREATE TABLE `Users`(
    `ID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `UserName` TEXT NOT NULL,
    `Password` TEXT NOT NULL
);
ALTER TABLE
    `SharedCalendar` ADD CONSTRAINT `sharedcalendar_ownerid_foreign` FOREIGN KEY(`OwnerID`) REFERENCES `Users`(`ID`);
ALTER TABLE
    `SharedCalendar` ADD CONSTRAINT `sharedcalendar_sharedid_foreign` FOREIGN KEY(`SharedID`) REFERENCES `Users`(`ID`);
ALTER TABLE
    `Event` ADD CONSTRAINT `event_userid_foreign` FOREIGN KEY(`UserID`) REFERENCES `Users`(`ID`);