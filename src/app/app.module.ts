import './rxjs-extensions';

import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';

// Imports for loading & configuring the in-memory web api
// if not used will be removed for production by treeshaking
import { InMemoryWebApiModule } from 'angular2-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';

import { AppComponent }  from './app.component';
import { routing } from './app.routing';
import { Logger } from './shared/logger.service';


import { AuthenticationService } from './auth/authentication.service';
import { LoginService } from './login/login.service';
import { UserService } from './user/user.service';
import { BoardComponent} from './board/board.component';
import { FooterComponent} from './footer/footer.component';
import { HeaderComponent} from './header/header.component';
import { LoginComponent} from './login/login.component';
import { WorkItemDetailComponent } from './work-item/work-item-detail/work-item-detail.component';
import { WorkItemListComponent } from './work-item/work-item-list/work-item-list.component';
import { WorkItemQuickAddComponent } from './work-item/work-item-quick-add/work-item-quick-add.component';
import { WorkItemSearchComponent } from './work-item/work-item-search/work-item-search.component';
import { WorkItemService } from './work-item/work-item.service';
import { StatusDrawerComponent } from './shared-component/status-drawer.component';

// conditionally import the inmemory resource module
var moduleImports = [
      BrowserModule,
      FormsModule,
      HttpModule,
      routing
    ];
if (process.env.ENV=='inmemory')
  moduleImports.push(InMemoryWebApiModule.forRoot(InMemoryDataService));

@NgModule({
  imports: moduleImports,
  declarations: [
    AppComponent,
    BoardComponent,
    FooterComponent,
    HeaderComponent,
    LoginComponent,
    WorkItemDetailComponent,
    WorkItemQuickAddComponent,
    WorkItemListComponent,
    WorkItemSearchComponent,
	  StatusDrawerComponent
  ],
  providers: [
    Logger,
    AuthenticationService,
    LoginService,
    UserService,
    WorkItemService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
