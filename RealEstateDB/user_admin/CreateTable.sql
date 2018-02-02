--
-- Table structure for table `LoginGroup`
--

DROP TABLE LoginGroup;

CREATE TABLE LoginGroup (
  LoginGroupID int(11) NOT NULL auto_increment,
  GroupName       varchar(50),
  GroupFullName   varchar(100),
  Description     varchar(100),
  GroupLevel      double,
  PRIMARY KEY  (LoginGroupID)
);

--
-- Data for table `LoginGroup`
--

insert into LoginGroup values ('1', 'superuser', 'super user', 'with all permissions',5);
insert into LoginGroup values ('2', 'management', 'management', 'with all permissions',4);
insert into LoginGroup values ('3', 'admin', 'admin', '', 3);
insert into LoginGroup values ('4', 'sales', 'sales', '', 2);
insert into LoginGroup values ('5', 'receptionist', 'receptionist', '', 1);

--
-- Table structure for table `LoginUser`
--

DROP TABLE LoginUser;

CREATE TABLE LoginUser (
  LoginUserID int(11) NOT NULL auto_increment,
  UserName    varchar(50),
  Passwd      varchar(50),
  Description varchar(100),
  ExpiryDate  Date default '9999-12-31',
  IsActive    varchar(1),
  GroupName   varchar(50),
  PRIMARY KEY  (LoginUserID)
);


--
-- Data for table `LoginUser`
--

insert into LoginUser values ('1', 'superuser', 'superuser', 'to overlook the system', '9999-12-31', 'Y', 'superuser');
insert into LoginUser values ('2', 'management', 'management', '', '9999-12-31', 'Y', 'management');
insert into LoginUser values ('3', 'admin', 'admin', '', '9999-12-31', 'Y', 'admin');
insert into LoginUser values ('4', 'sales', 'sales', '', '9999-12-31', 'Y', 'sales');
insert into LoginUser values ('5', 'receptionist', 'receptionist', '', '9999-12-31', 'Y', 'receptionist');

--
-- Table structure for table `LoginUser_Group_Relation`
--

DROP TABLE LoginUser_Group_Relation;

--CREATE TABLE LoginUser_Group_Relation (
--  LoginUserID      int(11) NOT NULL,
--  LoginGroupID     int(11) NOT NULL,
--  PRIMARY KEY  (LoginUserID, LoginGroupID)
--);

--
-- Data for table `LoginUser_Group_Relation`
--
--
--insert into LoginUser_Group_Relation values ('1', '1');
--insert into LoginUser_Group_Relation values ('2', '2');
--insert into LoginUser_Group_Relation values ('3', '3');
--insert into LoginUser_Group_Relation values ('4', '4');
--insert into LoginUser_Group_Relation values ('5', '5');

