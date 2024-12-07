import { Component, OnInit } from '@angular/core';
import { HealthTip, HealthTipsService } from '../admin-services/health-tips.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-health-tips',
  templateUrl: './admin-health-tips.component.html',
  imports:[CommonModule]

})
export class AdminHealthTipsComponent implements OnInit {
  healthTips: HealthTip[] = [];

  constructor(private healthTipsService: HealthTipsService) { }

  ngOnInit(): void {
    this.loadHealthTips();
  }

  // Load all health tips from the API
  loadHealthTips() {
    this.healthTipsService.getHealthTips().subscribe(
      (data: HealthTip[]) => {
        this.healthTips = data;
        console.log('Fetched health tips:', data);
      },
      (error) => {
        console.error('Error fetching health tips:', error);
      }
    );
  }

  // Add a new health tip
  onAddHealthTip() {
    const newHealthTip: HealthTip = {
      TipId: 0,  // The backend will assign the ID
      TipTitle: 'New Health Tip',
      TipDescription: 'Description of the new health tip',
      HealthTipsimg: '',
      CategoryId: 1,
      CreatedByAdminId: 1
    };

    this.healthTipsService.addHealthTip(newHealthTip).subscribe(
      (healthTip) => {
        this.healthTips.push(healthTip);
        console.log('Added new health tip:', healthTip);
      },
      (error) => {
        console.error('Error adding health tip:', error);
      }
    );
  }

  // Edit an existing health tip
  onEditHealthTip(healthTip: HealthTip) {
    const updatedTitle = prompt('Enter new health tip title:', healthTip.TipTitle);
    const updatedDescription = prompt('Enter new description:', healthTip.TipDescription);

    if (updatedTitle && updatedDescription) {
      const updatedHealthTip: HealthTip = { 
        ...healthTip, 
        TipTitle: updatedTitle, 
        TipDescription: updatedDescription 
      };

      this.healthTipsService.updateHealthTip(healthTip.TipId, updatedHealthTip).subscribe(
        () => {
          const index = this.healthTips.findIndex(t => t.TipId === healthTip.TipId);
          if (index !== -1) {
            this.healthTips[index] = updatedHealthTip;
          }
        },
        (error) => {
          console.error('Error updating health tip:', error);
        }
      );
    }
  }

  // Delete a health tip
  onDeleteHealthTip(id: number) {
    const confirmDelete = confirm('Are you sure you want to delete this health tip?');
    if (confirmDelete) {
      this.healthTipsService.deleteHealthTip(id).subscribe(
        () => {
          this.healthTips = this.healthTips.filter(t => t.TipId !== id);
        },
        (error) => {
          console.error('Error deleting health tip:', error);
        }
      );
    }
  }
}
