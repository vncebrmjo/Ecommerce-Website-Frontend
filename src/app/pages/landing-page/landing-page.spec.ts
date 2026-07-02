import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingPage } from './landing-page';
import { ProductCategoryService } from '../../core/services/product-category.service';
import { of } from 'rxjs';

describe('LandingPage', () => {
  let component: LandingPage;
  let fixture: ComponentFixture<LandingPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingPage]
    })
    .overrideProvider(ProductCategoryService, {
      useValue: { getAllProductCategory: () => of([]) }
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
