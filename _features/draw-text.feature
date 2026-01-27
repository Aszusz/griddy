Feature: Draw Text

  Scenario: Select Text tool
    Given I open the app
    When I select the Text tool
    Then the Text tool shows as active

  Scenario: Select Text tool with keyboard shortcut
    Given I open the app
    When I press T
    Then the Text tool shows as active

  # Drawing text boxes
  Scenario: Draw text box enters edit mode
    Given I open the app
    And I select the Text tool
    When I draw a text box from (40, 40) to (200, 100)
    Then a text box exists at grid position (40, 40) with size (160, 60)
    And the text box is in edit mode

  Scenario: Text box snaps to grid
    Given I open the app
    And I select the Text tool
    When I draw a text box from (45, 47) to (195, 97)
    Then a text box exists at grid position (40, 40) with size (160, 60)

  Scenario: Preview shown while drawing
    Given I open the app
    And I select the Text tool
    When I start drawing from (40, 40)
    And I drag to (200, 100)
    Then a preview text box is visible
    When I release the mouse
    Then no preview text box is visible

  # Edit mode
  Scenario: Type text in edit mode
    Given I open the app
    And I select the Text tool
    When I draw a text box from (40, 40) to (200, 100)
    And I type "Hello World"
    And I click outside the text box
    Then the text box contains "Hello World"

  Scenario: Exit edit mode by clicking outside
    Given I open the app
    And I select the Text tool
    When I draw a text box from (40, 40) to (200, 100)
    And I type "Hello"
    And I click outside the text box
    Then the text box is not in edit mode

  Scenario: Exit edit mode by pressing Escape
    Given I open the app
    And I select the Text tool
    When I draw a text box from (40, 40) to (200, 100)
    And I type "Hello"
    And I press Escape
    Then the text box is not in edit mode
    And the text box contains "Hello"

  # Empty text handling
  Scenario: Empty text box is discarded
    Given I open the app
    And I select the Text tool
    When I draw a text box from (40, 40) to (200, 100)
    And I click outside the text box
    Then 0 text boxes exist on the canvas

  Scenario: Text box with only whitespace is discarded
    Given I open the app
    And I select the Text tool
    When I draw a text box from (40, 40) to (200, 100)
    And I type "   "
    And I click outside the text box
    Then 0 text boxes exist on the canvas

  # Selection and editing existing text
  Scenario: Single click selects text shape
    Given I open the app
    And a text box exists at (100, 100) with size (160, 60) containing "Hello"
    When I click at (150, 130)
    Then 1 shape is selected
    And the text box is not in edit mode

  Scenario: Double-click enters edit mode
    Given I open the app
    And a text box exists at (100, 100) with size (160, 60) containing "Hello"
    When I double-click at (150, 130)
    Then the text box is in edit mode

  # Text wrapping and overflow
  Scenario: Text wraps at box width
    Given I open the app
    And I select the Text tool
    When I draw a text box from (100, 100) to (200, 180)
    And I type "This is a long text that should wrap"
    And I click outside the text box
    Then the text displays on multiple lines

  Scenario: Text overflow is clipped
    Given I open the app
    And I select the Text tool
    When I draw a text box from (100, 100) to (200, 140)
    And I type "Line one. Line two. Line three. Line four."
    And I click outside the text box
    Then the text is clipped to the box height

  # Copy/paste
  Scenario: Copy and paste text box
    Given I open the app
    And a text box exists at (100, 100) with size (160, 60) containing "Hello"
    And the text box is selected
    When I copy the selection
    And I paste
    Then 2 text boxes exist on the canvas
    And both text boxes contain "Hello"

  # Multiple text boxes
  Scenario: Multiple text boxes persist
    Given I open the app
    And I select the Text tool
    When I draw a text box from (40, 40) to (200, 100)
    And I type "First"
    And I click outside the text box
    And I draw a text box from (40, 140) to (200, 200)
    And I type "Second"
    And I click outside the text box
    Then 2 text boxes exist on the canvas
