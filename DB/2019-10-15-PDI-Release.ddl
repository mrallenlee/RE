

-- Add or update column name imageName, hasImage

alter table PDIDefect modify imageName varchar(250);


-- Add PDI file path 

alter table Unit add PDIReportFilePath varchar(255) ;
alter table Unit add PDIDay30ReportFilePath varchar(255);



--
-- Table structure for table `PDIType`
--

DROP TABLE IF EXISTS `PDIType`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PDIType` (
  `PDITypeID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `PDICatID` int(10) unsigned NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`PDITypeID`)
) ENGINE=InnoDB AUTO_INCREMENT=482 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;


DROP TABLE IF EXISTS `PDICategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PDICategory` (
  `PDICatID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `Description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`PDICatID`)
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PDICategory`
--

LOCK TABLES `PDICategory` WRITE;
/*!40000 ALTER TABLE `PDICategory` DISABLE KEYS */;
INSERT INTO `PDICategory` VALUES (1,'Appliance - Dish Washer','Appliance - Dish Washer'),(2,'Appliance - Dryer','Appliance - Dryer'),(3,'Appliance - Fridge','Appliance - Fridge'),(4,'Appliance - Range Hood','Appliance - Range Hood'),(5,'Appliance - Stove','Appliance - Stove'),(6,'Appliance - Washer','Appliance - Washer'),(7,'BackSplash','BackSplash'),(8,'Bath Tub','Bath Tub'),(9,'Cabinet','Cabinet'),(10,'Carpet','Carpet'),(11,'Ceiling','Ceiling'),(12,'Countertop','Countertop'),(13,'Door','Door'),(14,'Electrical','Electrical'),(16,'Faucet','Faucet'),(17,'Hardwood','Hardwood'),(18,'Lighting','Lighting'),(19
,'Mirror','Mirror'),(20,'Security System','Security System'),(21,'Shower','Shower'),(22,'Shower Head','Shower Head'),(23,'Sink','Sink'),(24,'Tile','Tile'),(25,'Toilet','Toilet'),(26,'Vent','Vent'),(27,'Wall','Wall'),(28,'Wall Tile','Wall Tile'),(29,'Window','Window'),(30,'Laminate',''),(31,'Sliding Door','Sliding Door'),(32,'Closet','Closet'),(34,'Appliance - All',''),(35,'Accessories',''),(36,'Thermostat',''),(37,'Threshold',''),(47,'Heating Grill Cover',''),(48,'Access panel',''),(49,'Baseboard',''),(51,'Cable box',''),(52,'Sprinkler',''),(53,'Cable cover',''),(54,'Reducer',''),(55,'Patio',''),(56,'Island',''),(57,'Casing',''),(58,'Kickplate',''),(60,'Filler plate',''),(62,'Plug',''),(63,'Pedestal',''),(64,'Fire alarm plate',''),(65,'Handles',''),(66,'Fan',''),(67,'Spray tab',''),(68,'Stopper',''),(69,'Water',''),(70,'Filler',''),(71,'Bumper',''),(72,'Baseboard joints',''),(73,'Trim',''),(74,'Alarm',''),(75,'Washer/dryer',''),(76,'Heating',''),(78,'Quarter round',''),(79,'Bulkhead',''),(82,'Drain',''),(83,'Electrical outlet',''),(84,'Microwave',''),(85,'Plumbing fixtures',''),(87,'Electrical panel',''),(88,'Plug for microwave',''),(89,'Blank cover plate',''),(90,'Internet plate',''),(91,'Towel rack',''),(92,'Blinds',''),(93,'Pantry in den',''),(94,'Pantry in laundry room',''),(95,'Recepticle plates',''),(97,'Cable plug',''),(98,'Heating grill',''),(101,'Bathroom vanity',''),(102,'Phone plate',''),(103,'Tub & baseboard',''),(104,'Step',''); /*!40000 ALTER TABLE `PDICategory` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `PDIDefect`;
CREATE TABLE `PDIDefect` (
  `PDIDefectID` int(11) NOT NULL AUTO_INCREMENT,
  `UnitNumber` varchar(30) NOT NULL DEFAULT '0',
  `DefectDesc` varchar(255) DEFAULT NULL,
  `SectionID` int(11) DEFAULT NULL,
  `ContractorID` varchar(50) DEFAULT NULL,
  `QAFixed` smallint(6) DEFAULT NULL,
  `QAFixedDate` date DEFAULT NULL,
  `QADefect` smallint(6) DEFAULT NULL,
  `QAReportDate` date DEFAULT NULL,
  `PDIDefect` smallint(6) DEFAULT NULL,
  `PDIReportDate` date DEFAULT NULL,
  `PDIFixed` smallint(6) DEFAULT NULL,
  `PDIFixedDate` date DEFAULT NULL,
  `day30Defect` smallint(6) DEFAULT NULL,
  `day30ReportDate` date DEFAULT NULL,
  `day30Fixed` smallint(6) DEFAULT NULL,
  `day30FixedDate` date DEFAULT NULL,
  `PDISignoff` smallint(6) DEFAULT NULL,
  `day30Signoff` smallint(6) DEFAULT NULL,
  `month11Defect` smallint(6) DEFAULT NULL,
  `month11ReportDate` date DEFAULT NULL,
  `month11Fixed` smallint(6) DEFAULT NULL,
  `month11FixedDate` date DEFAULT NULL,
  `month11Signoff` smallint(6) DEFAULT NULL,
  `PDICatID` int(11) DEFAULT NULL,
  `PDITypeID` int(11) DEFAULT NULL,
  `TradeContacted` smallint(6) DEFAULT NULL,
  `QASignoff` smallint(6) DEFAULT NULL,
  `hasImage` tinyint(1) DEFAULT '0',
  `imageName` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`PDIDefectID`),
  KEY `idx_PDIDefect_UnitNumber` (`UnitNumber`)
) ENGINE=MyISAM AUTO_INCREMENT=31 DEFAULT CHARSET=latin1;