import { Component, ViewChild } from '@angular/core'
import { ProductsService } from '../services/products.service'
import { Product, Products } from '../../types'
import { ProductComponent } from '../components/product/product.component'
import { CommonModule } from '@angular/common'
import { Paginator, PaginatorModule } from 'primeng/paginator'
import { EditPopupComponent } from "../components/edit-popup/edit-popup.component";
import { ButtonModule } from 'primeng/button'

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [ProductComponent, CommonModule, PaginatorModule, EditPopupComponent, ButtonModule]
})
export class HomeComponent {
    constructor (private productsService: ProductsService) {}

    @ViewChild('paginator') paginator: Paginator | undefined

    products: Product[] = []

    totalRecords: number = 0
    rows: number = 5

    displayEditPopup: boolean = false
    displayAddPopup: boolean = false

    toggleEditPopup (product: Product) {
        this.selectedProduct = product
        this.displayEditPopup = true
    }

    toggleAddPopup () {
        this.displayAddPopup = true
    }

    toggleDeletePopup (product: Product) {
        if (!product.id) {
            return
        }

        this.deleteProduct(product.id)
    }

    selectedProduct: Product = {
        id: 0,
        name: '',
        price: '',
        image: '',
        rating: 0
    }

    onConfirmEdit (product: Product) {
        if (!this.selectedProduct.id) {
            return
        } 

        this.editProduct(product, this.selectedProduct.id)
        this.displayEditPopup = false
    }

    onConfirmAdd (product: Product) {
        this.addProduct(product)
        this.displayAddPopup = false
    }

    onProductOutput (product: Product) {
        // console.log(product, 'Output');
    }

    onPageChange (event: any) {
        console.log(event, 'Page change')
        this.fetchProducts(event.page, event.rows)
    }

    resetPaginator() {
        this.paginator?.changePage(0)
    }

    fetchProducts (page: number, perPage: number) {
        this.productsService
            .getProducts('https://angular-e-commerce-ld9zbcnd2-chenkevin711s-projects.vercel.app/clothes', {
                page,
                perPage
            })
            .subscribe({
                next: (products: Products) => {
                    this.products = products.items
                    this.totalRecords = products.total
                },
                error: (error: Error) => {
                    console.error(error)
                }
            })
    }

    editProduct (product: Product, id: number) {
        this.productsService
            .editProduct(`https://angular-e-commerce-ld9zbcnd2-chenkevin711s-projects.vercel.app/clothes/${id}`, product)
            .subscribe({
                next: () => {
                    console.log('Product edited')
                    this.fetchProducts(0, this.rows)
                    this.resetPaginator()
                },
                error: (error: Error) => {
                    console.error(error)
                }
            })
    }

    addProduct (product: Product) {
        this.productsService
            .addProduct('https://angular-e-commerce-ld9zbcnd2-chenkevin711s-projects.vercel.app/clothes', product)
            .subscribe({
                next: () => {
                    console.log('Product added')
                    this.fetchProducts(0, this.rows)
                    this.resetPaginator()
                },
                error: (error: Error) => {
                    console.error(error)
                }
            })
    }

    deleteProduct (id: number) {
        this.productsService
            .deleteProduct(`https://angular-e-commerce-ld9zbcnd2-chenkevin711s-projects.vercel.app/clothes/${id}`)
            .subscribe({
                next: () => {
                    console.log('Product deleted')
                    this.fetchProducts(0, this.rows)
                    this.resetPaginator()
                },
                error: (error: Error) => {
                    console.error(error)
                }
            })
    }

    ngOnInit () {
        this.fetchProducts(0, this.rows)
    }
}
