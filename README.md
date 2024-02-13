
Technical guide
=============

## Deployment
### Server side
#### Setup database
##### Install
To setup the database to [this page](https://www.mongodb.com/docs/manual/installation/) and find the MongoDB installation guide for your platform. 

Alternatively you can use [MongoDB Cloud](https://www.mongodb.com/atlas/database) 

##### Setup auth
Follow this [guide](https://www.mongodb.com/docs/v2.4/tutorial/enable-authentication/) to setup authentication for the database.

##### Enable transactions
The application server code relies on database transaction for data integrity. If you are running your own database instance, you will need to setup a replica set, because by default the instance will be running in a standalone mode, and transactions only work on a replica set.

Follow [this guide](https://www.mongodb.com/docs/manual/tutorial/deploy-replica-set-for-testing/) to setup the replica set.

#### Adding environment variables
Create a file at `api/.env` and add the following variables


 * `IMAP_USERNAME`: IMAP username (for sending emails)
 * `IMAP_PASSWORD`: IMAP password
 * `PASSWORD_SALT_ROUNDS`: Number of password salt rounds
 * `NODE_ENV`: test | development | production
 * `JWT_SECRET`: Key for signing JWT tokens
 * `SYSTEM_URL`: http(s)//your-ip-address:PORT
 * `SENTRY_DSN`: [Sentry](https://sentry.io/) url for logging
 * `DB_URL`: MongoDB url
 * `DB_USER`: Mongodb username
 * `DB_PWD`: MongoDB password
 * `PORT`: port tp run at
 * `SUPER_USER_EMAIL`: email to be used as a username by the super user
 * `SUPER_USER_PASSWORD`: super user's password
 * `CASE_DURATION`: case duration (days) before the system marks the case as overdue

#### Run the application server
 1. Navigate to `api` subdirectory of the repository
 1. Run `npm install`
 1. Run `npm start`

You can use a process manager like [pm2](https://www.npmjs.com/package/pm2) to setup autostart on reboot


### Desktop app
#### Setting environment variables
Create a file at `ui/.env` and set the variable `REACT_APP_BACKEND` to the `http(s)://your-server-ip:port`

#### Creating the installer
Run the following commands inside the `ui` subdirectory. Make sure you are on a Windows machine if you want to build for windows. (For other platforms you can check the scripts listed in the file `ui/electron/package.json` and run the appropiriate one for your *target platform*).

```bash
# compile react to HTML/CSS/JS
npm install -f
npm run build

# build electron app and installer
cd electron
npm install -f
npm run package-zgc


```

#### Installing
Check the directory `ui/electron/dist/zgc-case-management-*` for the installer. Double click it to start the installation

## Mantaining the system
Here is an overview of the system for developers who would like to continue developing the system.

### Tech stack
* **Server side**: NodeJS with Express, Mongoose
* **Database**: MongoDB
* **Front-end**: React, Electron

### Design
The `design` directory in the source code contains the design

* *Design.drawio* – This file contains the Use Case diagram for the system
* *UIX.drawio* – This file contains the wireframs for the system
* *API.md* – This file is the draft for the REST API provided by the application server to the desktop app
* *ERD.md* – This file contains the Entity relationship diagrams. It's more of a guide, since the system was build on top of a NoSQL database

### Backend
The `api` directory contains all the application server business logic. Built with NodeJS

### Frontend
The `ui` directory contains all the frontend ReactJS source. Its subdirectory, `electron`, contains the ElectronJS logic


