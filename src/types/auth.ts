import type { Role, User } from "./user";

export interface RegisterDto {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  invitation_token: string;
}

export interface SigninDto {
  email: string;
  password: string;
}

export interface SignupDto {
  name: string;
  email: string;
  password: string;
  role: Role;
  tenant_id?: string;
}

export interface RefreshDto {
  access_token: string;
}

export interface SigninResponse {
  token_pair: {
    access_token: string;
    refresh_token: string;
    expires_at: Date;
  };
  user: User;
}

export interface RefreshResponse {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface VerifyOtpDto {
  email: string;
  otp: string;
}

export interface ResetPasswordDto {
  token: string;
  password: string;
  confirm_password: string;
}

export interface ForgotPasswordResponse {
  message: string;
  expires_at: number;
}

export interface VerifyOtpResponse {
  token: string;
  expires_at: number;
}

export interface ResetPasswordResponse {
  message: string;
}
