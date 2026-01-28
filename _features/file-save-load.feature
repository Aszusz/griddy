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
  Scenario: Save, Open, and New are in main menu
    Given I open the app
    When I open the main menu
    Then I see "New" menu item
    And I see "Save" menu item
    And I see "Open" menu item

  # Export PNG
  Scenario: Export PNG is in main menu
    Given I open the app
    When I open the main menu
    Then I see "Export PNG" menu item

  Scenario: Export PNG downloads image
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    When I export the canvas as PNG
    Then a PNG file is downloaded

  Scenario: Export PNG includes all shapes
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And an ellipse exists at (500, 500) with size (50, 50)
    When I export the canvas as PNG
    Then the exported image contains all shapes

  Scenario: Export PNG with empty canvas shows error
    Given I open the app
    When I export the canvas as PNG
    Then I see an error message

  # Shareable Links
  Scenario: Copy Link copies shareable URL to clipboard
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    When I copy a shareable link
    Then a URL with hash is copied to clipboard

  Scenario: Copy Link with empty canvas shows error
    Given I open the app
    When I copy a shareable link
    Then I see an error message

  Scenario: Shared link loads immediately when no localStorage
    Given localStorage is empty
    When I open the app with a shared link containing an ellipse
    Then 1 ellipses exist on the canvas
    And the URL has no hash

  Scenario: Pasting shared link with existing content shows confirm
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    When I paste a shared link containing an ellipse
    Then I see a confirmation dialog
    When I confirm the load
    Then 1 ellipses exist on the canvas
    And 0 rectangles exist on the canvas

  Scenario: Corrupted shared link shows error
    Given I open the app with a corrupted shared link
    Then I see an error message
    And 0 shapes exist on the canvas

  # New menu item
  Scenario: New clears canvas with confirmation
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    When I click New
    And I confirm the action
    Then 0 shapes exist on the canvas

  Scenario: New shows confirmation when canvas has content
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    When I click New
    Then I see a confirmation dialog

  Scenario: New can be cancelled
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    When I click New
    And I cancel the action
    Then 1 rectangles exist on the canvas

  Scenario: New with empty canvas requires no confirmation
    Given I open the app
    When I click New
    Then I do not see a confirmation dialog

  Scenario: New clears selection
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I click New
    And I confirm the action
    Then no shapes are selected

  Scenario: New clears undo history
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    When I click New
    And I confirm the action
    And I undo
    Then 0 shapes exist on the canvas

  Scenario: New clears redo history
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    When I click New
    And I confirm the action
    And I redo
    Then 0 shapes exist on the canvas

  Scenario: New clears URL hash
    Given I open the app with a shared link containing an ellipse
    When I click New
    And I confirm the action
    Then the URL has no hash

  Scenario: New clears localStorage
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    When I click New
    And I confirm the action
    And I reload the app
    Then 0 shapes exist on the canvas

  # localStorage persistence
  Scenario: Shapes auto-save to localStorage
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    When I reload the app
    Then 1 rectangles exist on the canvas

  Scenario: localStorage loads on startup when no shared link
    Given localStorage contains a rectangle at (100, 100)
    When I start the app
    Then 1 rectangles exist on the canvas

  Scenario: Shared link takes priority over localStorage when confirmed
    Given localStorage contains a rectangle at (100, 100)
    When I open the app with a shared link containing an ellipse
    And I confirm the load
    Then 1 ellipses exist on the canvas
    And 0 rectangles exist on the canvas

  Scenario: Shared link with localStorage shows confirmation
    Given localStorage contains a rectangle at (100, 100)
    When I open the app with a shared link containing an ellipse
    Then I see a confirmation dialog

  Scenario: Shared link can be cancelled to keep localStorage
    Given localStorage contains a rectangle at (100, 100)
    When I open the app with a shared link containing an ellipse
    And I cancel the load
    Then 1 rectangles exist on the canvas
    And 0 ellipses exist on the canvas

  Scenario: Cross-tab sync updates other tabs
    Given I open the app in two tabs
    And I create a rectangle in the first tab
    Then the second tab shows the rectangle

  Scenario: Corrupted localStorage silently starts empty
    Given localStorage contains corrupted data
    When I start the app
    Then 0 shapes exist on the canvas

  Scenario: localStorage excludes viewport state
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And I zoom in to 200%
    When I reload the app
    Then 1 rectangles exist on the canvas
    And the status bar shows zoom "100%"
