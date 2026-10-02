import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      name: 'jasper-services',
      status: 'ok',
    };
  }
}
