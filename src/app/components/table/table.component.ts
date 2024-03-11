import { Component, OnInit, computed, input, signal } from '@angular/core';
import { of, switchMap, timer } from 'rxjs';

export interface ColumnsInterface {
  field: string;
  name: string;
  width?: string;
  sorting?: boolean;
  aling?: 'start'| 'center'| 'end';
}

interface ColumnsInterfaceDatatble extends ColumnsInterface {
  sort?: 'asc'|'desc'|'';
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent implements OnInit {
  // 
  public data             = input<any[]>([]);
  public columns          = input<ColumnsInterface[]>([]);
  public loading          = input<boolean>(false);
  public totalRecords     = input<number>(0);
  public row              = input<number>(10);
  public scrollY          = input<string>('');
  public lengthMenuRows   = input<number[]>([10, 25, 50]);
  public hiddeSearch      = input<boolean>(false);
  public hiddeLengthMenu  = input<boolean>(false);
  public serverSide       = input<boolean>(false);
  public paginator        = input<boolean>(false);

  //
  header            = signal<ColumnsInterfaceDatatble[]>([]);
  body              = signal<any[]>([]);
  bodyPage          = signal<any[]>([]);
  paginators        = signal<('...' | number)[]>([]);
  rowData           = signal<number>(10);
  page              = signal<number>(1);
  totalRecordsData  = computed(() => (this.serverSide() == true) ? this.totalRecords() : this.data().length );
  maxPage           = computed(() => Math.ceil((this.totalRecordsData()) / this.rowData()));
  initDataPage      = computed(() => ((this.page()-1) * this.rowData()));
  endDataPage       = computed(() => (this.page() * this.rowData()));
  textPage          = computed(() => `Showing ${this.initDataPage() + 1} to ${this.endDataPage() > this.totalRecordsData() ? this.totalRecordsData() : this.endDataPage()} of ${this.totalRecordsData()} entries`);

  timeout: any;

  ngOnInit(): void {
    this.header.set(this.columns());
    this.body.set(this.data());
    this.rowData.set(this.row());

    this.paginatorInit();
    this.dataValueTabe();
  }

  dataValueTabe():void {
    const init = this.initDataPage();
    const limit = this.endDataPage() - 1;

    this.bodyPage.set([]);
    for (let index = init; index < this.body().length; index++) {
      const element = this.body()[index];
      this.bodyPage.update(prev => [...prev, element]);

      if(index ==limit) break;
    }
  }

  paginatorInit(): void {
    this.paginators.set([]);
    if(this.maxPage() == 0) return;
    this.paginators.set([1]);  

    // when the pagination is not more than 8
    if(this.maxPage() < 8) {
      for (let index = 2; index <= this.maxPage(); index++) {
        this.paginators.update(prev => [...prev, index]);
      }
      return;
    }

    // when current page is less than 5
    if(this.page() < 5) {
      for (let index = 2; index <= 6; index++) {
        if(index == 6) {
          this.paginators.update(prev => [...prev, '...']);
        }else {
          this.paginators.update(prev => [...prev, index]);
        }
      }
      this.paginators.update(prev => [...prev, this.maxPage()]);
      return;
    }

    // when the active page is among the last 5
    if(this.page() > (this.maxPage() - 4) && this.page() <= this.maxPage()) {
      for (let index = (this.maxPage() - 5); index <= this.maxPage(); index++) {
        if(index == (this.maxPage() - 5)) {
          this.paginators.update(prev => [...prev, '...']);
        }else {
          this.paginators.update(prev => [...prev, index]);
        }
      }
      return;
    }

    // when the active page is in the middle
    this.paginators.update(prev => [...prev, '...', this.page() - 1, this.page(), this.page() + 1, '...', this.maxPage()]);
  }

  changeNextPage(): void {
    if(this.page() == this.maxPage()) return;
    this.page.update(prev => prev + 1);
    this.paginatorInit();

    // update data
    this.dataValueTabe();
  }

  changePreviousPage(): void {
    if(this.page() <= 1) return;

    this.page.update(prev => prev - 1);
    this.paginatorInit();

    // update data
    this.dataValueTabe();
  }

  changePage(paginator: number): void {
    if(this.page() == paginator) return;

    this.page.update(prev => prev = paginator);
    this.paginatorInit();

    // update data
    this.dataValueTabe();
  }

  changeOnSort(field: string, key: number) {
    let sortHeader : "" | "asc" | "desc" = "";
    this.header.update(prev => {
      for (let index = 0; index < prev.length; index++) {
        if(index == key) {
          sortHeader = ((prev[index].sort == 'asc') ? 'desc' : 'asc') ;
          prev[index].sort = sortHeader; 
          continue;
        }
        prev[index].sort = '';
      }

      return prev;
    });

    this.body.update(prev => {
      prev.sort((a, b) => {
        const nameA = (typeof a[field] == "string") ? a[field].toUpperCase() : a[field]; // ignore upper and lowercase
        const nameB = (typeof b[field] == "string") ? b[field].toUpperCase() : b[field]; // ignore upper and lowercase
        if(sortHeader == 'asc') return (nameA == nameB) ? 0 : (nameA < nameB) ? -1 : 1;
        return ((nameA == nameB) ? 0 : (nameA > nameB) ? -1 : 1);
      });

      return prev;
    });
   
    this.dataValueTabe();
  }

  changeLengthMenuRows(value: any): void {
    this.rowData.set(value);
    this.paginatorInit();
    this.dataValueTabe();
  }

  changeSearch(value: any): void {
    // timer(500).pipe(switchMap(() => {
    //   return of(value);
    // })).subscribe(res => {
    //   console.log(res)
    // })
    // this.searchValue.set(value);
    // this.dataValueTabe();

    if(this.timeout != null){
      clearTimeout(this.timeout);
    }

    const sefl = this;
    this.timeout = setTimeout(function() {
      sefl.body.update((prev: (string|number)[]) => {
        prev = prev.filter((item: any) => {
          if(item.description.includes(value)) {
            return true;
          }

          return false;
          //return (item.name.include(value) || item.description.include(value))
        })

        return prev;
      })

      sefl.dataValueTabe();
    },350); 
  }
}
