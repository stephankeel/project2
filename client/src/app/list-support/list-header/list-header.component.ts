import {Component, OnInit, Input} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-list-header',
  templateUrl: './list-header.component.html',
  styleUrls: ['./list-header.component.scss']
})
export class ListHeaderComponent implements OnInit {
  @Input() private title: string;
  @Input() private backlink: string;
  @Input() private showBack: boolean;
  @Input() private showCreate: boolean;
  @Input() private showShowAll: boolean;

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
