Feature: Draw Rectangles

  Scenario: Select Rectangle tool
    Given I open the app
    When I select the Rectangle tool
    Then the Rectangle tool shows as active

  Scenario: Draw a rectangle
    Given I open the app
    And I select the Rectangle tool
    When I draw a rectangle from (40, 40) to (140, 140)
    Then a rectangle exists at grid position (40, 40) with size (100, 100)

  Scenario: Drawing direction is normalized
    Given I open the app
    And I select the Rectangle tool
    When I draw a rectangle from (140, 140) to (40, 40)
    Then a rectangle exists at grid position (40, 40) with size (100, 100)

  Scenario: Rectangle snaps to grid
    Given I open the app
    And I select the Rectangle tool
    When I draw a rectangle from (45, 47) to (138, 139)
    Then a rectangle exists at grid position (40, 40) with size (100, 100)

  Scenario: Preview shown while drawing
    Given I open the app
    And I select the Rectangle tool
    When I start drawing from (40, 40)
    And I drag to (140, 140)
    Then a preview rectangle is visible
    When I release the mouse
    Then no preview rectangle is visible

  Scenario: Rectangle has fill and stroke
    Given I open the app
    And I select the Rectangle tool
    When I draw a rectangle from (40, 40) to (140, 140)
    Then the rectangle has visible fill
    And the rectangle has visible stroke

  Scenario: Multiple rectangles persist
    Given I open the app
    And I select the Rectangle tool
    When I draw a rectangle from (40, 40) to (140, 140)
    And I draw a rectangle from (-200, -100) to (-100, 0)
    Then 2 rectangles exist on the canvas

  Scenario: Drawing continues after leaving and re-entering canvas
    Given I open the app
    And I select the Rectangle tool
    When I start drawing from (-200, -100)
    And I drag off canvas
    And I drag to (-100, 0)
    Then a preview rectangle is visible
    And no rectangle has been placed

  Scenario: Grid dots align with rectangle snap points
    Given I open the app
    Then the grid background starts at origin
