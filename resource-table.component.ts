import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from '../../services/resource.service';

interface DropdownOption { label: string; value: string; }
type DropdownMap = Record<string, DropdownOption[]>;

export interface ResourceRecord {
  division: string;
  subDivisionPillarName: string;
  productFunctionArea: string;
  pillarHead: string;
  hrId: number;
  userId: string;
  resourceName: string;
  positionId: string;
  employeeType: string;
  lastHireDate: Date;
  termDate: Date;
  serviceBand: string;
  costCode: string;
  ppmProject: string;
  region: string;
  corporateTitle: string;
  jobCode: string;
  functionalTitle: string;
  employeeEmailAddress: string;
  supervisorId: number;
  supervisorName: string;
  supervisorEmailAddress: string;
  secondaryManagerId: string;
  secondaryManagerName: string;
  secondaryManagerEmailAddress: string;
  vendorTypeMod: string;
  provider: string;
  month: string;
}

@Component({
  selector: 'app-resource-table',
  templateUrl: './resource-table.component.html',
  styleUrls: ['./resource-table.component.scss']
})
export class ResourceTableComponent implements OnInit {
  // data
  listOfData: ResourceRecord[] = [];
  listOfDisplayData: ResourceRecord[] = [];

  // forms
  filterForm!: FormGroup;
  modalForm!: FormGroup;

  // UI state
  viewMode: 'table' | 'cards' = 'table';
  showFilterPanel = false;
  isVisible = false;
  isEdit = false;

  // dropdowns
  dropdownOptions: DropdownMap = {};

  // field metadata
  requiredFields = new Set<string>([
    'division','subDivisionPillarName','productFunctionArea','pillarHead','hrId','userId',
    'resourceName','positionId','employeeType','lastHireDate','costCode','region',
    'corporateTitle','jobCode','functionalTitle','employeeEmailAddress','supervisorId',
    'supervisorName','supervisorEmailAddress','secondaryManagerId','secondaryManagerName',
    'secondaryManagerEmailAddress'
  ]);

  modalFields = [
    { controlName: 'division',              label: 'Division',                fieldType: 'select' },
    { controlName: 'subDivisionPillarName', label: 'Sub Division/ Pillar Name',fieldType: 'select' },
    { controlName: 'productFunctionArea',   label: 'Product Function Area',    fieldType: 'input'  },
    { controlName: 'pillarHead',            label: 'Pillar Head',             fieldType: 'input'  },
    { controlName: 'hrId',                  label: 'HR Id',                   fieldType: 'input', type: 'number' },
    { controlName: 'userId',                label: 'User Id',                 fieldType: 'input'  },
    { controlName: 'resourceName',          label: 'Resource Name',           fieldType: 'input'  },
    { controlName: 'positionId',            label: 'Position ID',             fieldType: 'input'  },
    { controlName: 'employeeType',          label: 'Employee Type',           fieldType: 'select' },
    { controlName: 'lastHireDate',          label: 'Last Hire Date',          fieldType: 'input', type: 'date'   },
    { controlName: 'termDate',              label: 'Term Date',               fieldType: 'input', type: 'date'   },
    { controlName: 'serviceBand',           label: 'Service Band',            fieldType: 'input'  },
    { controlName: 'costCode',              label: 'Cost Code',               fieldType: 'input'  },
    { controlName: 'ppmProject',            label: 'PPM Project',             fieldType: 'input'  },
    { controlName: 'region',                label: 'Region',                  fieldType: 'select' },
    { controlName: 'corporateTitle',        label: 'Corporate Title',         fieldType: 'select' },
    { controlName: 'jobCode',               label: 'Job Code',                fieldType: 'input'  },
    { controlName: 'functionalTitle',       label: 'Functional Title',        fieldType: 'select' },
    { controlName: 'employeeEmailAddress',  label: 'Employee Email Address',  fieldType: 'input', type: 'email' },
    { controlName: 'supervisorId',          label: 'Supervisor Id',           fieldType: 'input', type: 'number' },
    { controlName: 'supervisorName',        label: 'Supervisor Name',         fieldType: 'input'  },
    { controlName: 'supervisorEmailAddress',label: 'Supervisor Email Address',fieldType: 'input', type: 'email' },
    { controlName: 'secondaryManagerId',    label: 'Secondary Manager ID',     fieldType: 'input'  },
    { controlName: 'secondaryManagerName',  label: 'Secondary Manager Name',   fieldType: 'input'  },
    { controlName: 'secondaryManagerEmailAddress',label: 'Secondary Manager Email Address',fieldType: 'input', type: 'email' },
    { controlName: 'vendorTypeMod',         label: 'Vendor Type Mod',         fieldType: 'input'  },
    { controlName: 'provider',              label: 'Provider',                fieldType: 'input'  },
    { controlName: 'month',                 label: 'Month',                   fieldType: 'input'  }
  ];

  // grouping for cards
  profileFields = [
    'division','subDivisionPillarName','productFunctionArea','pillarHead',
    'hrId','userId','resourceName','positionId'
  ];
  jobFields = [
    'employeeType','lastHireDate','termDate','serviceBand','costCode',
    'ppmProject','region','corporateTitle','jobCode','functionalTitle'
  ];
  managerFields = [
    'employeeEmailAddress','supervisorId','supervisorName','supervisorEmailAddress',
    'secondaryManagerId','secondaryManagerName','secondaryManagerEmailAddress',
    'vendorTypeMod','provider','month'
  ];

  constructor(
    private fb: FormBuilder,
    private resourceService: ResourceService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // load dropdowns
    this.http.get<DropdownMap>('assets/dropdowns.json')
      .subscribe(opts => this.dropdownOptions = opts);

    // load data
    this.resourceService.getAllDataOperation()
      .subscribe(data => {
        this.listOfData = data;
        this.filterData();
      });

    // build modal form
    const modalCtrls = this.modalFields.reduce((acc, f) => {
      acc[f.controlName] = [
        null,
        this.requiredFields.has(f.controlName) ? Validators.required : []
      ];
      return acc;
    }, {} as any);
    this.modalForm = this.fb.group(modalCtrls);

    // build filter form
    const filterCtrls = this.modalFields.reduce((acc, f) => {
      acc[f.controlName] = [''];
      return acc;
    }, {} as any);
    this.filterForm = this.fb.group(filterCtrls);
  }

  // utility to get a field’s label
  getLabel(key: string): string {
    return this.modalFields.find(f => f.controlName === key)?.label ?? key;
  }

  // view toggle
  setView(mode: 'table'|'cards') {
    this.viewMode = mode;
  }

  // filter handlers unchanged…
  toggleFilters() { this.showFilterPanel = !this.showFilterPanel; }
  applyFilters()  { /* … */ }
  resetFilters()  { /* … */ }
  filterData()    { /* … */ }

  // modal handlers unchanged…
  showModal(edit = false, data?: ResourceRecord) { /* … */ }
  handleOk()     { /* … */ }
  handleCancel() { this.isVisible = false; }
}
