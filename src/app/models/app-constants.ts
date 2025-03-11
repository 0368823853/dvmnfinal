export class AppConstants{
    static readonly apiUrl = 'http://localhost:8080';

    static readonly tokenKey = 'jwtToken';

    static readonly ROLES = {
      ADMIN: 'ADMIN',
      USER: 'USER'
    };

    static readonly ROLE_ADMIN = 'ROLE_ADMIN';
    static readonly ROLE_USER = 'ROLE_USER';

    static getAuthHeaders(token: string | null): { [header: string]: string } {
        return {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token ?? ''}`
        };
      }
      
}