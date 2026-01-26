Feature: Keyboard Shortcuts

  Scenario: Delete selected shape with Delete key
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I press Delete
    Then no shapes are selected
    And 0 rectangles exist on the canvas

  Scenario: Delete selected shape with Backspace key
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I press Backspace
    Then 0 rectangles exist on the canvas

  Scenario: Delete multiple selected shapes
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And a rectangle exists at (300, 100) with size (100, 100)
    And both rectangles are selected
    When I press Delete
    Then 0 rectangles exist on the canvas

  Scenario: Delete does nothing with no selection
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    When I press Delete
    Then 1 rectangles exist on the canvas

  Scenario: Delete only works with Selection tool active
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    And I select the Rectangle tool
    When I press Delete
    Then 1 rectangles exist on the canvas

  Scenario: Copy and paste shape
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I copy the selection
    And I paste
    Then 2 rectangles exist on the canvas
    And a rectangle exists at position (120, 120)

  Scenario: Pasted shape is selected
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I copy the selection
    And I paste
    Then 1 shape is selected
    And the selected shape is at position (120, 120)

  Scenario: Multiple pastes use cumulative offset
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I copy the selection
    And I paste
    And I paste
    And I paste
    Then 4 rectangles exist on the canvas
    And a rectangle exists at position (120, 120)
    And a rectangle exists at position (140, 140)
    And a rectangle exists at position (160, 160)

  Scenario: Cut removes original shape
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I cut the selection
    Then 0 rectangles exist on the canvas
    Then no shapes are selected

  Scenario: Cut and paste shape
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I cut the selection
    And I paste
    Then 1 rectangles exist on the canvas
    And a rectangle exists at position (120, 120)

  Scenario: Paste with empty clipboard does nothing
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    When I paste
    Then 1 rectangles exist on the canvas

  Scenario: Copy multiple shapes
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And a rectangle exists at (300, 100) with size (100, 100)
    And both rectangles are selected
    When I copy the selection
    And I paste
    Then 4 rectangles exist on the canvas
    And 2 shapes are selected

  Scenario: Pasted shapes get new unique IDs
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I copy the selection
    And I paste
    And I delete the selection
    Then 1 rectangles exist on the canvas
    And the rectangle is at position (100, 100)

  Scenario: Clipboard persists across operations
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I copy the selection
    And I click at (-200, -100)
    And I paste
    And I paste
    Then 3 rectangles exist on the canvas

  Scenario: Copy only works with Selection tool active
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    And I select the Rectangle tool
    When I copy the selection
    And I select the Selection tool
    And I paste
    Then 1 rectangles exist on the canvas

  Scenario: New copy resets paste offset
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I copy the selection
    And I paste
    And I copy the selection
    And I paste
    Then a rectangle exists at position (140, 140)
