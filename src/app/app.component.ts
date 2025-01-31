import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmployeeService } from './employee.service';
import { Employee } from './employee';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public employees: Employee[] = [];
  public employee!: Employee;
  public editEmployee?: Employee;
  public deleteEmployee?: Employee;

  private employeeService = inject(EmployeeService);

  ngOnInit(): void {
    this.getEmployees();
  }

  public getEmployees(): void {
    console.log('Fetching all employees...');
    this.employeeService.getEmployees().subscribe(
      (response: Employee[]) => {
        console.log(response);
        this.employees = response;
      },
      (error: HttpErrorResponse) => {
        console.error(error);
      }
    );
  }

  public searchEmployees(key: string): void {
    console.log('Searching employees...');
    const results: Employee[] = [];
    for (const employee of this.employees) {
      if (employee.name.toLowerCase().includes(key.toLowerCase()) ||
          employee.email.toLowerCase().includes(key.toLowerCase()) ||
          employee.phone.toLowerCase().includes(key.toLowerCase()) ||
          employee.jobTitle.toLowerCase().includes(key.toLowerCase())) {
        results.push(employee);
      }
    }
    this.employees = results;
    if (results.length === 0 || !key) {
      this.getEmployees();
    }
  }

  public onAddEmployee(employeeForm: NgForm): void {
    var addEmployeeForm = document.getElementById('add-employee-form');
    addEmployeeForm?.click();

    console.log('Adding employee...', employeeForm.value);
    this.employeeService.addEmployee(employeeForm.value).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
        employeeForm.reset();
      },
      (error: HttpErrorResponse) => {
        console.error(error);
        employeeForm.reset();
      }
    );
  }

  public onUpdateEmployee(employee: Employee): void {
    console.log(`Editing employee...`, employee);
    this.employeeService.updateEmployee(employee).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        console.error(error);
      }
    );
  }

  public onDeleteEmployee(employeeId: number): void {
    console.log(`Deleting employee by id: ${employeeId}`);
    this.employeeService.deleteEmployee(employeeId).subscribe(
      () => {
        console.log(`Employee deleted`);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        console.error(error);
      }
    );
  }

  public onOpenModal(employee: Employee | null, mode: string): void {
    const container = document.getElementById('main-container');
    if (container) {
      const button = document.createElement('button');
      button.type = 'button';
      button.style.display = 'none';
      button.setAttribute('data-toggle', 'modal');

      if (mode === 'add') {
        button.setAttribute('data-target', '#addEmployeeModal');
      }
      if (mode === 'edit' && employee) {
        this.editEmployee = employee;
        button.setAttribute('data-target', '#updateEmployeeModal');
      }
      if (mode === 'delete' && employee) {
        this.deleteEmployee = employee;
        button.setAttribute('data-target', '#deleteEmployeeModal');
      }
      container.appendChild(button);
      button.click();
    }
  }
}
