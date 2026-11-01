# Account onboarding and security access guide

## How accounts are created
- Owner, Pharmacy Manager, Pharmacist, Doctor and Psychiatrist accounts are created by the Owner. <<verify the screen in user management>>
- Patients and Leisure/Wellness clients register themselves and must accept the POPIA consent for data storage. Reminders consent is optional.

## First sign-in
1. Open the MedFlow address in a supported browser.
2. Enter your email and the initial password from the Owner.
3. Choose a new password straight away. <<verify a change-password screen exists>>

## Password rules
10 to 128 characters with at least one upper-case letter, one lower-case letter and one digit. Use a password you use nowhere else.

## Sessions and lock-outs
- Sign-in sessions are deliberately short (15-minute access tokens). If a screen reports that authentication is required, sign in again.
- After 5 failed sign-ins the account locks for 15 minutes ("Account temporarily locked").
- Sign-in attempts are rate-limited (20 per 15 minutes per network address).
- The error for a wrong email or wrong password is the same on purpose, so it never reveals which accounts exist.

## What you can see
Access depends on your role. A Pharmacy Manager sees only their own pharmacy's orders and invoices. The Owner sees everything. Tax, analytics and user management are Owner-only.

## Good security habits
Do not share accounts. Sign out on shared computers. Report a lost password or a suspicious sign-in to the Owner.

## Your data (POPIA)
Consent is recorded when you register. A patient can export their own data. The Owner can export a patient's record on request. <<verify the screens>>

## Password resets
<<verify: describe the real procedure from the routes output, for example an Owner-assisted reset. Do not describe a self-service reset unless one exists.>>

## Demo accounts
Seeded demonstration accounts exist for evaluation only. Remove or change them before any real use.
