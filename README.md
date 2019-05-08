# ServerTools
This is a NodeJS/Express/mySQL application which runs on our geth node server.

**It serves the following main purposes:**
- Pulls transactions logs for all equity and share dispenser contracts. These are then used for reporting and fed into the share registry.
- Provides reporting capabilities via email and API
- Records insider trades

**To run:**

Simply type `npm start` or use `foreverjs` to run continuously on server.
The geth node needs to be running and the IPC path must be configured correctly.

**Routes:**

tbd

**Application structure:**

tbd

**Stack/Packages used:**
- mysql/MariaDB and the `mysql` npm package
- `web3` for connection to Ethereum network (VERSION???)
- `nodemailer` for sending out notification mails
- `express` to handle HTTP requests
- `ejs` for rendering templates
- `node-schedule`for executing CRON jobs
