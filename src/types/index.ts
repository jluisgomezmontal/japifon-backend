export interface RequestWithUser extends Request {
  user: { sub: string; email?: string }; // ajusta según tu payload JWT
}
