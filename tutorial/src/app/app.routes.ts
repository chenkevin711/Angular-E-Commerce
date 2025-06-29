import { Routes } from '@angular/router'
import { HomeComponent } from './home/home.component'

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'about-us',
        loadChildren: () =>
            import('./module/about-us/about-us.module').then(
                m => m.AboutUsModule
            )
    }
]
