import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../remote/authentication.service';

@Component({
  selector: 'app-footer',
  templateUrl: 'footer.component.html',
  styleUrls: ['footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(public authenticationService: AuthenticationService) {
  }

  ngOnInit() {
  }

}
