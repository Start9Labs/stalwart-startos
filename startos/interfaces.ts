import { i18n } from './i18n'
import { sdk } from './sdk'
import {
  httpPort,
  imapsExternalPort,
  imapsPort,
  sieveExternalPort,
  sievePort,
  smtpExternalPort,
  smtpPort,
  submissionsExternalPort,
  submissionsPort,
} from './utils'

export const hostId = 'mail'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const mail = sdk.MultiHost.of(effects, hostId)

  const web = await mail.bindPort(httpPort, {
    protocol: 'http',
    preferredExternalPort: 80,
  })
  const admin = sdk.createInterface(effects, {
    name: i18n('Admin Console'),
    id: 'admin',
    description: i18n(
      'Web console for managing domains, accounts and server settings. Also serves JMAP, CalDAV, CardDAV, WebDAV and mail client autoconfiguration.',
    ),
    type: 'ui',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '/admin/',
    query: {},
  })
  const account = sdk.createInterface(effects, {
    name: i18n('Account Manager'),
    id: 'account',
    description: i18n(
      'Self-service portal where users change their password and manage app passwords and two-factor authentication.',
    ),
    type: 'ui',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '/account/',
    query: {},
  })

  const smtp = await mail.bindPort(smtpPort, {
    protocol: null,
    addSsl: null,
    preferredExternalPort: smtpExternalPort,
    secure: { ssl: false },
  })
  const smtpInterface = sdk.createInterface(effects, {
    name: i18n('SMTP'),
    id: 'smtp',
    description: i18n(
      'Receives mail from other mail servers (STARTTLS). Publish it on port 25 of your public address.',
    ),
    type: 'api',
    masked: false,
    schemeOverride: { ssl: 'smtp', noSsl: 'smtp' },
    username: null,
    path: '',
    query: {},
  })

  const submissions = await mail.bindPort(submissionsPort, {
    protocol: null,
    addSsl: null,
    preferredExternalPort: submissionsExternalPort,
    secure: { ssl: false },
  })
  const submissionsInterface = sdk.createInterface(effects, {
    name: i18n('SMTP Submission'),
    id: 'submissions',
    description: i18n(
      'Where your mail clients send outgoing mail (implicit TLS). Publish it on port 465 of your public address.',
    ),
    type: 'api',
    masked: false,
    schemeOverride: { ssl: 'smtps', noSsl: 'smtps' },
    username: null,
    path: '',
    query: {},
  })

  const imaps = await mail.bindPort(imapsPort, {
    protocol: null,
    addSsl: null,
    preferredExternalPort: imapsExternalPort,
    secure: { ssl: false },
  })
  const imapsInterface = sdk.createInterface(effects, {
    name: i18n('IMAP'),
    id: 'imaps',
    description: i18n(
      'Where your mail clients read mail (implicit TLS). Publish it on port 993 of your public address.',
    ),
    type: 'api',
    masked: false,
    schemeOverride: { ssl: 'imaps', noSsl: 'imaps' },
    username: null,
    path: '',
    query: {},
  })

  const sieve = await mail.bindPort(sievePort, {
    protocol: null,
    addSsl: null,
    preferredExternalPort: sieveExternalPort,
    secure: { ssl: false },
  })
  const sieveInterface = sdk.createInterface(effects, {
    name: i18n('ManageSieve'),
    id: 'sieve',
    description: i18n(
      'Lets mail clients edit server-side filter rules (STARTTLS). Publish it on port 4190 of your public address.',
    ),
    type: 'api',
    masked: false,
    schemeOverride: { ssl: 'sieve', noSsl: 'sieve' },
    username: null,
    path: '',
    query: {},
  })

  return [
    await web.export([admin, account]),
    await smtp.export([smtpInterface]),
    await submissions.export([submissionsInterface]),
    await imaps.export([imapsInterface]),
    await sieve.export([sieveInterface]),
  ]
})
