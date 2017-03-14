import {Component} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {AuthenticationService} from "../../remote/authentication.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent {
  constructor(private router: Router, private route: ActivatedRoute,private authenticationService: AuthenticationService) {
  }

  logout() {
    this.router.navigate(['../logout'], {relativeTo: this.route});
  }
}
