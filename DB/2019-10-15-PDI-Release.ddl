

-- Add or update column name imageName, hasImage

alter table PDIDefect modify imageName varchar(250);


-- Add PDI file path 

alter table Unit add PDIReportFilePath varchar(255) ;
alter table Unit add PDIDay30ReportFilePath varchar(255);