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
    InputTextModule,
    PaginatorModule,
    MultiSelectModule,
    DialogModule,
    ButtonModule,
    YouthSignupDetailsComponent,
    DetailsEmployerComponent
  ],
  providers: [YouthServiceService],
  templateUrl: './smart-table.component.html',
  styleUrl: './smart-table.component.css',
})
export class SmartTableComponent implements OnInit {
  @Input() status: string | undefined;
  @Input() fetchedData: string | undefined;

  youthList: any[] = [];
  employerList: any[] = [];
  cols: Column[] = [];
  _selectedColumns: Column[] = [];
  savedColumns: Column[] = [];
  paginatedProducts: any[] = [];
  rowsPerPage = 10;
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
    'signature',
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
    private lookupService: LookupService
  ) {}

  ngOnInit(): void {
    this.loadSelectedColumnsFromLocalStorage();

    console.log(this.savedColumns);
    if (this.fetchedData == 'employer') {
      this.fetchEmployerData();
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
  resetSelectedColumns() {
    localStorage.removeItem('selectedColumns');
    if (this.fetchedData == 'employer') {
      this.fetchEmployerData();
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
            this.selectedAreas.includes(item.area.name);
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
            this.selectedAreas.includes(item.area.name);
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

  getActionsForRow(status: string): string[] {
    // Return different actions based on the row's status
    switch (status) {
      case 'accepted':
        return ['view', 'pend'];
      case 'rejected':
        return ['view', 'pend'];
      case 'pending':
        return ['view', 'accept', 'reject', 'notes'];
      case 'waiting':
        return ['view', 'accept', 'reject', 'pend'];
      default:
        return ['view', 'delete'];
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

  paginate(event: any): void {
    const { first, rows } = event;
    this.paginatedProducts = this.youthList.slice(first, first + rows);
  }

  visible: boolean = false;
  dialogVisible: boolean = false; // To show/hide the dialog
  noteDialogVisible: boolean = false; // To show/hide the dialog

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
  showDialog(youthId: number): void {
    this.selectedYouthId = youthId; // Pass the selected youth ID
    this.dialogVisible = true;
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

  displayNoteDialog(youth: any): void {
    this.selectedYouth = youth;
    this.fetchNotesById(youth.id); // Fetch notes when opening the dialog
  }
}
