interface BuildFuneralHomeJsonLdParams {
  name: string;
  description: string;
  url: string;
  telephone: string;
  address: string;
  locality: string;
  region: string;
  imageUrl: string;
}

export const buildFuneralHomeJsonLd = ({
  name,
  description,
  url,
  telephone,
  address,
  locality,
  region,
  imageUrl,
}: BuildFuneralHomeJsonLdParams): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'FuneralHome',
  '@id': `${url}/#organization`,
  name,
  description,
  url,
  telephone,
  image: imageUrl,
  address: {
    '@type': 'PostalAddress',
    streetAddress: address,
    addressLocality: locality,
    addressRegion: region,
    addressCountry: 'AR',
  },
  areaServed: `${locality}, ${region}, Argentina`,
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
    ],
    opens: '00:00',
    closes: '23:59',
  },
});
