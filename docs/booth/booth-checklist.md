# EXPO booth checklist

## One week before
- [ ] Confirm date, arrival time, table size, power sockets, Wi-Fi details and wall or stand rules with the organisers
- [ ] Agree who stands at the booth when (rota with breaks); everyone remains engaged for the full session
- [ ] Order printing: banner, display board, handouts, QR codes
- [ ] Decide the database plan for the EXPO date (see docs/report-updates/section-11-3-deployment.md)

## Two days before
- [ ] Enable the keep-alive workflow: gh workflow enable "Keep API awake"
- [ ] Run infra\verify-production.ps1 and save the output
- [ ] Full dry run of the demo on the booth laptop; record a backup video
- [ ] Charge everything; update and restart laptops, then turn off automatic updates

## Display and props
- [ ] Display board on a stand or easel; fixing materials (removable tape, cable ties, clips)
- [ ] Banner positioned behind or above the table where visitors see it from the aisle
- [ ] Props: sample boxes labelled Retail and Bulk (12 / 24 / 48), printed architecture one-pager, printed screenshots
- [ ] QR codes to the live web address and the GitHub repository
- [ ] Name tags, pens, tape, scissors, water

## Demo laptop setup
- [ ] Sleep off, notifications silenced, battery saver off, display scaling and browser zoom set for readability from 1 m
- [ ] One browser window per role, signed in just before each demo (access tokens last 15 minutes)
- [ ] Bookmarks: web app, API /health, GitHub Actions page, Render dashboard
- [ ] Second laptop with the same setup as a spare
- [ ] Backup video and screenshots stored locally and on a USB stick

## Connectivity
- [ ] Primary: venue Wi-Fi
- [ ] Secondary: phone hotspot, with a data bundle checked beforehand
- [ ] Tertiary: a second hotspot on a different mobile network, if possible
- [ ] Test all three at the booth before opening
- [ ] Keep the API awake: a ping loop on a spare device (see below)

## Power
- [ ] Laptops fully charged; chargers packed
- [ ] Power banks that can charge a laptop
- [ ] Extension lead and multi-plug
- [ ] Ask the venue about power cuts and whether the table has backup power

## Day-of timeline
1. Arrive early enough to set up, test and tidy before doors open
2. Mount the board and banner, lay out props
3. Connect to the network, wake the API, run the verification script
4. Open every demo window and test each login
5. Brief the rota: who demos, who answers questions, who watches the connection

## Fallbacks
- Live demo fails: switch to the backup video, then retry
- Wi-Fi fails: switch to hotspot, then hotspot two
- API asleep: open /health in a tab and wait about a minute
- Laptop fails: use the spare
