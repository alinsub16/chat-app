
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  middleName:string;
  email: string;
  phoneNumber: string;
  profilePicture?: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  middleName:string;
  email: string;
  phoneNumber: string;
  password: string;
  profilePicture:string | null;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success:boolean;
  massage:string;
  token: string;
  user: User;
}
