Feature: Undo/Redo

  # Core undo/redo
  Scenario: Undo shape creation
    Given I open the app
    And I select the Rectangle tool
    When I draw a rectangle from (40, 40) to (140, 140)
    And I undo
    Then 0 rectangles exist on the canvas

  Scenario: Redo shape creation
    Given I open the app
    And I select the Rectangle tool
    When I draw a rectangle from (40, 40) to (140, 140)
    And I undo
    And I redo
    Then 1 rectangles exist on the canvas

  Scenario: Undo shape deletion
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I press Delete
    And I undo
    Then 1 rectangles exist on the canvas

  Scenario: Undo restores selection state after delete
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I press Delete
    And I undo
    Then 1 shape is selected

  Scenario: Undo shape move
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I drag the shape from (150, 150) by (60, 40)
    And I undo
    Then the rectangle is at position (100, 100)

  Scenario: Undo shape resize
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I drag the bottom-right handle by (40, 60)
    And I undo
    Then the rectangle has size (100, 100)

  Scenario: Undo paste
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I copy the selection
    And I paste
    And I undo
    Then 1 rectangles exist on the canvas

  Scenario: Undo fill color change
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I set Inspector fill to "#ff0000"
    And I undo
    Then the Inspector shows fill as "#3b82f6"

  Scenario: Undo stroke color change
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I set Inspector stroke to "#00ff00"
    And I undo
    Then the Inspector shows stroke as "#60a5fa"

  # Selection changes
  Scenario: Undo selection change
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    When I click at (150, 150)
    And I undo
    Then no shapes are selected

  Scenario: Undo deselection
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I click at (-200, -100)
    And I undo
    Then 1 shape is selected

  # Redo stack behavior
  Scenario: New action clears redo stack
    Given I open the app
    And I select the Rectangle tool
    When I draw a rectangle from (40, 40) to (140, 140)
    And I undo
    And I draw a rectangle from (200, 200) to (300, 300)
    And I redo
    Then 1 rectangles exist on the canvas

  Scenario: Multiple undo steps
    Given I open the app
    And I select the Rectangle tool
    When I draw a rectangle from (40, 40) to (140, 140)
    And I draw a rectangle from (200, 200) to (300, 300)
    And I undo
    And I undo
    Then 0 rectangles exist on the canvas

  Scenario: Multiple redo steps
    Given I open the app
    And I select the Rectangle tool
    When I draw a rectangle from (40, 40) to (140, 140)
    And I draw a rectangle from (200, 200) to (300, 300)
    And I undo
    And I undo
    And I redo
    And I redo
    Then 2 rectangles exist on the canvas

  # Edge cases
  Scenario: Undo with empty history does nothing
    Given I open the app
    When I undo
    Then 0 rectangles exist on the canvas

  Scenario: Redo with empty future does nothing
    Given I open the app
    And I select the Rectangle tool
    When I draw a rectangle from (40, 40) to (140, 140)
    And I redo
    Then 1 rectangles exist on the canvas

  # Line-specific
  Scenario: Undo line creation
    Given I open the app
    And I select the Line tool
    When I draw a line from (40, 40) to (140, 140)
    And I undo
    Then 0 lines exist on the canvas

  Scenario: Undo line endpoint drag
    Given I open the app
    And a line exists from (100, 100) to (200, 200)
    And the line is selected
    When I drag the end handle by (40, 0)
    And I undo
    Then a line exists from (100, 100) to (200, 200)

  # Ellipse-specific
  Scenario: Undo ellipse creation
    Given I open the app
    And I select the Ellipse tool
    When I draw an ellipse from (40, 40) to (140, 140)
    And I undo
    Then 0 ellipses exist on the canvas

  # Text-specific
  Scenario: Undo text creation
    Given I open the app
    And I select the Text tool
    When I draw a text box from (40, 40) to (200, 100)
    And I type "Hello"
    And I click outside the text box
    And I undo
    Then 0 text boxes exist on the canvas

  Scenario: Undo text content edit
    Given I open the app
    And a text box exists at (100, 100) with size (160, 60) containing "Hello"
    When I double-click at (150, 130)
    And I clear the text
    And I type "Goodbye"
    And I click outside the text box
    And I undo
    Then the text box contains "Hello"

  # Viewport changes excluded
  Scenario: Zoom changes are not in undo history
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I press Delete
    And I zoom in to 200%
    And I undo
    Then 1 rectangles exist on the canvas
    And the status bar shows zoom "200%"

  # History limit
  Scenario: History limit prevents unbounded growth
    Given I open the app
    And 50 rectangles have been created and undone
    When I select the Rectangle tool
    And I draw a rectangle from (40, 40) to (140, 140)
    And I select the Selection tool
    And I undo 51 times
    Then 0 rectangles exist on the canvas
