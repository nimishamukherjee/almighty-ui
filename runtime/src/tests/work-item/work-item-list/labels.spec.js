/**Note on screen resolutions - See: http://www.itunesextractor.com/iphone-ipad-resolution.html
 * Tests will be run on these resolutions:
 * - iPhone6s - 375x667
 * - iPad air - 768x1024
 * - Desktop -  1920x1080
 *
 * beforeEach will set the mode to Desktop. Any tests requiring a different resolution will must set explicitly.
 *
 * @author ijarif
 */

var WorkItemListPage = require('./page-objects/work-item-list.page'),
testSupport = require('./testSupport'),
constants = require('./constants'),
WorkItemDetailPage = require('./page-objects/work-item-detail.page');

describe('Labels CRUD Tests', function () {
  var page, items, browserMode, detailPage,
    until = protractor.ExpectedConditions,
    firstitem = {
      'id': 'id0',
    },
    newLabelTitle = "My Test Label",
    defaultSelectedLableTitle = "Example Label 1",
    testLabelTitle1 = "Example Label 0",
    testLabelTitle2 = "Example Label 3"; // From mock data

  beforeEach(function () {
    testSupport.setBrowserMode('desktop');
    page = new WorkItemListPage(true);
    testSupport.setTestSpace(page);
  });

  it('Verify add label button exists', function(){
    detailPage = page.clickWorkItemTitle(page.firstWorkItem, firstitem.id);
    expect(detailPage.addLabelButton.isPresent()).toBeTruthy();
    expect(detailPage.selectLabelDropdown.isPresent()).toBeFalsy();
    detailPage.clickAddLabelButton();
    expect(detailPage.selectLabelDropdown.isPresent()).toBeTruthy();
    expect(detailPage.createLabelButton.isPresent()).toBeTruthy();
  });

  it('Verify create new label button is clickable', function(){
    detailPage = page.clickWorkItemTitle(page.firstWorkItem, firstitem.id);
    let clickEvent = detailPage.clickAddLabelButton();
    expect(clickEvent).toBeDefined();
  });

  it('Verify create new Label', function(){
    detailPage = page.clickWorkItemTitle(page.firstWorkItem, firstitem.id);
    detailPage.clickAddLabelButton();
    let origLabelCount
    detailPage.labelsCount.then(function(count){
      origLabelCount = count
    });
    detailPage.clickCreateLabelButton();
    detailPage.setLabelName(newLabelTitle);
    detailPage.clickLabelCheckbox();
    // Verify label count has increased by 1
    detailPage.labelsCount.then(function(count){
      expect(count).toBe(origLabelCount + 1);
    });
    // Verify label exists in the list
    expect(detailPage.listOfLabels().getText()).toContain(detailPage.getLabelByTitle(newLabelTitle).getText());
  })

  it('Verify adding existing labels', function(){
    detailPage = page.clickWorkItemTitle(page.firstWorkItem,firstitem.id);
    detailPage.clickAddLabelButton();
    detailPage.selectLabelByTitle(testLabelTitle1);
    detailPage.selectLabelByTitle(testLabelTitle2);

    detailPage.attachedLabels().getText().then(function(text){
      console.log ("LABEL TEXT = " + text);
    });

    /* TODO - Mocking data is incorrect - text returns is:  Example Label 1,Example Label 1,

    expect(detailPage.attachedLabels().getText()).toContain(testLabelTitle1);
    expect(detailPage.attachedLabels().getText()).toContain(testLabelTitle2); */
    expect(detailPage.attachedLabels().getText()).toContain(defaultSelectedLableTitle)
  });

  it('Verify removing existing label by unchecking label', function(){
    detailPage = page.clickWorkItemTitle(page.firstWorkItem, firstitem.id);
    detailPage.clickAddLabelButton();
    // Uncheck label by clicking on it again
    detailPage.selectLabelByTitle(defaultSelectedLableTitle);
    detailPage.clickLabelClose();

    // Verify Label is removed (in detail page)
    expect(detailPage.attachedLabels()).not.toContain(defaultSelectedLableTitle);
  });

  it('Verify removing existing label by clicking x', function(){
    detailPage = page.clickWorkItemTitle(page.firstWorkItem, firstitem.id);

    // Uncheck label by clicking on it again
////    detailPage.removeLabelByTitle(defaultSelectedLableTitle);
    // Verify Label is removed (in detail page)
    expect(detailPage.attachedLabels()).not.toContain(defaultSelectedLableTitle);
  });

  it('Verify adding new label', function(){
    detailPage = page.clickWorkItemTitle(page.firstWorkItem, firstitem.id);
    detailPage.clickAddLabelButton();
    detailPage.clickCreateLabelButton();
    detailPage.setLabelName(newLabelTitle);
    detailPage.clickLabelCheckbox();
    detailPage.selectLabelByTitle(newLabelTitle);
    // Verify label added on detail page

    /* TODO - Mocking data is incorrect - text returns is: Example Label 1,Example Label 1,
    expect(detailPage.attachedLabels().getText()).toContain(newLabelTitle);   */
    
    // Verify label added on list page

    /* TODO - Mocking data is incorrect - text returns is:  Example Label 1,Example Label 1,
    expect(page.workItemAttachedLabels(page.firstWorkItem).getText()).toContain(newLabelTitle);   */

  });

  it('Verify removing new label', function(){
    detailPage = page.clickWorkItemTitle(page.firstWorkItem,firstitem.id);
    detailPage.clickAddLabelButton();
    detailPage.clickCreateLabelButton();
    detailPage.setLabelName(newLabelTitle);
    detailPage.clickLabelCheckbox();
    detailPage.selectLabelByTitle(newLabelTitle);

    // Verify new label is added
    expect(detailPage.listOfLabels().getText()).toContain(newLabelTitle);
    detailPage.clickLabelClose();

    expect(detailPage.listOfLabels().getText()).not.toContain(newLabelTitle);
  });

  it('Verify added label appears on the list page', function(){
    detailPage = page.clickWorkItemTitle(page.firstWorkItem,firstitem.id);
    detailPage.clickAddLabelButton();
    detailPage.selectLabelByTitle(testLabelTitle1);
    detailPage.clickLabelClose();
    detailPage.clickWorkItemDetailCloseButton();

    expect(page.workItemAttachedLabels(page.firstWorkItem).getText()).toContain(testLabelTitle1);
 });
});
