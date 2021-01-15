CREATE TABLE IF NOT EXISTS project(
  uuid varchar(36) not null primary key,
  name varchar(255),
  repo varchar(255),
  branch_regex varchar(255),
  command varchar(255)
);