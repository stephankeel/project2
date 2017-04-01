import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../remote/authentication.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private auhtService: AuthenticationService) {
  }

  ngOnInit() {
    this.auhtService.logout();
  }

  dashboard() {
    this.router.navigate(['../dashboard'], {relativeTo: this.route});
  }

}
