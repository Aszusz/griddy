Feature: Draw Rectangles

  Scenario: Select Rectangle tool
    Given I open the app
    When I select the Rectangle tool
    Then the Rectangle tool shows as active

  Scenario: Draw a rectangle
    Given I open the app
    And I select the Rectangle tool
    When I draw a rectangle from (440, 340) to (540, 440)
    Then a rectangle exists at grid position (40, 40) with size (100, 100)

  Scenario: Drawing direction is normalized
    Given I open the app
    And I select the Rectangle tool
    When I draw a rectangle from (540, 440) to (440, 340)
    Then a rectangle exists at grid position (40, 40) with size (100, 100)

  Scenario: Rectangle snaps to grid
    Given I open the app
    And I select the Rectangle tool
    When I draw a rectangle from (445, 347) to (538, 439)
    Then a rectangle exists at grid position (40, 40) with size (100, 100)

  Scenario: Preview shown while drawing
    Given I open the app
    And I select the Rectangle tool
    When I start drawing from (440, 340)
    And I drag to (540, 440)
    Then a preview rectangle is visible
    When I release the mouse
    Then no preview rectangle is visible

  Scenario: Rectangle has fill and stroke
    Given I open the app
    And I select the Rectangle tool
    When I draw a rectangle from (440, 340) to (540, 440)
    Then the rectangle has visible fill
    And the rectangle has visible stroke

  Scenario: Multiple rectangles persist
    Given I open the app
    And I select the Rectangle tool
    When I draw a rectangle from (440, 340) to (540, 440)
    And I draw a rectangle from (200, 200) to (300, 300)
    Then 2 rectangles exist on the canvas

  Scenario: Drawing continues after leaving and re-entering canvas
    Given I open the app
    And I select the Rectangle tool
    When I start drawing from (200, 200)
    And I drag off canvas
    And I drag to (300, 300)
    Then a preview rectangle is visible
    And no rectangle has been placed

  Scenario: Grid dots align with rectangle snap points
    Given I open the app
    Then the grid background starts at origin
