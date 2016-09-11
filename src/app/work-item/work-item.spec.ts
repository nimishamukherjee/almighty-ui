import {
	inject,
	async,
	TestBed
} from "@angular/core/testing";
import { 
	BaseRequestOptions,
	Http,
	Response,
	ResponseOptions
} from "@angular/http";
import { MockBackend } from "@angular/http/testing";
import { Logger } from '../shared/logger.service';

import { WorkItemService } from "./work-item.service";


describe("Work Item Service", () => {

	let apiService: WorkItemService;
	let mockService: MockBackend;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				Logger,
				BaseRequestOptions,
				MockBackend,
				{
					provide: Http,
					useFactory: (backend: MockBackend, options: BaseRequestOptions) => new Http(backend, options),
					deps: [MockBackend, BaseRequestOptions]
				},
				WorkItemService
			]
		});
	});

	beforeEach(inject([WorkItemService, MockBackend], (service: WorkItemService, mock: MockBackend) => {
		apiService = service;
		mockService = mock;
	}))

	it("Should make a get request", async(() => {
		let response = [
		  {
		      "fields": {
			        "system.assignee": null as any,
			        "system.creator": "me",
			        "system.description": null as any,
			        "system.state": "new",
			        "system.title": "test1"
			      },
		      "id": "1",
		      "type": "system.userstory",
		      "version": 0
		    },
		];

		mockService.connections.subscribe((connection: any) => {
			connection.mockRespond(new Response(
				new ResponseOptions({
					body: JSON.stringify(response),
					status: 200	
				})
			))
		})

		apiService.getWorkItems()
		.then(data => {
			expect(JSON.stringify(data)).toEqual(JSON.stringify(response));
		})
	}));

});
