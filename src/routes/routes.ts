import type { Router } from 'express';


import { handleIdentify } from '@/controllers/identify';

export default (router: Router) => {
  router.post('/identify', handleIdentify);
};
