import {Component, OnInit, Input} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss']
})
export class LineComponent implements OnInit {
  @Input() private id: string;
  @Input() private desc: string;

  @Input() private disableEdit: boolean;
  @Input() private hideEdit: boolean;
  @Input() private disableDetails: boolean;
  @Input() private hideDetails: boolean;
  @Input() private disableDelete: boolean;
  @Input() private hideDelete: boolean;

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
  }

  edit(id: string) {
    this.router.navigate(['../edit', id], {relativeTo: this.route});
  }

  details(id: string) {
    this.router.navigate(['../detail', id], {relativeTo: this.route});
  }

  del(id: string) {
    this.router.navigate(['../delete', id], {relativeTo: this.route});
  }


}
