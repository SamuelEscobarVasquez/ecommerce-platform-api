export default interface LoginResponse {
  accessToken: string;
  userId: number;
  username: string;
  roleName: string;
}

export interface UserLogged {
  userId: number 
  username: string 
  role: string
}

