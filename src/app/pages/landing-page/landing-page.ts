import { Component, signal } from '@angular/core';

interface Category {
  name: string;
  icon: string;
}



@Component({
  selector: 'app-landing-page',
  imports: [],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {

  readonly categories = signal<Category[]>([
    { name: 'All Products', icon: '🏪' },
    { name: 'Electronics', icon: '💻' },
    { name: 'Fashion', icon: '👕' },
    { name: 'Home & Garden', icon: '🏡' },
    { name: 'Sports & Outdoors', icon: '⚽' },
    { name: 'Health & Beauty', icon: '💄' },
    { name: 'Toys & Games', icon: '🎮' },
    { name: 'Books & Media', icon: '📚' },
    { name: 'Automotive', icon: '🚗' },
    { name: 'Grocery & Food', icon: '🍎' },
    { name: 'Pet Supplies', icon: '🐾' },
    { name: 'Office Supplies', icon: '📎' },
    { name: 'Baby & Kids', icon: '👶' },
    { name: 'Jewelry & Watches', icon: '💍' }
  ]);

  readonly activeCategory = signal<string>('All Products');

  selectCategory(category: string): void {
    this.activeCategory.set(category);
    // Add your logic here
  }

  isActive(category: string): boolean {
    return this.activeCategory() === category;
  }

  
}
