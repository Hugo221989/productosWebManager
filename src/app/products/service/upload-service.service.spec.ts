import { TestBed } from '@angular/core/testing';

import { UploadService } from './upload-service.service';
import { HttpClientModule } from '@angular/common/http';
import { ProductsModule } from '../products.module';

describe('UploadService', () => {
  let service: UploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, ProductsModule],
    });
    service = TestBed.inject(UploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
