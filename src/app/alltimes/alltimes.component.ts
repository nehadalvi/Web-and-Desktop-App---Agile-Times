import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem, DataTable, LazyLoadEvent } from "primeng/primeng";
import Dexie from 'dexie';
import { Observable } from "rxjs";
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

const MAX_EXAMPLE_RECORDS = 1000;

@Component({
  selector: 'at-alltimes',
  templateUrl: './alltimes.component.html',
  styleUrls: ['./alltimes.component.css']
})
export class AlltimesComponent implements OnInit {

  @ViewChild("dt") dt : DataTable;

  allTimesheetData = [];

  allProjectNames = ['', 'Payroll App', 'Mobile App', 'Agile Times'];

  allProjects = this.allProjectNames.map((proj) => {
    return { label: proj, value: proj }
  });

  selectedRows: Array<any>;

  contextMenu: MenuItem[];

  recordCount : number;

  allTimesForm: FormGroup;

  constructor(private apollo: Apollo, private fb: FormBuilder) { }

  displayEditDialog = false;

  

  ngOnInit() {

    this.allTimesForm = this.fb.group({
      user:[''],
      project:[''],
      category:[''],
      start: [''],
      end:['']

    })
    const AllClientsQuery = gql`
        query allTimesheets {
          allTimesheets {
              id
              user
              project
              category
              startTime
              endTime
            }
        }`;

  const queryObservable = this.apollo.watchQuery({

    query: AllClientsQuery,
    pollInterval: 200 
  }).subscribe(({ data, loading }: any) => {
    
         this.allTimesheetData = data.allTimesheets;
         this.recordCount = data.allTimesheets.length;


        });

  
  }

  onEditComplete(editInfo) { }

  addNewEntry(){
    
    const user = this.allTimesForm.value.user;
    const project = this.allTimesForm.value.project;
    const category = this.allTimesForm.value.category;
    const startTime = this.allTimesForm.value.start;
    const endTime = this.allTimesForm.value.end;

    const createTimesheet = gql`
              mutation createTimesheet ($user: String!, $project: String!, $category: String!, $startTime: Int!, $endTime: Int!, $date: DateTime!) {
                createTimesheet(user: $user, project: $project, category: $category, startTime: $startTime, endTime: $endTime, date: $date ) {
                  id
                }
              }
            `;
        
            this.apollo.mutate({
              mutation: createTimesheet,
              variables: {
                user: user,
                project: project,
                category: category,
                startTime: startTime,
                endTime: endTime,
                date: new Date()
              }
            }).subscribe(({ data }) => {
              console.log('got data', data);
              
          }, (error) => {
              console.log('there was an error sending the query', error);
            });
            this.displayEditDialog = false;
  }
  

  cancelDialog(){
    this.displayEditDialog = false;
  }

  onSubmit(){
    
  }

  onRowSelect(rowSelected){

  }
}
