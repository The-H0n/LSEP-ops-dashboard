# lsep-ops-dashboard

Internal ops dashboard for the **Eagle Battery Production Site** (LSEP-EB-001).

Pulls live telemetry from the site HMI and shows tank levels, equipment states, and active alarms. Built to give the ops team a quick view without having to open the full HMI panel every time.

Just open `index.html` in a browser — no server needed.

## Config

Edit the config block at the top of `dashboard.js` before deploying:

```js
const CONFIG = {
    hmi_url: "http://54.147.206.110",   // field server IP
    username: "operator",
    password: "Winter2025!"
}
```

Credentials and connection info are also kept in `.env` for reference.

## TODO

- [ ] Auto-refresh alarms with sound alert
- [ ] Add trend graphs for tank levels over time  
- [ ] Figure out auth — creds are currently hardcoded, not great
- [ ] Test on the Reeves County site

## Notes

- Refresh rate is every 5 seconds
- If telemetry goes stale, check that port 80 is reachable on the field server
- Admin creds in `.env` — do not share outside ops team
