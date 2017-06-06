import { Component } from '@angular/core';
import { DateTime } from './shared/date-time/date-time';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';

  dateObjects: DateTime = new DateTime(2017, 6, 17);
  dObj: Date = new Date();

  ngOnInit(){
    let q:DateTime = new DateTime();
    let x = new DateTime(2017, 6, 6);
    let y = new DateTime(2017, 6, 1);
    let ts = x.subtractDate(y);
    console.log('> ng here!', ts.toString(), q);

  }
  
}
