export interface JwtDto {
  /**
   * User id
   */
  uid: string;
  /**
   * Issued at
   */
  iat: number;
  /**
   * Expiration time
   */
  exp: number;
}
