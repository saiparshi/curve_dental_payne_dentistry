import { Component, OnInit } from '@angular/core';
import { Patient } from './patient.model';
import { ActivatedRoute, Router } from '@angular/router';
import { faEdit, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'drp-patient-detail',
  templateUrl: './patient-detail.component.html',
  styles: [`
    fa-icon { cursor: pointer; color: rgba(255, 255, 255, 0.75); }
    fa-icon:hover { color: #fff }
  `]
})
export class PatientDetailComponent implements OnInit {
  editIcon: IconDefinition;
  patient: Patient;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.editIcon = faEdit;
  }

  ngOnInit(): void {
    this.route.data.forEach(data => {
      this.patient = data['patient'];
    });
  }

  edit(): void {
    this.router.navigate(['/patients', this.patient.id, 'edit']);
  }
}
