Feature: Draw Rectangles

  Scenario: Select Rectangle tool
    Given I open the app
    When I select the Rectangle tool
    Then the Rectangle tool shows as active

  Scenario: Draw a rectangle
    Given I open the app
    And I select the Rectangle tool
    When I draw a rectangle from (40, 60) to (140, 160)
    Then a rectangle exists at grid position (40, 60) with size (100, 100)

  Scenario: Drawing direction is normalized
    Given I open the app
    And I select the Rectangle tool
    When I draw a rectangle from (140, 160) to (40, 60)
    Then a rectangle exists at grid position (40, 60) with size (100, 100)

  Scenario: Rectangle snaps to grid
    Given I open the app
    And I select the Rectangle tool
    When I draw a rectangle from (45, 67) to (138, 159)
    Then a rectangle exists at grid position (40, 60) with size (100, 100)

  Scenario: Preview shown while drawing
    Given I open the app
    And I select the Rectangle tool
    When I start drawing from (40, 60)
    And I drag to (140, 160)
    Then a preview rectangle is visible
    When I release the mouse
    Then no preview rectangle is visible

  Scenario: Rectangle has fill and stroke
    Given I open the app
    And I select the Rectangle tool
    When I draw a rectangle from (40, 60) to (140, 160)
    Then the rectangle has visible fill
    And the rectangle has visible stroke

  Scenario: Multiple rectangles persist
    Given I open the app
    And I select the Rectangle tool
    When I draw a rectangle from (40, 60) to (140, 160)
    And I draw a rectangle from (200, 200) to (300, 300)
    Then 2 rectangles exist on the canvas
