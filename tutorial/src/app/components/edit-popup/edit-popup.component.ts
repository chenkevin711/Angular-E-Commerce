import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { DialogModule } from 'primeng/dialog'
import { Product } from '../../../types'
import { RatingModule } from 'primeng/rating'
import { ButtonModule } from 'primeng/button'

@Component({
    selector: 'app-edit-popup',
    standalone: true,
    imports: [
        DialogModule,
        CommonModule,
        RatingModule,
        ButtonModule
    ],
    templateUrl: './edit-popup.component.html',
    styleUrl: './edit-popup.component.scss'
})
export class EditPopupComponent {
    @Input() display: boolean = false
    @Output() displayChange = new EventEmitter<boolean>()

    @Input() header!: string

    @Output() confirm = new EventEmitter<Product>()
    @Output() cancel = new EventEmitter<void>()

    @Input() product: Product = {
        name: '',
        image: '',
        price: '',
        rating: 0
    }

    onConfirm () {
        this.confirm.emit(this.product)
        this.display = false
        this.displayChange.emit(this.display)
    }

    onCancel () {
        this.display = false
        this.displayChange.emit(this.display)
    }
}
