-- Update course titles to match real MangoApps course names
-- Run in Supabase SQL Editor

UPDATE courses SET title = '1. TCL General Onboarding', description = 'General onboarding for all Travel Collection staff.' WHERE code = 'TCL1';
UPDATE courses SET title = '2. Travel Advisors and Operations', description = 'Understanding travel advisor and operations roles at TC.' WHERE code = 'TCL2';
UPDATE courses SET title = '1. Introduction to Salesforce', description = 'Basic Salesforce navigation and core concepts.' WHERE code = 'SFAC01';
UPDATE courses SET title = '2. Setting Up Salesforce', description = 'Configuring your Salesforce environment and managing data.' WHERE code = 'SFAC02';
UPDATE courses SET title = '3. Core Salesforce - Advisor Cloud', description = 'Salesforce features for client-facing travel advisors.' WHERE code = 'SFAC03';
UPDATE courses SET title = '4. Practicising Using Salesforce for Travel Advisors', description = 'Hands-on Salesforce exercises for travel advisors.' WHERE code = 'SFAC04';
UPDATE courses SET title = '5. Core Salesforce - Operations Cloud', description = 'Salesforce features for operations and back-office staff.' WHERE code = 'SFAC05';
UPDATE courses SET title = '6. Practicising Using Salesforce for Operations Specialists', description = 'Hands-on Salesforce exercises for operations specialists.' WHERE code = 'SFAC06';
UPDATE courses SET title = 'Building Success in B2C Online Channels', description = 'Strategies for building success in B2C online channels.' WHERE code = 'TraAdv2';
UPDATE courses SET title = 'Sales Boosters: Core Training for Travel Advisors', description = 'Core sales training techniques for travel advisors.' WHERE code = 'TraAdv3';
UPDATE courses SET title = 'Multi-Country Trips Knowledge Assessment', description = 'Assessment on multi-country trip planning best practices.' WHERE code = 'BPG02';
