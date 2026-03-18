export type TenantStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface SocialLinks {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
}

export interface TenantBranding {
  logo_url: string;
  favicon_url: string;
  email_logo_url: string;
  email_banner_url: string;
  accent_color: string;
  footer_text: string;
  social_links: SocialLinks;
}

export interface TenantSettings {
  allow_self_registration: boolean;
  default_timezone: string;
  max_students: number;
  max_courses: number;
  max_tutors: number;
  primary_color: string;
  secondary_color: string;
  branding: TenantBranding;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  status: TenantStatus;
  settings: TenantSettings;
  created_at: string;
  updated_at: string;
}

export interface TTenant {
  id: string;
  name: string;
  slug: string;
  logo: string;
  primary_color: string;
  secondary_color: string;
}

export interface CreateTenantDto {
  name: string;
  slug: string;
  description: string;
  logo: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  settings: string;
  admin_name: string;
  admin_email: string;
  admin_password: string;
}
