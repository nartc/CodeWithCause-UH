import {Injectable} from '@angular/core';
import * as config from '../../app.constants';
import {CropClient} from '../../app.api';

@Injectable()
export class CropsService {
  BACKEND_URL: string = config.BACKEND_URL;

  constructor(private cropApi: CropClient) {
  }

  getCrops() {
    return this.cropApi.getAll();
  }
}
