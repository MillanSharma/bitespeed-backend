import type { Router } from 'express';


import { handleIdentify } from '@/controllers/identify';
import { createRouter } from '@/utils/create';

export default createRouter((router: Router) => {
// GET for testing only
  router.get('/identify', handleIdentify);
});
