export interface SearchUser {
  _id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  profilePicture?: string | null;
}