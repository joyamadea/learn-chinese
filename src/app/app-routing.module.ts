import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'category/:type',
    loadChildren: () =>
      import('./pages/category/category.module').then(
        (m) => m.CategoryPageModule
      ),
  },
  {
    path: 'level-pass',
    loadChildren: () =>
      import('./modals/level-pass/level-pass.module').then(
        (m) => m.LevelPassPageModule
      ),
  },
  {
    path: 'confirm-exit',
    loadChildren: () =>
      import('./modals/confirm-exit/confirm-exit.module').then(
        (m) => m.ConfirmExitPageModule
      ),
  },
  {
    path: 'main/:type/:id',
    loadChildren: () =>
      import('./pages/main/main.module').then((m) => m.MainPageModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'leaderboard',
    loadChildren: () =>
      import('./pages/leaderboard/leaderboard.module').then(
        (m) => m.LeaderboardPageModule
      ),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./pages/profile/profile.module').then((m) => m.ProfilePageModule),
  },
  {
    path: 'side-menu',
    loadChildren: () =>
      import('./modals/side-menu/side-menu.module').then(
        (m) => m.SideMenuPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
