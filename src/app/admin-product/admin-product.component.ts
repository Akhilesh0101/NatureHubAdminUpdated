import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../admin-services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-product',
  templateUrl: './admin-product.component.html',
  styleUrls: ['./admin-product.component.css'],
  imports: [CommonModule]
})
export class AdminProductComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  // Load all products
  loadProducts() {
    this.productService.getProducts().subscribe(
      (data: Product[]) => {
        this.products = data;
        console.log('Fetched products:', data);  // Check if data is fetched correctly
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  // Add product
  onAddProduct() {
    const newProduct: Product = {
      ProductId: 0, // Backend will assign this
      ProductName: 'New Product',
      Productimg: '',
      Price: 0,
      Description: '',
      StockQuantity: 0,
      CategoryId: 1,
      CreatedByAdminId: 1
    };

    this.productService.addProduct(newProduct).subscribe(
      (product) => {
        this.products.push(product);
      },
      (error) => {
        console.error('Error adding product:', error);
      }
    );
  }

  // Edit product
  onEditProduct(product: Product) {
    const updatedProduct: Product = { ...product };
    const updatedName = prompt('Enter new product name:', product.ProductName);
    const updatedCategory = prompt('Enter new product category:', product.ProductName);
    const updatedPrice = prompt('Enter new product price:', product.Price.toString());

    if (updatedName && updatedCategory && updatedPrice) {
      updatedProduct.ProductName = updatedName;
      updatedProduct.Productimg = updatedCategory; // Assume you also update image/category
      updatedProduct.Price = parseFloat(updatedPrice);

      this.productService.updateProduct(product.ProductId, updatedProduct).subscribe(
        () => {
          const index = this.products.findIndex(p => p.ProductId === product.ProductId);
          if (index !== -1) {
            this.products[index] = updatedProduct;
          }
        },
        (error) => {
          console.error('Error updating product:', error);
        }
      );
    }
  }

  // Delete product
  onDeleteProduct(productId: number) {
    const confirmDelete = confirm('Are you sure you want to delete this product?');
    if (confirmDelete) {
      this.productService.deleteProduct(productId).subscribe(
        () => {
          this.products = this.products.filter(p => p.ProductId !== productId);
        },
        (error) => {
          console.error('Error deleting product:', error);
        }
      );
    }
  }
}
