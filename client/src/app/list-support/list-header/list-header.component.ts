import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-list-header',
  templateUrl: './list-header.component.html',
  styleUrls: ['./list-header.component.scss']
})
export class ListHeaderComponent implements OnInit {
  @Input() title: string;
  @Input() backlink: string;
  @Input() showBack: boolean;
  @Input() showCreate: boolean;
  @Input() disableCreate: boolean;
  @Input() showShowAll: boolean;

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
  }

  back() {
    this.router.navigate([this.backlink ? this.backlink : '..'], {relativeTo: this.route});
  }

  create() {
    this.router.navigate(['create'], {relativeTo: this.route});
  }

  showAll() {
    this.router.navigate(['showall'], {relativeTo: this.route});
  }
}
