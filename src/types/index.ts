export type {
  HttpError,
  HttpResponse,
  Maybe,
  MaybePromise,
  MaybePromiseOrNull,
  Nullable,
  PaginatedResponse,
  PaginationParams,
  Undefined,
} from "./app";

export type { ApplicantStatus, Applicant, ApplicationToken } from "./applicant";

export type { AssignmentStatus, Assignment, AssignmentSubmission } from "./assignment";

export type {
  ForgotPasswordDto,
  ForgotPasswordResponse,
  RefreshDto,
  RefreshResponse,
  ResetPasswordDto,
  ResetPasswordResponse,
  SigninDto,
  SigninResponse,
  SignupDto,
  VerifyOtpDto,
  VerifyOtpResponse,
} from "./auth";

export type {
  CohortStatus,
  TermStatus,
  GradeLevel,
  FieldType,
  FormFieldOption,
  FieldValidation,
  ApplicationFormField,
  ApplicationForm,
  Track,
  Cohort,
  Term,
} from "./cohort";

export type { NotificationType, EmailStatus, Notification, Email, EmailTemplate, Announcement } from "./communication";

export type {
  AdminDashboardResponse,
  StudentDashboardResponse,
  SuperAdminDashboardResponse,
  TutorDashboardResponse,
} from "./dashboard";

export type {
  CourseStatus,
  EnrollmentStatus,
  ResourceType,
  Resource,
  Module,
  TutorCourse,
  Enrollment,
  Course,
} from "./course";

export type { ExaminationType, ExaminationStatus, Examination, ExaminationResult } from "./examination";

export type {
  ModuleProgressStatus,
  AttendanceStatus,
  SessionType,
  Progress,
  ModuleProgress,
  ResourceProgress,
  Attendance,
  Session,
} from "./progress";

export type { QuizStatus, QuestionType, AttemptStatus, QuizOption, Question, Answer, QuizAttempt, Quiz } from "./quiz";

export type { TenantStatus, SocialLinks, TenantBranding, TenantSettings, Tenant } from "./tenant";

export type {
  ApplicationStatus,
  TutorStatus,
  UserStatus,
  Role,
  Profile,
  Availability,
  Tutor,
  ApplicationDocument,
  Application,
  Student,
  User,
} from "./user";
