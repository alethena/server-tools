# ServerTools
Code that will run alongside our Ethereum node. Pulls logs and transforms them into a suitable format.


1. Run your local node using the following command:
    geth console --rinkeby --syncmode fast

2. Once this is synced, run
    node index.js

3. The raw logs and timestamped logs will now be saved to the corresponding folders according
   to the CRON schedule set up in index.js

4. If the calls take longer than the interval set in CRON, an error message is logged and calls
   are dropped if the previous call didn't go throuh yet.

5. If the node is still syncing, an error is logged and no logs are saved.
