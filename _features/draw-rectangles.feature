Feature: Draw Rectangles

  Scenario: Select Rectangle tool
    Given I open the app
    When I select the Rectangle tool
    Then the Rectangle tool shows as active

  Scenario: Draw a rectangle
    Given I open the app
    And I select the Rectangle tool
    When I draw a rectangle from (40, 40) to (140, 140)
    Then a rectangle exists at grid position (40, 40) with size (100, 100)

  Scenario: Drawing direction is normalized
    Given I open the app
    And I select the Rectangle tool
    When I draw a rectangle from (140, 140) to (40, 40)
    Then a rectangle exists at grid position (40, 40) with size (100, 100)

  Scenario: Rectangle snaps to grid
    Given I open the app
    And I select the Rectangle tool
    When I draw a rectangle from (45, 47) to (138, 139)
    Then a rectangle exists at grid position (40, 40) with size (100, 100)

  Scenario: Preview shown while drawing
    Given I open the app
    And I select the Rectangle tool
    When I start drawing from (40, 40)
    And I drag to (140, 140)
    Then a preview rectangle is visible
    When I release the mouse
    Then no preview rectangle is visible

  Scenario: Rectangle has fill and stroke
    Given I open the app
    And I select the Rectangle tool
    When I draw a rectangle from (40, 40) to (140, 140)
    Then the rectangle has visible fill
    And the rectangle has visible stroke

  Scenario: Multiple rectangles persist
    Given I open the app
    And I select the Rectangle tool
    When I draw a rectangle from (40, 40) to (140, 140)
    And I draw a rectangle from (-200, -100) to (-100, 0)
    Then 2 rectangles exist on the canvas

  Scenario: Drawing continues after leaving and re-entering canvas
    Given I open the app
    And I select the Rectangle tool
    When I start drawing from (-200, -100)
    And I drag off canvas
    And I drag to (-100, 0)
    Then a preview rectangle is visible
    And no rectangle has been placed

  Scenario: Grid dots align with rectangle snap points
    Given I open the app
    Then the grid background starts at origin

  # Embedded text
  Scenario: Double-click rectangle enters text edit mode
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    When I double-click at (150, 150)
    Then the rectangle is in text edit mode

  Scenario: Type text in rectangle
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    When I double-click at (150, 150)
    And I type "Label"
    And I click outside the rectangle
    Then the rectangle contains text "Label"

  Scenario: Exit text edit mode by pressing Escape
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    When I double-click at (150, 150)
    And I type "Label"
    And I press Escape
    Then the rectangle is not in text edit mode
    And the rectangle contains text "Label"

  Scenario: Empty text clears text property
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100) with text "Label"
    When I double-click at (150, 150)
    And I clear the text
    And I click outside the rectangle
    Then the rectangle has no text

  Scenario: Whitespace-only text clears text property
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    When I double-click at (150, 150)
    And I type "   "
    And I click outside the rectangle
    Then the rectangle has no text

  Scenario: Double-click rectangle with text selects all text
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100) with text "Label"
    When I double-click at (150, 150)
    Then all text is selected

  Scenario: Rectangle text defaults to center alignment
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    When I double-click at (150, 150)
    And I type "Label"
    And I click outside the rectangle
    Then the rectangle text is horizontally centered
    And the rectangle text is vertically centered
    And the rectangle text uses stroke color

  Scenario: Rectangle text clips when overflowing
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 60)
    When I double-click at (150, 130)
    And I type "This is a very long text that should overflow"
    And I click outside the rectangle
    Then the rectangle text is clipped
