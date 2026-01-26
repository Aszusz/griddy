Feature: Resize Handles

  Scenario: 8 resize handles visible on single selection
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    When I click at (150, 150)
    Then 8 resize handles are visible

  Scenario: Drag corner handle resizes shape
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I drag the bottom-right handle by (40, 60)
    Then the rectangle has size (140, 160)

  Scenario: Drag edge handle resizes in one direction
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I drag the right handle by (40, 0)
    Then the rectangle has size (140, 100)

  Scenario: Resize snaps to grid
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I drag the bottom-right handle by (35, 47)
    Then the rectangle has size (140, 140)

  Scenario: Resize enforces minimum size
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I drag the bottom-right handle by (-100, -100)
    Then the rectangle has size (20, 20)

  Scenario: Resize from top-left repositions shape
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I drag the top-left handle by (-40, -40)
    Then the rectangle is at position (60, 60)
    And the rectangle has size (140, 140)

  Scenario: Inspector updates during resize
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I drag the right handle by (40, 0)
    Then the Inspector shows W as 140

  Scenario: Shape updates live while dragging
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I start dragging the right handle
    And I drag to offset (60, 0)
    Then the rectangle has size (160, 100)
    When I release the mouse
    Then the rectangle has size (160, 100)
