import {Component} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent {
  constructor(private router: Router, private r: ActivatedRoute) {
  }

  logout() {
    this.router.navigate(['../logout'], {relativeTo: this.r});
  }
}
