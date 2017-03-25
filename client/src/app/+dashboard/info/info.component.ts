import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {CommonRestService} from '../../remote/common-rest.service';
import {Info} from "../../remote/info";

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

  private title: string;
  private infoList: InfoPair[] = [];

  constructor(private router: Router, private restService: CommonRestService) {
  }

  ngOnInit() {
    this.restService.getInfo().subscribe((info: Info) => {
      this.title = info.title;
      this.infoList.push(new InfoPair('Node Version', info.nodeVersion));
      this.infoList.push(new InfoPair('Anzahl CPUs', info.cpus.length.toString()));
      this.infoList.push(new InfoPair('CPU Modell', info.cpus[0].model));
      this.infoList.push(new InfoPair('Speicher total', this.formatMemory(info.totalMem)));
      this.infoList.push(new InfoPair('Freier Speicher', this.formatMemory(info.freeMem)));
    }, (error: any) => {});
  }

  private formatMemory(size: number): string {
    if (size >= Math.pow(10, 9)) {
      return (size / Math.pow(10, 9)).toFixed(3) + " GB";
    } else if (size >= Math.pow(10, 6)) {
      return (size / Math.pow(10, 6)).toFixed(3) + " MB";
    } else {
      return (size / 1000).toFixed(3) + " KB";
    }
  }

  backClicked(): void {
    this.router.navigate(['/dashboard']);
  }

}

class InfoPair {
  constructor(public name: string, public value: string){}
}
