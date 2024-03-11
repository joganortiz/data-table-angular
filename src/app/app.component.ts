import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ColumnsInterface, TableComponent } from './components/table/table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'datatable';
  loading = true;
  
  ngOnInit(): void {
    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }


  get Columns(): ColumnsInterface[] {
    return [
      { field: 'name', name: 'Name', aling: 'center', sorting: true },
      { field: 'description', name: 'Description', sorting: true },
      { field: 'created', name: 'Created' },
      { field: 'status', name: 'Status' },
    ];
  }

  get RolesList() {
    return [
      {
        name: 1,
        description: "role 1 description",
        created: "2022-01-01",
        status: "1"
      },
      {
        name: 2,
        description: "role 2 description",
        created: "2022-01-01",
        status: "1"
      },
      {
        name: 3,
        description: "role 3 description",
        created: "2022-01-01",
        status: "1"
      },
      {
        name: 4,
        description: "role 4 description",
        created: "2022-01-01",
        status: "1"
      },
      {
        name: 5,
        description: "role 5 description",
        created: "2022-01-01",
        status: "1"
      }
      ,{
        name: 6,
        description: "role 6 description",
        created: "2022-01-01",
        status: "1"
      }
      ,{
        name: 7,
        description: "role 7 description",
        created: "2022-01-01",
        status: "1"
      },{
        name: 8,
        description: "role 8 description",
        created: "2022-01-01",
        status: "1"
      },{
        name: 9,
        description: "role 9 description",
        created: "2022-01-01",
        status: "1"
      },
      {
        name: 10,
        description: "role 10 prueba",
        created: "2022-01-01",
        status: "1"
      },
      {
        name: 11,
        description: "role 11 prueba",
        created: "2022-01-01",
        status: "1"
      },
      {
        name: 12,
        description: "role 12 prueba",
        created: "2022-01-01",
        status: "1"
      },
      {
        name: 13,
        description: "role 13 prueba",
        created: "2022-01-01",
        status: "1"
      },
      {
        name: 14,
        description: "role 14 prueba",
        created: "2022-01-01",
        status: "1"
      },
      {
        name: 15,
        description: "role 15 prueba",
        created: "2022-01-01",
        status: "1"
      },
    ];
  }
}
