import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { MultiSelectModule } from 'primeng/multiselect';
import { DialogModule } from 'primeng/dialog';
import { YouthServiceService } from '../../Services/YouthService/youth-service.service';
import { ButtonModule } from 'primeng/button';
import { LookupService } from '../../Services/LookUpService/lookup.service';
import { YouthSignupDetailsComponent } from '../../Youth/Details-Youth/Detailsyouth.component';
import { EmployerService } from '../../Services/employer-service/employer-services.service';
import { DetailsEmployerComponent } from '../../Employer/Details-Employer/details-employer.component';
import { JobRequestService } from '../../Services/JobRequestService/job-request-service.service';
import { Job } from '../../Model/JobDetails';
import { JobRequestDetailsComponent } from '../../Employer/JobRequestDetails/job-request-details.component';
import { CheckboxModule } from 'primeng/checkbox';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-smart-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    TableModule,
    CheckboxModule,
    InputTextModule,
    PaginatorModule,
    MultiSelectModule,
    DialogModule,
    ButtonModule,
    YouthSignupDetailsComponent,
    DetailsEmployerComponent,
    JobRequestDetailsComponent,
  ],
  providers: [YouthServiceService],
  templateUrl: './smart-table.component.html',
  styleUrl: './smart-table.component.css',
})
export class SmartTableComponent implements OnInit {
  @Input() status: string | undefined;
  @Input() active: boolean | undefined;
  @Input() fetchedData: string | undefined;
  youthsNotes: { name: string; notes: string }[] = [];
  youthDialogVisible = false; // Controls dialog visibility
  assignedYouthDialogVisible=false;
  youths: any[] = []; // Stores fetched youths
  selectedYouths: any[] = []; // Selected youths for assignment
  assignedYouths: any[] = []; // Youths fetched from the backend
  unassignedYouths: any[] = []; // Youths fetched from the backend
  activeTab:string=''
  combinedYouths: any[] = []; // Combination of assigned and selected
  selectedJob: string = '';
  currentEmployerId: string = '';
  currentJob: string = ''; // Stores the current job being ass
  youthList: any[] = [];
  assignedYouthList: any[] = [];
  employerList: any[] = [];
  employerDialogVisible = false;
  jobRequestDialogVisible = false;
  youthSignupDialogVisible = false;
  cols: Column[] = [];
  _selectedColumns: Column[] = [];
  savedColumns: Column[] = [];
  paginatedProducts: any[] = [];
  rowsPerPage = 10;
  jobs: Job[] = [];
  selectedGender: string[] = [];
  rowData: any = {}; // Or use the appropriate type for your data
  areas: any[] = [];
  majors: string[] = [];
  genders: string[] = [];
  educationLevels: string[] = [];
  selectedMajors: string[] = []; // Define selectedMajors
  selectedAreas: string[] = []; // Define selectedMajors
  selectedEducationLevels: string[] = []; // Define selectedMajors
  nationalityOptions: string[] = [];
  selectedNationalities: string[] = [];
  excludedColumns: string[] = [
    'active',
    'assignedYouths',
    'signature',
    'registrationStatus',
    'emergencyPhone',
    'emergencyRelation',
    'jobOpportunitySource',
    'employmentOpportunities',
    'aboutYourself',
    'placedByKfw',
    'kfwYear',
    'innovationLabGraduate',
    'innovationLabGradtype',
    'employed',
    'isPrcsVolunteer',
    'isFireBrigadesVolunteer',
    'isAlShifaaVolunteer',
    'disability',
    'disabilityTypes',
    'disabilitySupport',
    'notes',
    'role',
    'id',
    'headfa',
    'question2',
    'status',
    'confirmation',
    'arabic',
    'english',
    'french',
    'trainings',
    'coverLetter',
    'identityCard',
    'registrationCard',
    'degree',
    'experienceDetails',
    'experiences',
    'requiredDocuments',
    'seekingEmploymentDuration',
    'trainingsAndSkills',
    'password',
    'confirmPassword',
    'cv',
    'alShifaaProof',
    'fireProof',
    'prcsProof',
  ];
  filteredCols: Column[] = []; // New array to hold filtered columns

  constructor(
    private youthService: YouthServiceService,
    private employerService: EmployerService,
    private JobRequestService: JobRequestService,
    private lookupService: LookupService
  ) {}

  ngOnInit(): void {
    this.loadSelectedColumnsFromLocalStorage();
    this.setActiveTabFromLocalStorage();

    console.log(this.savedColumns);
    if (this.fetchedData == 'employer') {
      this.fetchEmployerData();
    } else if (this.fetchedData == 'job-request') {
      this.fetchJobRequests();
    } else {
      this.fetchYouthData();
    }
    this.lookupService.getLookupData().subscribe(
      (data) => {
        console.log('Lookup Data:', data); // Log the entire response

        this.areas = data.areas || [];
        this.majors = data.majors || [];
        this.genders = data.genderOptions || [];
        this.educationLevels = data.educationLevels || [];
        this.nationalityOptions = data.nationalityOptions || [];

        console.log('Areas:', this.areas);
        console.log('Majors:', this.majors);
        console.log('Genders:', this.genders);
        console.log('educationLevels:', this.educationLevels);
        console.log('nationalityOptions:', this.nationalityOptions);
      },
      (error) => {
        console.error('Error fetching lookup data:', error);
      }
    );
  }

  setActiveTabFromLocalStorage(): void {
    const activeTab = localStorage.getItem('activeTab');
    if (activeTab) {
      // Set the status based on the active tab
      this.activeTab = activeTab;
    }
  }
  resetSelectedColumns() {
    localStorage.removeItem('selectedColumns');
    if (this.fetchedData == 'employer') {
      this.fetchEmployerData();
    } else if (this.fetchedData == 'job-request') {
      this.fetchJobRequests();
    } else {
      this.fetchYouthData();
    }
  }
  loadSelectedColumnsFromLocalStorage() {
    const storedColumns = JSON.parse(
      localStorage.getItem('selectedColumns') || '[]'
    );
    if (storedColumns.length) {
      this.cols = storedColumns;
    }
  }

  saveSelectedColumnsToLocalStorage() {
    localStorage.setItem('selectedColumns', JSON.stringify(this.cols));
  }
  fetchYouthData(): void {
    this.youthService.getAllYouth().subscribe(
      (data: any[]) => {
        console.log('Fetched Youth Data:', data);

        // Step 1: Filter by `status` if provided
        let filteredData = this.status
          ? data.filter((item) => item.status === this.status)
          : data;

        // Step 2: Apply filters for gender, major, and area
        filteredData = filteredData.filter((item) => {
          const matchesGender =
            this.selectedGender.length === 0 ||
            this.selectedGender.includes(item.gender);
          const matchesMajor =
            this.selectedMajors.length === 0 ||
            this.selectedMajors.includes(item.major);
          const matchesArea =
            this.selectedAreas.length === 0 ||
            this.selectedAreas.includes(item.area);
          const matchesEducationLevels =
            this.selectedEducationLevels.length === 0 ||
            this.selectedEducationLevels.includes(item.educationLevels);
          const matchesNationalityOptions =
            this.selectedNationalities.length === 0 ||
            this.selectedNationalities.includes(item.nationalityOptions);

          return (
            matchesGender &&
            matchesMajor &&
            matchesArea &&
            matchesEducationLevels &&
            matchesNationalityOptions
          );
        });

        // Step 3: Configure columns dynamically if filtered data is available
        if (filteredData.length > 0) {
          // Exclude unwanted columns
          const filteredColumns = Object.keys(filteredData[0]).filter(
            (key) => !this.excludedColumns.includes(key)
          );

          // Map filtered columns to the format expected by PrimeNG
          this.cols = filteredColumns.map((key) => ({
            field: key,
            header: this.capitalize(key),
          }));
          const savedColumns = localStorage.getItem('selectedColumns');
          if (savedColumns) {
            this._selectedColumns = JSON.parse(savedColumns);
            this.cols = [...this._selectedColumns]; // Synchronize `cols`
          } else {
            // Default to all columns if no saved state
            this._selectedColumns = this.cols;
            this.cols = [...this._selectedColumns];
          }

          // Initialize _selectedColumns with all columns except "Action"
          if (this.savedColumns) {
            this.savedColumns = this.cols;
          } else {
            this._selectedColumns = this.cols;
          }
        }

        // Step 4: Update youth list and paginated products
        this.youthList = filteredData;
        this.paginatedProducts = this.youthList.slice(0, this.rowsPerPage);
      },
      (error) => {
        console.error('Error fetching youth data:', error);
      }
    );
  }
  fetchEmployerData(): void {
    this.employerService.getAllEmployers().subscribe(
      (data: any[]) => {
        console.log('Fetched Employer Data:', data);

        // Step 1: Filter by `status` if `active` is provided
        let filteredData = this.active !== undefined
          ? data.filter((item) => item.active === this.active)
          : data;

        // Step 2: Configure columns dynamically if filtered data is available
        if (filteredData.length > 0) {
          // Exclude unwanted columns
          const filteredColumns = Object.keys(filteredData[0]).filter(
            (key) => !this.excludedColumns.includes(key)
          );

          // Map filtered columns to the format expected by PrimeNG
          this.cols = filteredColumns.map((key) => ({
            field: key,
            header: this.capitalize(key),
          }));
          const savedColumns = localStorage.getItem('selectedColumns');
          if (savedColumns) {
            this._selectedColumns = JSON.parse(savedColumns);
            this.cols = [...this._selectedColumns]; // Synchronize `cols`
          } else {
            // Default to all columns if no saved state
            this._selectedColumns = this.cols;
            this.cols = [...this._selectedColumns];
          }

          // Initialize _selectedColumns with all columns except "Action"
          if (this.savedColumns) {
            this.savedColumns = this.cols;
          } else {
            this._selectedColumns = this.cols;
          }
        }

        // Step 3: Update youth list and paginated products
        this.employerList = filteredData;
        this.paginatedProducts = this.employerList.slice(0, this.rowsPerPage);
      },
      (error) => {
        console.error('Error fetching employer data:', error);
      }
    );
  }


  fetchJobRequests(): void {
    this.JobRequestService.getAllJobs().subscribe(
      (data: any[]) => {
        console.log('Fetched Employer Data:', data);

        // Step 1: Filter by `status` if provided
        let filteredData = this.status
          ? data.filter((item) => item.status === this.status)
          : data;
        // Step 3: Configure columns dynamically if filtered data is available
        if (filteredData.length > 0) {
          // Exclude unwanted columns
          const filteredColumns = Object.keys(filteredData[0]).filter(
            (key) => !this.excludedColumns.includes(key)
          );

          // Map filtered columns to the format expected by PrimeNG
          this.cols = filteredColumns.map((key) => ({
            field: key,
            header: this.capitalize(key),
          }));
          const savedColumns = localStorage.getItem('selectedColumns');
          if (savedColumns) {
            this._selectedColumns = JSON.parse(savedColumns);
            this.cols = [...this._selectedColumns]; // Synchronize `cols`
          } else {
            // Default to all columns if no saved state
            this._selectedColumns = this.cols;
            this.cols = [...this._selectedColumns];
          }

          // Initialize _selectedColumns with all columns except "Action"
          if (this.savedColumns) {
            this.savedColumns = this.cols;
          } else {
            this._selectedColumns = this.cols;
          }
        }

        // Step 4: Update youth list and paginated products
        this.employerList = filteredData;
        this.paginatedProducts = this.employerList.slice(0, this.rowsPerPage);
      },
      (error) => {
        console.error('Error fetching youth data:', error);
      }
    );
  }
  onColumnChange(selectedColumns: Column[]): void {
    this.selectedColumns = selectedColumns;
  }

  set selectedColumns(columns: Column[]) {
    this._selectedColumns = columns;
    this.saveSelectedColumnsToLocalStorage(); // Ensure the columns are saved
  }

  get selectedColumns(): Column[] {
    return this._selectedColumns;
  }

  capitalize(str: string): string {
    return (
      str.charAt(0).toUpperCase() + str.slice(1).replace(/([A-Z])/g, ' $1')
    );
  }

  getActionsForRow(status: string ,active:boolean): string[] {
    // Return different actions based on the row's status
    if(active==true){
      return ['view','deactivate']
    }else if(active==false){
      return ['view','activate']

    }else{

    switch (status) {
      case 'accepted':
        return ['view', 'pend'];
      case 'rejected':
        return ['view', 'pend'];
      case 'pending':
        return ['view', 'accept', 'reject', 'notes'];
      case 'waiting':
        return ['view', 'accept', 'reject', 'pend'];
      case 'waiting-E':
        return ['view', 'assign', 'reject'];
      case 'assigned':
        return ['view', 'assign'];
      default:
        return ['view', 'delete'];
    }
  }

  }

  performAction(action: string, item: any): void {
    if (action === 'view') {
      console.log('View action for:', item);
    } else if (action === 'pend') {
      this.updateStatus(item.id, 'pending');
    } else if (action === 'accept') {
      this.updateStatus(item.id, 'accepted');
    } else if (action === 'reject') {
      this.updateStatus(item.id, 'rejected');
    }
  }

  note: string = '';
  selectedYouth: any;
  showNoteDialog(youth: any): void {
    this.selectedYouth = youth;
    this.note = youth.note || ''; // If there's an existing note, pre-fill the input
    this.noteDialogVisible = true;
  }

  //youth dialog
  youthDialog: boolean = false;

  updateStatus(id: number, newStatus: string): void {
    this.youthService.updateYouthStatus(id, newStatus).subscribe(
      (response) => {
        console.log(`Status updated to ${newStatus} for youth with ID: ${id}`);

        // Re-fetch the data to reflect changes
        this.fetchYouthData();
      },
      (error) => {
        console.error('Error updating status:', error);
      }
    );
  }

  updateActiveStatus(id: string, isActive: boolean): void {
    this.employerService.updateActiveStatus(id, isActive).subscribe(
      (response) => {
        console.log(`Active status updated to ${isActive} for youth with ID: ${id}`);

        // Re-fetch the data to reflect changes
        this.fetchEmployerData();
      },
      (error) => {
        console.error('Error updating active status:', error);
      }
    );
  }
  paginate(event: any): void {
    const { first, rows } = event;
    this.paginatedProducts = this.youthList.slice(first, first + rows);
  }

  visible: boolean = false;
  dialogVisible: boolean = false; // To show/hide the dialog
  noteDialogVisible: boolean = false; // To show/hide the dialog
  noYouthMessage: string = '';
  loadLookupData(): void {
    this.lookupService.getLookupData().subscribe((data) => {
      this.areas = data.areas || [];
      this.majors = data.majors || [];
      this.genders = data.genderOptions || [];
      this.educationLevels = data.educationLevels || [];
      this.nationalityOptions = data.nationalityOptions || [];
    });
  }
  selectedYouthId: number | null = null;
  showDialog(youthId: number, activeTab: string): void {
    this.selectedYouthId = youthId; 
  
    // Reset all dialog visibility states
    this.employerDialogVisible = false;
    this.jobRequestDialogVisible = false;
    this.youthSignupDialogVisible = false;
  
    // Show the appropriate dialog based on the active tab
    switch (activeTab) {
      case 'employer':
        this.employerDialogVisible = true;
        break;
      case 'job-request':
        this.jobRequestDialogVisible = true;
        break;
      case 'youthsignup':
        this.youthSignupDialogVisible = true;
        break;
    }
  }
  
  clearSelectedYouthId(): void {
    this.selectedYouthId = null; // Reset when dialog is closed
  }

  updateNotes(youthId: number, newNotes: string): void {
    // Check if new notes are not empty
    if (newNotes.trim()) {
      // Call the service to update notes for the specific youth
      this.youthService.updateYouthNotes(youthId, newNotes).subscribe(
        (response) => {
          console.log(`Notes updated for youth with ID: ${youthId}`);
          // Re-fetch the data to reflect the updated notes
          this.fetchYouthData();
          this.updateStatus(youthId, 'pending');
        },
        (error) => {
          console.error('Error updating notes:', error);
        }
      );
    } else {
      console.warn('Notes cannot be empty');
    }
  }
  fetchNotesById(youthId: number): void {
    this.youthService.getYouthNotesById(youthId).subscribe(
      (response) => {
        console.log(`Notes for youth with ID ${youthId}:`, response.notes);

        // You can perform additional operations here, such as displaying the notes in a dialog
        this.note = response.notes || ''; // If a note exists, store it for display
        this.noteDialogVisible = true; // Open the dialog to show the note
      },
      (error) => {
        console.error('Error fetching notes:', error);
      }
    );
  }
  fetchYouthByJob(jobs: string[]): void {
    // Join jobs into a comma-separated string to pass in the URL
    const jobsQuery = jobs.join(',');

    // Call the service to fetch youth based on jobs array
    this.youthService.getYouthByJob(jobsQuery).subscribe(
      (response) => {
        console.log(`Jobs: ${jobs}`, response);

        // Check if response has youths and handle accordingly
        if (response.youths && response.youths.length > 0) {
          // If youths are found, process them and display notes
          this.youthsNotes = response.youths.map((youth: any) => {
            return {
              name: youth.name,
              notes: youth.notes || '', // Default to empty if no notes available
            };
          });
          this.noYouthMessage = ''; // Reset the message if youths are found
        } else {
          // If no youths are found, set an error message
          this.noYouthMessage = 'No youth for this job yet.';
        }

        // Always open the dialog
        this.noteDialogVisible = true;
      },
      (error) => {
        console.error('Error fetching youths:', error);
        // If there was an error, set the error message
        this.noYouthMessage = 'Error fetching youths.';
        this.noteDialogVisible = true; // Show error message in the dialog
      }
    );
  }

  displayNoteDialog(youth: any): void {
    this.selectedYouth = youth;
    this.fetchNotesById(youth.id); // Fetch notes when opening the dialog
  }

  showYouthDialog(job: string, selectedJob: string): void {
    this.selectedJob = selectedJob;
    this.currentJob = job; // Store the current job being assigned
    this.selectedYouths = []; // Reset selectedYouths for this dialog
    this.youthService.getYouthByJob(job).subscribe({
      next: (response: any) => {
        console.log('Response from getYouthByJob:', response); // Log the response for debugging

        // Transform youths to include a label for display
        this.youths = (response.youths || []).map((youth: any) => ({
          id: youth.id,
          name: youth.name,
          beneficiary: youth.beneficiary,
          label: `${youth.name} (${youth.id})${
            youth.beneficiary ? ' ✅ (Beneficiary)' : ''
          }`, // Add icon and text if beneficiary
        }));

        console.log('Transformed youths array:', this.youths); // Log the transformed array
        this.youthDialogVisible = true; // Open the dialog
      },
      error: (error) => {
        console.error('Error fetching youths:', error);
      },
    });
  }
  assignYouthsToJob(): void {
    console.log('Employer:', this.selectedJob);
    console.log(
      'Selected Youths before assignment:',
      JSON.stringify(this.selectedYouths, null, 2)
    );

    const youthsAssigned = []; // Array to track successful assignments

    this.selectedYouths.forEach((youth: any) => {
      console.log(
        `Assigning Youth: ID=${youth.id}, Name=${youth.name}`
      );

      // Send only the youth ID to the backend; the backend will fetch the details
      this.JobRequestService.assignYouthToJobRequest(
        this.selectedJob,
        youth.id
      ).subscribe({
        next: () => {
          console.log(
            `Youth ${youth.name} (ID: ${youth.id}) assigned to job ${this.selectedJob}.`
          );

          // Update local state for assigned youths
          this.assignedYouths.push({
            id: youth.id,
            name: youth.name,
            beneficiary: youth.beneficiary,
            label: youth.label,
          });

          // Remove the youth from unassigned youths
          this.unassignedYouths = this.unassignedYouths.filter(
            (unassigned: any) => unassigned.id !== youth.id
          );

          youthsAssigned.push(youth); // Track successfully assigned youth

          // If all selected youths are assigned, optionally update the job status
          if (youthsAssigned.length === this.selectedYouths.length) {
            this.updateJobStatusToAssigned();
          }
        },
        error: (error) => {
          console.error(
            `Error assigning youth ${youth.name} (ID: ${youth.id}):`,
            error
          );
        },
      });
    });

    this.youthDialogVisible = false;
  }

  getAssignedYouths(jobId: string): void {
    this.JobRequestService.getAssignedYouthsByJobId(jobId).subscribe({
      next: (response: any) => {
        console.log('Assigned Youths Response:', response);

        // Transform the response into a format suitable for your UI
        this.assignedYouths = response.map((youth: any) => ({
          id: youth.id,
          name: youth.name,
          beneficiary: youth.beneficiary,
          label: `${youth.name} (${youth.id})${
            youth.beneficiary ? ' ✅ (Beneficiary)' : ''
          }`, // Add beneficiary indication
        }));

        console.log('Transformed Assigned Youths:', this.assignedYouths);
      },
      error: (error) => {
        console.error(
          `Error fetching assigned youths for job ${jobId}:`,
          error
        );
      },
    });
    this.assignedYouthDialogVisible = false;

  }
  showAssignedYouthDialog(jobName: string, job: string): void {
    this.currentJob = jobName; // Store the current job for context
    this.selectedJob=job
    this.selectedYouths = []; // Reset selectedYouths for this dialog

    this.youthService.getYouthByJob(jobName).subscribe({
      next: (allYouthsResponse: any) => {
        console.log('Response from getYouthByJob:', allYouthsResponse);

        // Format all youths
        const allYouths = (allYouthsResponse.youths || []).map((youth: any) => ({
          id: youth.id,
          name: youth.name || 'Unknown', // Fallback if name is missing
          beneficiary: youth.beneficiary || false, // Fallback for beneficiary
          label: `${youth.name || 'Unknown'} (${youth.id})${
            youth.beneficiary ? ' ✅ (Beneficiary)' : ''
          }`,
        }));

        console.log('Formatted All Youths:', allYouths);

        this.JobRequestService.getAssignedYouthsByJobId(job).subscribe({
          next: (assignedResponse: any) => {
            console.log('Response from getAssignedYouthsByJobId:', assignedResponse);

            // Format assigned youths
            const assignedYouths = (assignedResponse || []).map((youth: any) => ({
              id: youth.id,
              name: youth.firstName || 'Unknown', // Fallback if name is missing
              beneficiary: youth.beneficiary || false, // Fallback for beneficiary
              label: `${youth.firstName || 'Unknown'} (${youth.id})${
                youth.beneficiary ? ' ✅ (Beneficiary)' : ''
              }`,
            }));

            console.log('Formatted Assigned Youths:', assignedYouths);

            // Filter out assigned youths from all youths to get unassigned youths
            this.unassignedYouths = allYouths.filter(
              (youth: any) =>
                !assignedYouths.some((assigned: any) => assigned.id === youth.id)
            );

            this.assignedYouths = assignedYouths;

            console.log('Unassigned Youths:', this.unassignedYouths);
            console.log('Assigned Youths:', this.assignedYouths);

            this.assignedYouthDialogVisible = true;
          },
          error: (error) => {
            console.error('Error fetching assigned youths:', error);
          },
        });
      },
      error: (error) => {
        console.error('Error fetching all youths:', error);
      },
    });
  }

  unassignYouth(jobId: string, youthId: string): void {
    console.log(`Unassigning youth ID: ${youthId} from job ID: ${jobId}`);
    
    this.JobRequestService.unassignYouthFromJobRequest(jobId, youthId).subscribe({
      next: () => {
        console.log(`Successfully unassigned youth ID: ${youthId} from job ID: ${jobId}`);

        // Remove the youth from the assigned youths list
        this.assignedYouths = this.assignedYouths.filter(
          (youth: any) => youth.id !== youthId
        );

        // Add the youth back to the unassigned youths list
        const youth = this.assignedYouths.find((y: any) => y.id === youthId);
        if (youth) {
          this.unassignedYouths.push(youth);
        }

        console.log('Updated Assigned Youths:', this.assignedYouths);
        console.log('Updated Unassigned Youths:', this.unassignedYouths);
      },
      error: (error) => {
        console.error(
          `Error unassigning youth ID: ${youthId} from job ID: ${jobId}:`,
          error
        );
      },
    });
  }

  private updateJobStatusToAssigned(): void {
    this.JobRequestService.updateJobRequestStatus(
      this.selectedJob,
      'assigned'
    ).subscribe({
      next: () => {
        console.log(
          `Job request ${this.selectedJob} status updated to 'assigned'.`
        );
        this.fetchJobRequests();
      },
      error: (error) => {
        console.error(
          `Error updating job request ${this.selectedJob} status to 'assigned':`,
          error
        );
      },
    });
  }
}
