import express from 'express';
import payment from './payment'

const router = express.Router();


const defaultRoutes = [
  {
    path: '/payment',
    route: payment,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});


export default router