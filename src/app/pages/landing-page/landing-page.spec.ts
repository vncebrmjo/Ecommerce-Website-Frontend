import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LandingPage } from './landing-page';
import { ProductCategoryService } from '../../core/services/product-category.service';
import { ProductService } from '../../core/services/product.service';
import { of } from 'rxjs';

describe('LandingPage', () => {
  let component: LandingPage;
  let fixture: ComponentFixture<LandingPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingPage],
      providers: [provideRouter([])]
    })
    .overrideProvider(ProductCategoryService, {
      useValue: { getAllProductCategory: () => of([]) }
    })
    .overrideProvider(ProductService, {
      useValue: { getAllProducts: () => of([]) }
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