import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sounds',
  templateUrl: './sounds.component.html',
  styleUrls: ['./sounds.component.scss'],
})
export class SoundsComponent implements OnInit {
  inputFields = [true];

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngOnInit(): void {}

  onAddInput() {
    this.inputFields.push(true);
    this.changeDetector.detectChanges();
  }

  onDelete(index: string) {
    this.inputFields.splice(+index, 1);
  }
}
