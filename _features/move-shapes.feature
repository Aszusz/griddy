Feature: Move Shapes

  Scenario: Drag selected shape to new position
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I drag the shape from (150, 150) by (60, 40)
    Then the rectangle is at position (160, 140)

  Scenario: Move snaps to grid
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I drag the shape from (150, 150) by (55, 37)
    Then the rectangle is at position (160, 140)

  Scenario: Click-drag unselected shape selects and moves it
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    When I drag the shape from (150, 150) by (60, 40)
    Then 1 shape is selected
    And the rectangle is at position (160, 140)

  Scenario: Dragging only works with Selection tool active
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    And I select the Rectangle tool
    When I drag from (150, 150) by (60, 40)
    Then the rectangle is at position (100, 100)

  Scenario: Multiple selected shapes move together
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And a rectangle exists at (300, 100) with size (100, 100)
    And both rectangles are selected
    When I drag the shape from (150, 150) by (60, 40)
    Then the first rectangle is at position (160, 140)
    And the second rectangle is at position (360, 140)

  Scenario: Negative coordinates allowed
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I drag the shape from (150, 150) by (-200, -200)
    Then the rectangle is at position (-100, -100)

  Scenario: Inspector updates live while dragging
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I start dragging the shape from (150, 150)
    And I drag to offset (60, 40)
    Then the Inspector shows X as 160
    And the Inspector shows Y as 140
    When I release the mouse
    Then the rectangle is at position (160, 140)

  Scenario: Shape moves immediately on drag start
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I start dragging the shape from (150, 150)
    And I drag to offset (60, 40)
    Then the rectangle is at position (160, 140)

  Scenario: Dragging on resize handle does not move shape
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I drag the bottom-right handle by (40, 40)
    Then the rectangle is at position (100, 100)
    And the rectangle has size (140, 140)

  Scenario: Move cursor when hovering selected shape
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I hover over the shape at (150, 150)
    Then the cursor is "move"
