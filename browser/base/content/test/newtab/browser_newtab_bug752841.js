/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */

const PREF_NEWTAB_ROWS = "browser.newtabpage.rows";
const PREF_NEWTAB_COLUMNS = "browser.newtabpage.columns";

function getCellsCount()
{
  return ContentTask.spawn(gBrowser.selectedBrowser, {}, function* () {
    return content.gGrid.cells.length;
  });
}

add_task(function* () {
  let testValues = [
    {row: 0, column: 0},
    {row: -1, column: -1},
    {row: -1, column: 0},
    {row: 0, column: -1},
    {row: 2, column: 4},
    {row: 2, column: 5},
  ];

  // Expected length of grid
  let expectedValues = [1, 1, 1, 1, 8, 10];

   // Values before setting new pref values (15 is the default value -> 5 x 3)
  let previousValues = [15, 1, 1, 1, 1, 8];

  yield* addNewTabPageTab();
  let existingTab = gBrowser.selectedTab;

  for (let i = 0; i < expectedValues.length; i++) {
    let existingTabGridLength = yield getCellsCount();
    is(existingTabGridLength, previousValues[i],
      "Grid length of existing page before update is correctly.");

    yield pushPrefs([PREF_NEWTAB_ROWS, testValues[i].row]);
    yield pushPrefs([PREF_NEWTAB_COLUMNS, testValues[i].column]);

    existingTabGridLength = yield getCellsCount();
    is(existingTabGridLength, expectedValues[i],
      "Existing page grid is updated correctly.");

    yield* addNewTabPageTab();
    let newTab = gBrowser.selectedTab;
    let newTabGridLength = yield getCellsCount();
    is(newTabGridLength, expectedValues[i],
      "New page grid is updated correctly.");

    yield BrowserTestUtils.removeTab(newTab);
  }

  gBrowser.removeTab(existingTab);
});

