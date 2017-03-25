import {Component, OnInit, Input} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss']
})
export class LineComponent implements OnInit {
  @Input() id: string;
  @Input() desc: string;

  @Input() disableEdit: boolean;
  @Input() hideEdit: boolean;
  @Input() disableDetails: boolean;
  @Input() hideDetails: boolean;
  @Input() disableDelete: boolean;
  @Input() hideDelete: boolean;

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
  }

  edit(id: string) {
    this.router.navigate(['edit', id], {relativeTo: this.route});
  }

  details(id: string) {
    this.router.navigate(['detail', id], {relativeTo: this.route});
  }

  del(id: string) {
    this.router.navigate(['delete', id], {relativeTo: this.route});
  }
}
