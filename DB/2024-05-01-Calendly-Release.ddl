DROP TABLE IF EXISTS `Appointment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Appointment` (
  `CalendlyID` bigint(20) NOT NULL AUTO_INCREMENT,
  `UserID` bigint(20) NOT NULL DEFAULT '0',
  `Email` varchar(255),
  `ApptPlatform` varchar(25) NOT NULL DEFAULT 'Calendly',
  `ApptType` varchar(25) NOT NULL DEFAULT 'PDI',
  `ApptDate` date NOT NULL DEFAULT '0000-00-00',
  `ApptStartTime` timestamp NOT NULL DEFAULT '0',
  `ApptEndTime` timestamp NOT NULL DEFAULT '0',
  `ApptStatus` varchar(25),
  `MeetingURL` varchar(1024),
  `RescheduleURL` varchar(1024),
  `UpdatedBy` varchar(25) NOT NULL DEFAULT '',
  `LastModifiedDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatedDate` date NOT NULL DEFAULT '0000-00-00',
  `OrgJSON` TEXT,  
  `Status` varchar(25) NOT NULL DEFAULT 'ACTIVE',
  PRIMARY KEY (`CalendlyID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `CalendlyLanding`;
CREATE TABLE `CalendlyLanding` (
  `OrgJSON` TEXT,  
  `CID` bigint(20) NOT NULL AUTO_INCREMENT,
  `UpdatedBy` varchar(25) NOT NULL DEFAULT '',
  `LastModifiedDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatedDate` date NOT NULL DEFAULT '0000-00-00',
  PRIMARY KEY (`CID`)  
)  ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
