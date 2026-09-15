import { jmap, jmapQuery } from './utils'

type Certificate = {
  subjectAlternativeNames: Record<string, true>
  notValidAfter: string
}
type Domain = {
  id: string
  name: string
  certificateManagement: { '@type': string }
}
type Task = { id: string; '@type': string; domainId?: string }

// A renewal task claimed by an instance that was killed stays locked for an hour, and a
// task that has exhausted its retries is never rescheduled by Stalwart itself.
export async function armAcme(
  adminPassword: string,
  hostname: string,
  domain: string,
) {
  const now = new Date()
  const certs = await jmapQuery<Certificate>(adminPassword, 'Certificate', [
    'subjectAlternativeNames',
    'notValidAfter',
  ])
  if (
    certs.some(
      (c) =>
        c.subjectAlternativeNames[hostname] && new Date(c.notValidAfter) > now,
    )
  ) {
    return
  }
  const mailDomain = (
    await jmapQuery<Domain>(adminPassword, 'Domain', [
      'name',
      'certificateManagement',
    ])
  ).find((d) => d.name === domain)
  if (mailDomain?.certificateManagement['@type'] !== 'Automatic') return

  const stale = (await jmapQuery<Task>(adminPassword, 'Task'))
    .filter((t) => t['@type'] === 'AcmeRenewal' && t.domainId === mailDomain.id)
    .map((t) => t.id)
  await jmap(adminPassword, [
    [
      'x:Task/set',
      {
        destroy: stale,
        create: {
          renew: {
            '@type': 'AcmeRenewal',
            domainId: mailDomain.id,
            status: { '@type': 'Pending', due: now.toISOString() },
          },
        },
      },
      'c1',
    ],
  ])
}
