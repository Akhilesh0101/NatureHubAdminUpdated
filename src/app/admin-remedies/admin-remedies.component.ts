import { Component, OnInit } from '@angular/core';
import { Remedy, RemedyService } from '../admin-services/remedy.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-remedies',
  templateUrl: './admin-remedies.component.html',
  imports:[CommonModule],
  styleUrls: ['./admin-remedies.component.css']
})
export class AdminRemediesComponent implements OnInit {
  remedies: Remedy[] = [];

  constructor(private remedyService: RemedyService) { }

  ngOnInit(): void {
    this.loadRemedies();
  }

  // Load all remedies from API
  loadRemedies() {
    this.remedyService.getRemedies().subscribe(
      (data: Remedy[]) => {
        this.remedies = data;
        console.log('Fetched remedies:', data);
      },
      (error) => {
        console.error('Error fetching remedies:', error);
      }
    );
  }

  // Add new remedy
  onAddRemedy() {
    const newRemedy: Remedy = {
      RemedyId: 0,  // Backend will assign this ID
      RemedyName: 'New Remedy',
      Remediesimg: '',
      Description: 'Description of new remedy',
      Benefits: '',
      PreparationMethod: '',
      UsageInstructions: '',
      CategoryId: 1,
      CreatedByAdminId: 1
    };

    this.remedyService.addRemedy(newRemedy).subscribe(
      (remedy) => {
        this.remedies.push(remedy);
        console.log('Added new remedy:', remedy);
      },
      (error) => {
        console.error('Error adding remedy:', error);
      }
    );
  }

  // Edit a remedy
  onEditRemedy(remedy: Remedy) {
    const updatedName = prompt('Enter new remedy name:', remedy.RemedyName);
    const updatedDescription = prompt('Enter new description:', remedy.Description);

    if (updatedName && updatedDescription) {
      const updatedRemedy: Remedy = { ...remedy, RemedyName: updatedName, Description: updatedDescription };

      this.remedyService.updateRemedy(remedy.RemedyId, updatedRemedy).subscribe(
        () => {
          const index = this.remedies.findIndex(r => r.RemedyId === remedy.RemedyId);
          if (index !== -1) {
            this.remedies[index] = updatedRemedy;
          }
        },
        (error) => {
          console.error('Error updating remedy:', error);
        }
      );
    }
  }

  // Delete a remedy
  onDeleteRemedy(id: number) {
    const confirmDelete = confirm('Are you sure you want to delete this remedy?');
    if (confirmDelete) {
      this.remedyService.deleteRemedy(id).subscribe(
        () => {
          this.remedies = this.remedies.filter(r => r.RemedyId !== id);
        },
        (error) => {
          console.error('Error deleting remedy:', error);
        }
      );
    }
  }
}
