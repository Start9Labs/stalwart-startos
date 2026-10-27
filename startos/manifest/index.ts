import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'stalwart',
  title: 'Stalwart',
  license: 'AGPL-3.0',
  packageRepo: 'https://github.com/Start9Labs/stalwart-startos',
  upstreamRepo: 'https://github.com/stalwartlabs/stalwart',
  marketingUrl: 'https://stalw.art',
  donationUrl: 'https://opencollective.com/stalwart',
  description: { short, long },
  volumes: ['main'],
  images: {
    stalwart: {
      source: {
        dockerTag: 'stalwartlabs/stalwart:v1.0.0',
      },
      arch: ['x86_64', 'aarch64'],
    },
    migrate: {
      source: {
        dockerBuild: {
          dockerfile: 'migrate.Dockerfile',
          buildArgs: { IMAGE: 'stalwartlabs/stalwart-migrate:1.0.1' },
        },
      },
      arch: ['x86_64', 'aarch64'],
    },
  },
})
