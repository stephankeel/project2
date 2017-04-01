import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../remote/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent {
  constructor(private router: Router, private route: ActivatedRoute, public authenticationService: AuthenticationService) {
  }

  logout() {
    this.router.navigate(['../logout'], {relativeTo: this.route});
  }

  home(): void {
    this.router.navigate(['/dashboard']);
  }
}
