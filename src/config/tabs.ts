import {
  BiometricAccessIcon,
  Invoice03Icon,
  School01Icon,
  ServerStack02Icon,
  Setting07Icon,
  WebProtectionIcon,
} from "@hugeicons/core-free-icons";

export type FieldType = "text" | "textarea" | "select" | "switch" | "file" | "color" | "number";

export interface ConfigField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  description?: string;
  options?: { value: string; label: string }[];
  defaultValue?: string | boolean | number;
}

export interface ConfigChild {
  name: string;
  description: string;
  fields: ConfigField[];
}

export interface ConfigTab {
  tab: string;
  icon: typeof Setting07Icon;
  description: string;
  children: ConfigChild[];
}

export const SYSTEM_CONFIGURATION_TABS: ConfigTab[] = [
  {
    tab: "General Settings",
    icon: Setting07Icon,
    description: "Global platform identity and localization",
    children: [
      {
        name: "Branding",
        description: "Logos, favicons, and global color schemes",
        fields: [
          { name: "platformName", label: "Platform Name", type: "text", placeholder: "Enter platform name" },
          { name: "logo", label: "Logo", type: "file", description: "Upload your platform logo (PNG, SVG)" },
          { name: "favicon", label: "Favicon", type: "file", description: "Upload favicon (ICO, PNG)" },
          { name: "primaryColor", label: "Primary Color", type: "color", defaultValue: "#6366f1" },
          { name: "secondaryColor", label: "Secondary Color", type: "color", defaultValue: "#8b5cf6" },
        ],
      },
      {
        name: "Localization",
        description: "Default language, timezone, and currency",
        fields: [
          {
            name: "defaultLanguage",
            label: "Default Language",
            type: "select",
            options: [
              { value: "en", label: "English" },
              { value: "es", label: "Spanish" },
              { value: "fr", label: "French" },
              { value: "de", label: "German" },
            ],
          },
          {
            name: "timezone",
            label: "Timezone",
            type: "select",
            options: [
              { value: "UTC", label: "UTC" },
              { value: "America/New_York", label: "Eastern Time (ET)" },
              { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
              { value: "Europe/London", label: "London (GMT)" },
            ],
          },
          {
            name: "currency",
            label: "Default Currency",
            type: "select",
            options: [
              { value: "USD", label: "US Dollar (USD)" },
              { value: "EUR", label: "Euro (EUR)" },
              { value: "GBP", label: "British Pound (GBP)" },
              { value: "NGN", label: "Nigerian Naira (NGN)" },
            ],
          },
          {
            name: "dateFormat",
            label: "Date Format",
            type: "select",
            options: [
              { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
              { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
              { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
            ],
          },
        ],
      },
      {
        name: "Legal & Compliance",
        description: "Global TOS, Privacy Policy, and Cookie Consent",
        fields: [
          { name: "termsOfService", label: "Terms of Service URL", type: "text", placeholder: "https://..." },
          { name: "privacyPolicy", label: "Privacy Policy URL", type: "text", placeholder: "https://..." },
          { name: "cookieConsentEnabled", label: "Enable Cookie Consent Banner", type: "switch", defaultValue: true },
          { name: "gdprCompliance", label: "GDPR Compliance Mode", type: "switch", defaultValue: false },
          { name: "dataRetentionDays", label: "Data Retention Period (days)", type: "number", defaultValue: 365 },
        ],
      },
    ],
  },
  {
    tab: "Tenant & Subscription",
    icon: School01Icon,
    description: "Multi-tenancy management and pricing tiers",
    children: [
      {
        name: "Plan Management",
        description: "Define Basic, Pro, and Enterprise feature sets",
        fields: [
          { name: "freeTierEnabled", label: "Enable Free Tier", type: "switch", defaultValue: true },
          { name: "trialDays", label: "Trial Period (days)", type: "number", defaultValue: 14 },
          { name: "basicPlanPrice", label: "Basic Plan Price (monthly)", type: "number", defaultValue: 29 },
          { name: "proPlanPrice", label: "Pro Plan Price (monthly)", type: "number", defaultValue: 99 },
          { name: "enterprisePlanPrice", label: "Enterprise Plan Price (monthly)", type: "number", defaultValue: 299 },
        ],
      },
      {
        name: "Quotas & Limits",
        description: "Global limits for storage, users, and bandwidth",
        fields: [
          { name: "maxUsersBasic", label: "Max Users (Basic)", type: "number", defaultValue: 50 },
          { name: "maxUsersPro", label: "Max Users (Pro)", type: "number", defaultValue: 500 },
          { name: "maxUsersEnterprise", label: "Max Users (Enterprise)", type: "number", defaultValue: -1 },
          { name: "storageBasicGB", label: "Storage Limit - Basic (GB)", type: "number", defaultValue: 10 },
          { name: "storageProGB", label: "Storage Limit - Pro (GB)", type: "number", defaultValue: 100 },
          { name: "bandwidthLimitGB", label: "Monthly Bandwidth Limit (GB)", type: "number", defaultValue: 500 },
        ],
      },
      {
        name: "Provisioning",
        description: "Self-service signup vs. manual approval workflows",
        fields: [
          { name: "selfServiceSignup", label: "Allow Self-Service Signup", type: "switch", defaultValue: true },
          { name: "requireApproval", label: "Require Admin Approval", type: "switch", defaultValue: false },
          {
            name: "allowedDomains",
            label: "Allowed Email Domains",
            type: "textarea",
            placeholder: "example.com, company.org",
          },
          { name: "welcomeEmailEnabled", label: "Send Welcome Email", type: "switch", defaultValue: true },
          {
            name: "defaultTenantStatus",
            label: "Default Tenant Status",
            type: "select",
            options: [
              { value: "active", label: "Active" },
              { value: "pending", label: "Pending Review" },
              { value: "trial", label: "Trial" },
            ],
          },
        ],
      },
    ],
  },
  {
    tab: "Security & Auth",
    icon: BiometricAccessIcon,
    description: "Access control and authentication protocols",
    children: [
      {
        name: "Authentication Providers",
        description: "SSO, SAML, Google, and Microsoft OAuth",
        fields: [
          { name: "googleOAuthEnabled", label: "Enable Google OAuth", type: "switch", defaultValue: true },
          { name: "googleClientId", label: "Google Client ID", type: "text", placeholder: "Enter Client ID" },
          { name: "microsoftOAuthEnabled", label: "Enable Microsoft OAuth", type: "switch", defaultValue: false },
          { name: "microsoftClientId", label: "Microsoft Client ID", type: "text", placeholder: "Enter Client ID" },
          { name: "samlEnabled", label: "Enable SAML SSO", type: "switch", defaultValue: false },
          { name: "samlMetadataUrl", label: "SAML Metadata URL", type: "text", placeholder: "https://..." },
        ],
      },
      {
        name: "Password Policy",
        description: "Complexity, rotation, and MFA requirements",
        fields: [
          { name: "minPasswordLength", label: "Minimum Password Length", type: "number", defaultValue: 8 },
          { name: "requireUppercase", label: "Require Uppercase Letter", type: "switch", defaultValue: true },
          { name: "requireNumbers", label: "Require Numbers", type: "switch", defaultValue: true },
          { name: "requireSpecialChars", label: "Require Special Characters", type: "switch", defaultValue: true },
          { name: "passwordExpiryDays", label: "Password Expiry (days)", type: "number", defaultValue: 90 },
          { name: "mfaRequired", label: "Require MFA", type: "switch", defaultValue: false },
          {
            name: "mfaMethod",
            label: "MFA Method",
            type: "select",
            options: [
              { value: "totp", label: "Authenticator App (TOTP)" },
              { value: "sms", label: "SMS" },
              { value: "email", label: "Email" },
            ],
          },
        ],
      },
      {
        name: "IP Management",
        description: "Whitelisting and blacklisting of specific IP ranges",
        fields: [
          { name: "ipWhitelistEnabled", label: "Enable IP Whitelist", type: "switch", defaultValue: false },
          {
            name: "whitelistedIPs",
            label: "Whitelisted IPs",
            type: "textarea",
            placeholder: "192.168.1.1, 10.0.0.0/24",
          },
          { name: "ipBlacklistEnabled", label: "Enable IP Blacklist", type: "switch", defaultValue: false },
          { name: "blacklistedIPs", label: "Blacklisted IPs", type: "textarea", placeholder: "Enter IPs to block" },
          { name: "maxLoginAttempts", label: "Max Login Attempts", type: "number", defaultValue: 5 },
          { name: "lockoutDurationMinutes", label: "Lockout Duration (minutes)", type: "number", defaultValue: 30 },
        ],
      },
    ],
  },
  {
    tab: "Infrastructure",
    icon: ServerStack02Icon,
    description: "Core engine and third-party integrations",
    children: [
      {
        name: "Storage (S3/Cloud)",
        description: "Connection strings for asset hosting",
        fields: [
          {
            name: "storageProvider",
            label: "Storage Provider",
            type: "select",
            options: [
              { value: "s3", label: "Amazon S3" },
              { value: "gcs", label: "Google Cloud Storage" },
              { value: "azure", label: "Azure Blob Storage" },
              { value: "local", label: "Local Storage" },
            ],
          },
          { name: "s3BucketName", label: "Bucket Name", type: "text", placeholder: "my-bucket" },
          { name: "s3Region", label: "Region", type: "text", placeholder: "us-east-1" },
          { name: "s3AccessKey", label: "Access Key ID", type: "text", placeholder: "AKIA..." },
          { name: "s3SecretKey", label: "Secret Access Key", type: "text", placeholder: "Enter secret key" },
          { name: "cdnEnabled", label: "Enable CDN", type: "switch", defaultValue: false },
          { name: "cdnUrl", label: "CDN URL", type: "text", placeholder: "https://cdn.example.com" },
        ],
      },
      {
        name: "Email (SMTP/SES)",
        description: "Transactional email gateway configuration",
        fields: [
          {
            name: "emailProvider",
            label: "Email Provider",
            type: "select",
            options: [
              { value: "smtp", label: "SMTP" },
              { value: "ses", label: "Amazon SES" },
              { value: "sendgrid", label: "SendGrid" },
              { value: "mailgun", label: "Mailgun" },
            ],
          },
          { name: "smtpHost", label: "SMTP Host", type: "text", placeholder: "smtp.example.com" },
          { name: "smtpPort", label: "SMTP Port", type: "number", defaultValue: 587 },
          { name: "smtpUser", label: "SMTP Username", type: "text", placeholder: "Enter username" },
          { name: "smtpPassword", label: "SMTP Password", type: "text", placeholder: "Enter password" },
          { name: "fromEmail", label: "From Email Address", type: "text", placeholder: "noreply@example.com" },
          { name: "fromName", label: "From Name", type: "text", placeholder: "Platform Name" },
        ],
      },
      {
        name: "Video & Media",
        description: "API keys for Vimeo, YouTube, or AWS Elemental",
        fields: [
          {
            name: "videoProvider",
            label: "Video Provider",
            type: "select",
            options: [
              { value: "youtube", label: "YouTube" },
              { value: "vimeo", label: "Vimeo" },
              { value: "aws", label: "AWS Elemental" },
              { value: "bunny", label: "Bunny Stream" },
            ],
          },
          { name: "youtubeApiKey", label: "YouTube API Key", type: "text", placeholder: "Enter API key" },
          { name: "vimeoAccessToken", label: "Vimeo Access Token", type: "text", placeholder: "Enter token" },
          { name: "maxUploadSizeMB", label: "Max Upload Size (MB)", type: "number", defaultValue: 500 },
          { name: "allowedVideoFormats", label: "Allowed Formats", type: "text", placeholder: "mp4, webm, mov" },
          { name: "autoTranscoding", label: "Enable Auto Transcoding", type: "switch", defaultValue: true },
        ],
      },
    ],
  },
  {
    tab: "Billing & Payments",
    icon: Invoice03Icon,
    description: "Platform-wide financial configurations",
    children: [
      {
        name: "Payment Gateways",
        description: "Stripe, PayPal, or Razorpay integration",
        fields: [
          {
            name: "primaryGateway",
            label: "Primary Payment Gateway",
            type: "select",
            options: [
              { value: "stripe", label: "Stripe" },
              { value: "paypal", label: "PayPal" },
              { value: "razorpay", label: "Razorpay" },
              { value: "paystack", label: "Paystack" },
            ],
          },
          { name: "stripePublicKey", label: "Stripe Public Key", type: "text", placeholder: "pk_..." },
          { name: "stripeSecretKey", label: "Stripe Secret Key", type: "text", placeholder: "sk_..." },
          { name: "stripeWebhookSecret", label: "Webhook Secret", type: "text", placeholder: "whsec_..." },
          { name: "testModeEnabled", label: "Enable Test Mode", type: "switch", defaultValue: true },
        ],
      },
      {
        name: "Tax Engine",
        description: "Global VAT/GST and regional tax rules",
        fields: [
          { name: "taxEnabled", label: "Enable Tax Calculations", type: "switch", defaultValue: true },
          { name: "defaultTaxRate", label: "Default Tax Rate (%)", type: "number", defaultValue: 0 },
          { name: "taxIncludedInPrice", label: "Tax Included in Price", type: "switch", defaultValue: false },
          {
            name: "taxProvider",
            label: "Tax Provider",
            type: "select",
            options: [
              { value: "manual", label: "Manual Configuration" },
              { value: "taxjar", label: "TaxJar" },
              { value: "avalara", label: "Avalara" },
            ],
          },
          { name: "vatNumber", label: "Platform VAT Number", type: "text", placeholder: "Enter VAT number" },
        ],
      },
      {
        name: "Invoice Templates",
        description: "HTML/PDF layouts for system-generated receipts",
        fields: [
          { name: "invoicePrefix", label: "Invoice Number Prefix", type: "text", defaultValue: "INV-" },
          { name: "invoiceStartNumber", label: "Starting Invoice Number", type: "number", defaultValue: 1000 },
          { name: "companyName", label: "Company Name on Invoice", type: "text", placeholder: "Your Company Ltd" },
          { name: "companyAddress", label: "Company Address", type: "textarea", placeholder: "Enter full address" },
          {
            name: "invoiceFooterText",
            label: "Invoice Footer Text",
            type: "textarea",
            placeholder: "Thank you for your business",
          },
          { name: "autoSendInvoice", label: "Auto-send Invoice on Payment", type: "switch", defaultValue: true },
        ],
      },
    ],
  },
  {
    tab: "Maintenance & Logs",
    icon: WebProtectionIcon,
    description: "System health and audit trails",
    children: [
      {
        name: "Audit Logs",
        description: "Global history of admin actions",
        fields: [
          { name: "auditLogEnabled", label: "Enable Audit Logging", type: "switch", defaultValue: true },
          { name: "logRetentionDays", label: "Log Retention (days)", type: "number", defaultValue: 90 },
          { name: "logUserActions", label: "Log User Actions", type: "switch", defaultValue: true },
          { name: "logApiCalls", label: "Log API Calls", type: "switch", defaultValue: false },
          {
            name: "logLevel",
            label: "Log Level",
            type: "select",
            options: [
              { value: "error", label: "Error Only" },
              { value: "warn", label: "Warning & Above" },
              { value: "info", label: "Info & Above" },
              { value: "debug", label: "Debug (All)" },
            ],
          },
        ],
      },
      {
        name: "Backup Schedule",
        description: "Automated DB and File system snapshots",
        fields: [
          { name: "autoBackupEnabled", label: "Enable Automatic Backups", type: "switch", defaultValue: true },
          {
            name: "backupFrequency",
            label: "Backup Frequency",
            type: "select",
            options: [
              { value: "hourly", label: "Hourly" },
              { value: "daily", label: "Daily" },
              { value: "weekly", label: "Weekly" },
            ],
          },
          { name: "backupRetentionDays", label: "Backup Retention (days)", type: "number", defaultValue: 30 },
          { name: "backupLocation", label: "Backup Storage Location", type: "text", placeholder: "s3://backups/" },
          { name: "notifyOnBackupFailure", label: "Notify on Backup Failure", type: "switch", defaultValue: true },
          {
            name: "backupNotificationEmail",
            label: "Notification Email",
            type: "text",
            placeholder: "admin@example.com",
          },
        ],
      },
      {
        name: "System Status",
        description: "Maintenance mode toggle and health checks",
        fields: [
          { name: "maintenanceMode", label: "Enable Maintenance Mode", type: "switch", defaultValue: false },
          {
            name: "maintenanceMessage",
            label: "Maintenance Message",
            type: "textarea",
            placeholder: "We are currently performing scheduled maintenance...",
          },
          {
            name: "allowAdminAccess",
            label: "Allow Admin Access During Maintenance",
            type: "switch",
            defaultValue: true,
          },
          { name: "healthCheckInterval", label: "Health Check Interval (seconds)", type: "number", defaultValue: 60 },
          { name: "statusPageUrl", label: "Status Page URL", type: "text", placeholder: "https://status.example.com" },
          { name: "uptimeMonitoring", label: "Enable Uptime Monitoring", type: "switch", defaultValue: true },
        ],
      },
    ],
  },
];
