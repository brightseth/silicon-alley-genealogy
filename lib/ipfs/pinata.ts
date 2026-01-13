const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  external_url: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

/**
 * Pin JSON metadata to IPFS via Pinata
 */
export async function pinMetadata(
  personId: string,
  metadata: NFTMetadata
): Promise<string> {
  const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      pinata_api_key: PINATA_API_KEY!,
      pinata_secret_api_key: PINATA_SECRET_KEY!,
    },
    body: JSON.stringify({
      pinataContent: metadata,
      pinataMetadata: {
        name: `silicon-alley-pioneer-${personId}`,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to pin metadata: ${response.statusText}`);
  }

  const data = await response.json();
  return data.IpfsHash;
}

/**
 * Pin an image to IPFS via Pinata
 */
export async function pinImage(
  imageBuffer: Buffer,
  filename: string
): Promise<string> {
  const formData = new FormData();
  // Convert Buffer to Uint8Array for Blob compatibility
  const uint8Array = new Uint8Array(imageBuffer);
  const blob = new Blob([uint8Array], { type: 'image/png' });
  formData.append('file', blob, filename);
  formData.append(
    'pinataMetadata',
    JSON.stringify({ name: filename })
  );

  const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      pinata_api_key: PINATA_API_KEY!,
      pinata_secret_api_key: PINATA_SECRET_KEY!,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to pin image: ${response.statusText}`);
  }

  const data = await response.json();
  return data.IpfsHash;
}

/**
 * Generate NFT metadata for a pioneer
 */
export function generatePioneerMetadata(
  person: {
    id: string;
    name: string;
    title?: string | null;
    company?: string | null;
    bio?: string | null;
    era?: string | null;
    neighborhood?: string | null;
  },
  imageHash: string
): NFTMetadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://silicon-alley-genealogy.vercel.app';

  return {
    name: `${person.name} - Silicon Alley Pioneer`,
    description: person.bio || `Pioneer of Silicon Alley, NYC's first tech scene (1995-2001)`,
    image: `ipfs://${imageHash}`,
    external_url: `${baseUrl}/person/${person.id}`,
    attributes: [
      {
        trait_type: 'Collection',
        value: 'Silicon Alley Pioneers',
      },
      {
        trait_type: 'Era',
        value: person.era || '1995-2001',
      },
      ...(person.title
        ? [{ trait_type: 'Title', value: person.title }]
        : []),
      ...(person.company
        ? [{ trait_type: 'Company', value: person.company }]
        : []),
      ...(person.neighborhood
        ? [{ trait_type: 'Neighborhood', value: person.neighborhood }]
        : []),
    ],
  };
}

/**
 * Get IPFS gateway URL for a hash
 */
export function getIPFSUrl(hash: string): string {
  return `https://gateway.pinata.cloud/ipfs/${hash}`;
}
