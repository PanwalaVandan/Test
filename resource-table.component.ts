import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from '../../services/resource.service';

interface DropdownOption {
  label: string;
  value: string;
}
type DropdownMap = Record<string, DropdownOption[]>;

export interface ResourceRecord {
  // … all your existing fields …
  division: string;
  subDivisionPillarName: string;
  // …
  functionalTitle: string;
  // rest unchanged…
}

@Component({
  selector: 'app-resource-table',
  templateUrl: './resource-table.component.html',
  styleUrls: ['./resource-table.component.scss']
})
export class ResourceTableComponent implements OnInit {
  // … existing declarations …
  filterForm!: FormGroup;
  modalForm!: FormGroup;
  showFilterPanel = false;
  isVisible = false;
  isEdit = false;

  // Holds the dropdown options loaded from JSON
  dropdownOptions: DropdownMap = {};

  // Mark which fields are selects
  modalFields = [
    { controlName: 'division',             label: 'Division',                fieldType: 'select' },
    { controlName: 'subDivisionPillarName',label: 'Sub Division/ Pillar Name',fieldType: 'select' },
    { controlName: 'productFunctionArea',  label: 'Product Function Area',    fieldType: 'input'  },
    { controlName: 'pillarHead',           label: 'Pillar Head',             fieldType: 'input'  },
    { controlName: 'hrId',                 label: 'HR Id',                   fieldType: 'input',   type: 'number' },
    { controlName: 'userId',               label: 'User Id',                 fieldType: 'input'  },
    { controlName: 'resourceName',         label: 'Resource Name',           fieldType: 'input'  },
    { controlName: 'positionId',           label: 'Position ID',             fieldType: 'input'  },
    { controlName: 'employeeType',         label: 'Employee Type',           fieldType: 'select' },
    { controlName: 'lastHireDate',         label: 'Last Hire Date',          fieldType: 'input',   type: 'date' },
    { controlName: 'termDate',             label: 'Term Date',               fieldType: 'input',   type: 'date' },
    { controlName: 'serviceBand',          label: 'Service Band',            fieldType: 'input'  },
    { controlName: 'costCode',             label: 'Cost Code',               fieldType: 'input'  },
    { controlName: 'ppmProject',           label: 'PPM Project',             fieldType: 'input'  },
    { controlName: 'region',               label: 'Region',                  fieldType: 'select' },
    { controlName: 'corporateTitle',       label: 'Corporate Title',         fieldType: 'select' },
    { controlName: 'jobCode',              label: 'Job Code',                fieldType: 'input'  },
    { controlName: 'functionalTitle',      label: 'Functional Title',        fieldType: 'select' },
    // … missing ones
    { controlName: 'employeeEmailAddress',       label: 'Employee Email Address',  fieldType: 'input',   type: 'email' },
  { controlName: 'supervisorId',               label: 'Supervisor Id',           fieldType: 'input',   type: 'number' },
  { controlName: 'supervisorName',             label: 'Supervisor Name',         fieldType: 'input'  },
  { controlName: 'supervisorEmailAddress',     label: 'Supervisor Email Address',fieldType: 'input',   type: 'email' },
  { controlName: 'secondaryManagerId',         label: 'Secondary Manager ID',     fieldType: 'input'  },
  { controlName: 'secondaryManagerName',       label: 'Secondary Manager Name',   fieldType: 'input'  },
  { controlName: 'secondaryManagerEmailAddress',label: 'Secondary Manager Email Address',fieldType: 'input', type: 'email' },
  { controlName: 'vendorTypeMod',              label: 'Vendor Type Mod',         fieldType: 'input'  },
  { controlName: 'provider',                   label: 'Provider',                fieldType: 'input'  },
  { controlName: 'month',                      label: 'Month',                   fieldType: 'input'  }
  ];

  constructor(
    private fb: FormBuilder,
    private resourceService: ResourceService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // 1) Load dropdown definitions
    this.http.get<DropdownMap>('assets/dropdowns.json')
      .subscribe(opts => this.dropdownOptions = opts);

    // 2) Load table data
    this.resourceService.getAllDataOperation().subscribe(data => {
      this.listOfData = data;
      this.filterData();
    });

    // 3) Build reactive forms
    const fieldControls = this.modalFields.reduce((acc, f) => ({
      ...acc,
      [f.controlName]: [ null ]
    }), {});
    this.modalForm = this.fb.group(fieldControls);

    const filterControls = this.modalFields.reduce((acc, f) => ({
      ...acc,
      [f.controlName]: [ '' ]
    }), {});
    this.filterForm = this.fb.group(filterControls);
  }

  // … keep your toggleFilters, applyFilters, resetFilters, filterData, showModal, handleOk, handleCancel methods exactly as before …
}
