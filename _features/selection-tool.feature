Feature: Selection Tool

  Scenario: Selection tool is active on app load
    Given I open the app
    Then the Selection tool shows as active

  Scenario: Select the Selection tool from toolbar
    Given I open the app
    And I select the Rectangle tool
    When I select the Selection tool
    Then the Selection tool shows as active

  Scenario: Click shape to select it
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    When I click at (150, 150)
    Then 1 shape is selected

  Scenario: Click empty canvas to deselect
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I click at (-200, -100)
    Then no shapes are selected

  Scenario: Shift-click to add to selection
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And a rectangle exists at (300, 100) with size (100, 100)
    And the first rectangle is selected
    When I shift-click the second rectangle
    Then 2 shapes are selected

  Scenario: Shift-click to remove from selection
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And a rectangle exists at (300, 100) with size (100, 100)
    And both rectangles are selected
    When I shift-click the first rectangle
    Then 1 shape is selected

  Scenario: Marquee select shapes
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And a rectangle exists at (300, 100) with size (100, 100)
    When I drag a marquee from (50, 50) to (450, 250)
    Then 2 shapes are selected

  Scenario: Marquee only selects fully contained shapes
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And a rectangle exists at (200, 100) with size (100, 100)
    When I drag a marquee from (50, 50) to (250, 250)
    Then 1 shape is selected

  Scenario: Marquee selects contained ellipses
    Given I open the app
    And an ellipse exists at (100, 100) with size (100, 100)
    And an ellipse exists at (300, 100) with size (100, 100)
    When I drag a marquee from (50, 50) to (250, 250)
    Then 1 shape is selected

  Scenario: Marquee selects contained lines
    Given I open the app
    And a line exists from (100, 100) to (180, 180)
    And a line exists from (300, 100) to (400, 200)
    When I drag a marquee from (50, 50) to (250, 250)
    Then 1 shape is selected

  Scenario: Partially overlapping shape not selected by marquee
    Given I open the app
    And a rectangle exists at (100, 100) with size (200, 100)
    When I drag a marquee from (50, 50) to (200, 250)
    Then no shapes are selected

  Scenario: Shift-marquee adds to selection
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And a rectangle exists at (400, 100) with size (100, 100)
    And the first rectangle is selected
    When I shift-drag a marquee from (350, 50) to (550, 250)
    Then 2 shapes are selected

  Scenario: Click inside ellipse bounds but outside geometry misses
    Given I open the app
    And an ellipse exists at (100, 100) with size (100, 100)
    When I click at (105, 105)
    Then no shapes are selected

  Scenario: Click on ellipse fill selects it
    Given I open the app
    And an ellipse exists at (100, 100) with size (100, 100)
    When I click at (150, 150)
    Then 1 shape is selected

  Scenario: Click on ellipse stroke selects it
    Given I open the app
    And an ellipse exists at (100, 100) with size (100, 100)
    When I click at (100, 150)
    Then 1 shape is selected

  Scenario: Selected shape shows selection border
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    When I click at (150, 150)
    Then the selected shape has a selection border

  Scenario: Selected shape shows resize handles
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    When I click at (150, 150)
    Then 8 resize handles are visible

  Scenario: Switching tools clears selection
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I select the Rectangle tool
    Then no shapes are selected
