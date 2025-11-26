import { authController } from '../controllers/authController.js';

export async function handleAuthRoutes({ req, res, method, url }) {
  if (method === 'POST' && url.pathname === '/api/login') {
    await authController.login(req, res);
    return true;
  }
  if (method === 'POST' && url.pathname === '/api/register') {
    await authController.register(req, res);
    return true;
  }
  return false;
}
