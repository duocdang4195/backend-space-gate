import express from 'express';
import { CreateSuccess } from '../../utils';

const router = express.Router();

router.get('/', async (req: express.Request, res, next) => {
  const { message } = req.query;
  const success = new CreateSuccess({ message: 'hihi', data: message });
  return success.send(res);
});

export default router;
