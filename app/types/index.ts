/**
 * Silicon Alley Genealogy - Type Definitions
 */

export interface Person {
  id: string;
  name: string;
  handle?: string; // Twitter, GitHub, etc.
  email: string;
  role?: string; // e.g., "Founder of SiteSpecific"
  era: string; // e.g., "1995-Present"
  bio?: string;
  avatar_url?: string;
  nft_token_id?: number;
  nft_minted: boolean;
  wallet_address?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Story {
  id: string;
  person_id: string;
  where_were_you: string; // Question 1
  what_were_you_building: string; // Question 2
  who_inspired_you: string; // Question 3
  favorite_memory?: string; // Question 4
  lessons_learned?: string; // Question 5
  status: 'pending' | 'approved' | 'featured';
  submitted_at: Date;
  approved_at?: Date;
  approved_by?: string;
}

export interface Connection {
  id: string;
  person_a_id: string;
  person_b_id: string;
  relationship_type: string; // e.g., "co-founder", "mentor", "colleague", "inspired by"
  company?: string; // e.g., "Web Partner Studio"
  description?: string;
  year?: number;
  created_at: Date;
}

export interface TimelineEvent {
  id: string;
  date: Date;
  title: string;
  description: string;
  event_type: 'company' | 'launch' | 'funding' | 'acquisition' | 'moment' | 'other';
  location?: string;
  related_people: string[]; // Array of person IDs
  related_companies: string[];
  source_url?: string;
  created_at: Date;
}

export interface Company {
  id: string;
  name: string;
  description?: string;
  founded_year?: number;
  founders: string[]; // Array of person IDs
  outcome?: string; // e.g., "Acquired by AOL", "IPO", "Shut down"
  website_url?: string;
  logo_url?: string;
  created_at: Date;
}

export interface NFTCard {
  token_id: number;
  person_id: string;
  owner_address?: string;
  metadata_uri: string;
  minted_at?: Date;
  claimed: boolean;
}

/**
 * Form submission types
 */
export interface StorySubmission {
  name: string;
  handle?: string;
  email: string;
  whereWereYou: string;
  whatWereYouBuilding: string;
  whoInspiredYou: string;
  favoriteMemory?: string;
  lessonsLearned?: string;
  connections?: string; // Comma-separated list of names
}

/**
 * Database schema types
 */
export interface DatabaseSchema {
  people: Person[];
  stories: Story[];
  connections: Connection[];
  timeline_events: TimelineEvent[];
  companies: Company[];
  nft_cards: NFTCard[];
}

/**
 * API response types
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}
