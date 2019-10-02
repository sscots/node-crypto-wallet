Node must by installed

> `git clone [repository]`

> `npm run setup`

Modify `sequelize/config/config.json` with correct db parameters. 
You DO NOT need to create the database, as the command below will do so. Just the `username`, `password`, and `host` need to be correct and the command will create the `database`

> `npm run db:create`

Dev:

> Is set up to run on localhost dev

> `swagger project start`

Prod:

> PM2 must be installed. Command can also be ran as root if necessary.

> Also network needs to be set up to point to the port located in the app.js file

> `pm2 start app.js --name monero-wallet -i 0 --log-date-format="MM-DD HH:mm Z"`
