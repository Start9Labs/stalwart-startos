export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'Starting Stalwart!': 0,
  'Stalwart has not been set up yet': 1,
  'Mail Server': 2,
  'Stalwart is ready': 3,
  'Stalwart is not ready': 4,
  // interfaces.ts
  'Admin Console': 5,
  'Web console for managing domains, accounts and server settings. Also serves JMAP, CalDAV, CardDAV, WebDAV and mail client autoconfiguration.': 6,
  'Account Manager': 7,
  'Self-service portal where users change their password and manage app passwords and two-factor authentication.': 8,
  SMTP: 9,
  'Receives mail from other mail servers (STARTTLS). Publish it on port 25 of your public address.': 10,
  'SMTP Submission': 11,
  'Where your mail clients send outgoing mail (implicit TLS). Publish it on port 465 of your public address.': 12,
  IMAP: 13,
  'Where your mail clients read mail (implicit TLS). Publish it on port 993 of your public address.': 14,
  ManageSieve: 15,
  'Lets mail clients edit server-side filter rules (STARTTLS). Publish it on port 4190 of your public address.': 16,
  // init
  'Choose the email domain and hostname of your mail server': 17,
  'Set the admin password before signing in to the Stalwart web console': 18,
  'Configuring Stalwart': 19,
  // actions/setup.ts
  'Email domain': 20,
  'The domain your email addresses will end in, e.g. example.com for user@example.com. More domains can be added later in the Stalwart web console.': 21,
  'Mail server hostname': 22,
  'The public name of this server, e.g. mail.example.com. Other mail servers deliver to it, your mail clients connect to it, and its TLS certificate is issued for it. It must be the email domain itself or a name under it.': 23,
  'Set Up Mail Server': 24,
  'Choose the email domain and the hostname of this mail server.': 25,
  'These cannot be changed from StartOS once set. To change them later, use the Stalwart web console.': 26,
  Setup: 27,
  'The hostname must be the email domain or a name under it': 28,
  // actions/setAdminPassword.ts
  'Set Admin Password': 29,
  '<p>Generate a new random password for the Stalwart administrator account.</p><p>This action can only run while Stalwart is stopped, so the server loads the new password the next time it starts.</p>': 30,
  'Stalwart Admin Credentials': 31,
  'Use these to sign in to the Stalwart web console. The password is shown only now.': 32,
  Username: 33,
  Password: 34,
  // actions/showDnsRecords.ts
  'Show DNS Records': 35,
  'List the DNS records (MX, SPF, DKIM, DMARC, autoconfig and more) to publish for each of your email domains.': 36,
  'DNS Records': 37,
  'Publish these records at your DNS provider.': 38,
  'Address records': 39,
  'No public address is enabled on the SMTP interface yet, so there is no address record to publish. Enable one, then run this again.': 40,
  'Replaces the current admin password. The old password stops working the next time Stalwart starts.': 41,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
