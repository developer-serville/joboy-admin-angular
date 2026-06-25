import { Routes } from '@angular/router';

import { LoginComponent } from './features/auth/component/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { MainComponent } from './layout/main/main.component';

import { authGuard } from './core/guards/auth.guard';
import { ProfileComponent } from './features/profile/profile.component';

export const routes: Routes = [

    {
        path: 'login',
        component: LoginComponent
    },

    {
        path: '',
        component: MainComponent,
        canActivate: [authGuard],
        children: [

            {
                path: 'dashboard',
                component: DashboardComponent
            },

            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'profile',
                component: ProfileComponent,
                canActivate: [authGuard]
            },
        ]
    },

    {
        path: '**',
        redirectTo: 'login'
    }
];