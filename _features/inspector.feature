Feature: Inspector Panel

  Scenario: Inspector hidden when nothing selected
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    Then the Inspector panel is hidden

  Scenario: Inspector shows properties for selected shape
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    When I click at (150, 150)
    Then the Inspector panel is visible
    And the Inspector title is "Rectangle"
    And the Inspector shows X as 100
    And the Inspector shows Y as 100
    And the Inspector shows W as 100
    And the Inspector shows H as 100
    And the Inspector shows fill color
    And the Inspector shows stroke color

  Scenario: Inspector shows count for multi-selection
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And a rectangle exists at (300, 100) with size (100, 100)
    When I drag a marquee from (50, 50) to (450, 250)
    Then the Inspector title is "Selection"
    And the Inspector shows "2 shapes selected"

  Scenario: New rectangles have default colors
    Given I open the app
    And I select the Rectangle tool
    When I draw a rectangle from (40, 40) to (140, 140)
    And I select the Selection tool
    And I click at (90, 90)
    Then the Inspector shows fill as "#3b82f6"
    And the Inspector shows stroke as "#60a5fa"
