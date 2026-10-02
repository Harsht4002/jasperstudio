export type AdminUser = {
  id: string;
  email: string;
  name?: string | null;
  role?: string;
};

export type AdminLoginInput = {
  email: string;
  password: string;
};

export type AdminRegisterInput = AdminLoginInput & {
  name: string;
};

export type AdminRefreshResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType?: "Bearer";
};

export type AdminLoginResponse = AdminRefreshResponse & {
  admin: AdminUser;
};
