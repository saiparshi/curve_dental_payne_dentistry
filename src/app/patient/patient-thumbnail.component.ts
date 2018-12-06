import { Component, Input } from '@angular/core';
import { Patient } from './patient.model';

@Component({
  selector: 'drp-patient-thumbnail',
  templateUrl: './patient-thumbnail.component.html',
  styles: [`
    .card { margin-bottom: 20px; }
  `]
})
export class PatientThumbnailComponent {
  @Input() patient: Patient;
}
