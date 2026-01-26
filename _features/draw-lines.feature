Feature: Draw Lines

  Scenario: Select Line tool
    Given I open the app
    When I select the Line tool
    Then the Line tool shows as active

  Scenario: Select Line tool with keyboard shortcut
    Given I open the app
    When I press L
    Then the Line tool shows as active

  Scenario: Draw a line
    Given I open the app
    And I select the Line tool
    When I draw a line from (40, 40) to (140, 140)
    Then a line exists from (40, 40) to (140, 140)

  Scenario: Line endpoints snap to grid
    Given I open the app
    And I select the Line tool
    When I draw a line from (45, 47) to (138, 139)
    Then a line exists from (40, 40) to (140, 140)

  Scenario: Preview shown while drawing
    Given I open the app
    And I select the Line tool
    When I start drawing from (40, 40)
    And I drag to (140, 140)
    Then a preview line is visible
    When I release the mouse
    Then no preview line is visible

  Scenario: Line has stroke only
    Given I open the app
    And I select the Line tool
    When I draw a line from (40, 40) to (140, 140)
    Then the line has visible stroke
    And the line has no fill

  Scenario: Multiple lines persist
    Given I open the app
    And I select the Line tool
    When I draw a line from (40, 40) to (140, 140)
    And I draw a line from (200, 100) to (300, 200)
    Then 2 lines exist on the canvas

  Scenario: Zero-length line is discarded
    Given I open the app
    And I select the Line tool
    When I draw a line from (45, 47) to (48, 49)
    Then 0 lines exist on the canvas

  Scenario: Select line by clicking near stroke
    Given I open the app
    And a line exists from (100, 100) to (200, 200)
    When I select the Selection tool
    And I click at (150, 150)
    Then 1 shape is selected

  Scenario: Line hit detection has tolerance
    Given I open the app
    And a line exists from (100, 100) to (200, 100)
    When I select the Selection tool
    And I click at (150, 103)
    Then 1 shape is selected

  Scenario: Click outside tolerance misses line
    Given I open the app
    And a line exists from (100, 100) to (200, 100)
    When I select the Selection tool
    And I click at (150, 110)
    Then no shapes are selected

  Scenario: Selected line shows 2 endpoint handles
    Given I open the app
    And a line exists from (100, 100) to (200, 200)
    And the line is selected
    Then 2 endpoint handles are visible

  Scenario: Drag endpoint to reposition
    Given I open the app
    And a line exists from (100, 100) to (200, 200)
    And the line is selected
    When I drag the end handle by (40, 0)
    Then a line exists from (100, 100) to (240, 200)

  Scenario: Drag start endpoint
    Given I open the app
    And a line exists from (100, 100) to (200, 200)
    And the line is selected
    When I drag the start handle by (-40, 20)
    Then a line exists from (60, 120) to (200, 200)

  Scenario: Endpoint drag snaps to grid
    Given I open the app
    And a line exists from (100, 100) to (200, 200)
    And the line is selected
    When I drag the end handle by (35, 47)
    Then a line exists from (100, 100) to (240, 240)

  Scenario: Move line by dragging stroke
    Given I open the app
    And a line exists from (100, 100) to (200, 200)
    And the line is selected
    When I drag the shape from (150, 150) by (60, 40)
    Then a line exists from (160, 140) to (260, 240)

  Scenario: Delete line
    Given I open the app
    And a line exists from (100, 100) to (200, 200)
    And the line is selected
    When I press Delete
    Then 0 lines exist on the canvas

  Scenario: Copy and paste line
    Given I open the app
    And a line exists from (100, 100) to (200, 200)
    And the line is selected
    When I copy the selection
    And I paste
    Then 2 lines exist on the canvas

  Scenario: Cut and paste line
    Given I open the app
    And a line exists from (100, 100) to (200, 200)
    And the line is selected
    When I cut the selection
    And I paste
    Then 1 lines exist on the canvas
