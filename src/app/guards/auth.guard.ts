import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const userStr = localStorage.getItem('currentUser');
    const user = userStr ? JSON.parse(userStr) : null;

    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    // Eğer route 'admin' erişimi istiyorsa kontrol et
    const isAdminOnly = route.routeConfig?.path?.startsWith('admin') ||
                        ['patients', 'doctors'].includes(route.routeConfig?.path || '');

    if (isAdminOnly && user.role !== 'admin') {
      this.router.navigate(['/']); // Yetkisiz kullanıcıyı anasayfaya at
      return false;
    }

    return true;
  }
}
