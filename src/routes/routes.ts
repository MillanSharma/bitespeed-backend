import type { Router } from 'express';


import { createRouter } from '@/utils/create';
import handleIdentify from '@/controllers/identify';

export default createRouter((router: Router) => {
  router.post('/identify', handleIdentify);
});
