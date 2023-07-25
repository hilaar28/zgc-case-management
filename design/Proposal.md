
# Project Proposal: Case Management System for a Gender-Based Issues Call Centre

## 1. Introduction
The purpose of this project is to develop a case management system for a call centre that receives calls on gender-based issues. The system will enable the efficient management of cases by providing a platform for capturing caller information, case details, and case officer updates. The system will also provide reports on case status, case distribution across provinces, and user management.

## 2. System Requirements
The proposed system will have the following features:

### 2.1 Case management Functionality
- Allow customer service agent to capture caller information and their issue
- Allow admin to assign cases to case officers, or case officer will pick their own cases.
- Allow case officers to add information on what they did to the case
- Allow case officers to mark cases they are assigned to as resolved
- Case life cycle: `unassigned`, `in progress`, `resolved`

### 2.2 Reporting Functionality
- Show reports on how many cases are opened, closed, and currently unassigned
- Show case distributions across provinces

### 2.3 User Management Functionality
- Allow super admin to add users
- Three privilege levels: `super admin`, `admin`, `case officer`, and `customer service agent`
- Customer service agent can only open cases
- Case officer can pick cases, add information on what they did to the case and mark case as resolved.
- Admin can view system reports, see case lists.
- Super admin can manage users.

### 2.4 Offline Functionality
- System will be able to work offline
- Data will be captured and synced later with the backend

## 3. Technology Stack
The proposed system will be developed using the following technology stack:

- Backend: *NodeJS*
- Frontend: *ReactJS, ElectronJS*
- Database: *MySQL*

## 4. Project Timeline
The proposed project will be completed in three phases:

### 4.1 Phase 1: Requirements Gathering
- Define system requirements
- Agree on expected features

### 4.2 Phase 2: Development
- Develop the system using the defined technology stack
- Test the system for functionality, performance, and security

### 4.3 Phase 3: Deployment
- Deploy the system to the cloud
- Install desktop application on user machines.
- Provide user training and support

## 5. Conclusion
The proposed case management system will provide the call centre with an efficient platform for managing gender-based issues. The system will enable case officers to update case information and track case progress, while providing reports and data visualization to help managers make informed decisions. The system will also be able to work offline, ensuring that data is captured even in areas with poor or no internet connectivity.