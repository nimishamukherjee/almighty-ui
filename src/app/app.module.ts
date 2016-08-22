import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

// Imports for loading & configuring the in-memory web api
import { HttpModule, XHRBackend } from '@angular/http';
import { InMemoryBackendService, SEED_DATA } from 'angular2-in-memory-web-api';
import { InMemoryDataService }               from './in-memory-data.service';

import { AppComponent }  from './app.component';
import { routing } from './app.routing';

import { LoginComponent} from './login/login.component';
import { HeaderComponent} from './header/header.component';
import { FooterComponent} from './footer/footer.component';
import { BoardComponent} from './board/board.component';
import { WorkItemDetailComponent } from './work-item/work-item-detail/work-item-detail.component';
import { WorkItemListComponent } from './work-item/work-item-list/work-item-list.component';
import { WorkItemSearchComponent } from './work-item/work-item-search/work-item-search.component';
import { WorkItemService } from './work-item/work-item.service';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        routing
    ],
    declarations: [
        LoginComponent,
        HeaderComponent,
        FooterComponent,
        AppComponent,
        BoardComponent,
        WorkItemDetailComponent,
        WorkItemListComponent,
        WorkItemSearchComponent
    ],
    providers: [
        WorkItemService
        // ,{ provide: XHRBackend, useClass: InMemoryBackendService }, // in-mem server
        // { provide: SEED_DATA,  useClass: InMemoryDataService }     // in-mem server data
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {

}
