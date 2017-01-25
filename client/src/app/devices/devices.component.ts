import { Component, OnInit } from '@angular/core';
import {Router}    from '@angular/router';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  backClicked(): void {
    this.router.navigate(['/dashboard']);
  }

}
