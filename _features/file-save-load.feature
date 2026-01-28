Feature: File Save and Load

  # Save functionality
  Scenario: Save downloads canvas as JSON
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    When I save the canvas
    Then a JSON file is downloaded

  Scenario: Save includes shape properties
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    When I save the canvas
    Then the saved file contains the rectangle with position (100, 100)

  Scenario: Save excludes viewport state
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And I zoom in to 200%
    When I save the canvas
    Then the saved file does not contain viewport state

  # Load functionality
  Scenario: Load replaces canvas shapes
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    When I load a file with an ellipse at (200, 200)
    And I confirm the load
    Then 0 rectangles exist on the canvas
    And 1 ellipses exist on the canvas

  Scenario: Load shows confirmation dialog
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    When I load a file with an ellipse at (200, 200)
    Then I see a confirmation dialog

  Scenario: Load can be cancelled
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    When I load a file with an ellipse at (200, 200)
    And I cancel the load
    Then 1 rectangles exist on the canvas
    And 0 ellipses exist on the canvas

  Scenario: Load clears selection
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I load a file with an ellipse at (200, 200)
    And I confirm the load
    Then no shapes are selected

  Scenario: Load clears undo history
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    When I load a file with an ellipse at (200, 200)
    And I confirm the load
    And I undo
    Then 1 ellipses exist on the canvas

  Scenario: Load clears redo history
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    When I load a file with an ellipse at (200, 200)
    And I confirm the load
    And I redo
    Then 1 ellipses exist on the canvas

  # Error handling
  Scenario: Invalid JSON shows error
    Given I open the app
    When I load an invalid JSON file
    Then I see an error message
    And 0 rectangles exist on the canvas

  Scenario: Invalid file leaves canvas unchanged
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    When I load an invalid JSON file
    Then 1 rectangles exist on the canvas

  # Menu structure
  Scenario: Save and Open are in main menu
    Given I open the app
    When I open the main menu
    Then I see "Save" menu item
    And I see "Open" menu item
