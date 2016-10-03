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
import { WorkItem } from "./work-item";
import { Logger } from "../shared/logger.service";
import { WorkItemService } from "./work-item.service";


describe("Work Item Service - ", () => {

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
                    useFactory: (backend: MockBackend,
                                 options: BaseRequestOptions) => new Http(backend, options),
                    deps: [MockBackend, BaseRequestOptions]
                },
                WorkItemService
            ]
        });
    });

    beforeEach(inject(
        [WorkItemService, MockBackend],
        (service: WorkItemService, mock: MockBackend) => {
            apiService = service;
            mockService = mock;
        }
    ));
    let response: WorkItem[] = [
          {
              "fields": {
                    "system.assignee": null,
                    "system.creator": "me",
                    "system.description": null,
                    "system.state": "new",
                    "system.title": "test1"
                  },
              "id": "1",
              "type": "system.userstory",
              "version": 0
            },
        ] as WorkItem[];

    it("Get work items", async(() => {
        mockService.connections.subscribe((connection: any) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: JSON.stringify(response),
                    status: 200
                })
            ));
        });

        apiService.getWorkItems()
        .then(data => {
            expect(data).toEqual(response);
        });
    }));

    it("Add new work Item", async(() => {
        mockService.connections.subscribe((connection: any) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: JSON.stringify(response),
                    status: 201
                })
            ));
        });

        apiService.create(response[0])
        .then(data => {
            expect(data).toEqual(response);
        });
    }));

    it("Delete work item", async(() => {
        mockService.connections.subscribe((connection: any) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    status: 200
                })
            ));
        });

        apiService.delete(response[0])
        .then(data => {
            expect(data).toBeNull();
        });
    }));

    it("Update work item", async(() => {
        mockService.connections.subscribe((connection: any) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: JSON.stringify(response),
                    status: 200
                })
            ));
        });

        apiService.update(response[0])
        .then(data => {
            expect(data).toEqual(response[0]);
        });
    }));

});
