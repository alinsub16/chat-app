export interface ActionResponse{
  message?: string;
  logout?: boolean;
}

export interface UserProfile {
  _id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  profilePicture?: string;
  email?: string;
  phoneNumber?: string;
}; 
