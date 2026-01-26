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

  Scenario: Marquee only selects intersected shapes
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And a rectangle exists at (500, 100) with size (100, 100)
    When I drag a marquee from (50, 50) to (250, 250)
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
    Then the selected shape has resize handles at corners

  Scenario: Switching tools clears selection
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I select the Rectangle tool
    Then no shapes are selected
