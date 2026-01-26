Feature: Canvas Panning

  # Pan Tool
  Scenario: Select Pan tool from toolbar
    Given I open the app
    When I select the Pan tool
    Then the Pan tool shows as active

  Scenario: Activate Pan tool with H shortcut
    Given I open the app
    When I press H
    Then the Pan tool shows as active

  Scenario: Pan tool shows grab cursor
    Given I open the app
    And I select the Pan tool
    Then the cursor is "grab"

  Scenario: Pan tool shows grabbing cursor while dragging
    Given I open the app
    And I select the Pan tool
    When I start dragging from (100, 100)
    Then the cursor is "grabbing"

  Scenario: Drag to pan viewport
    Given I open the app
    And I select the Pan tool
    When I drag from (100, 100) by (60, 40)
    Then the viewport is panned by (60, 40)

  # Spacebar Pan
  Scenario: Spacebar temporarily activates pan mode
    Given I open the app
    And I select the Selection tool
    When I hold spacebar
    Then the cursor is "grab"

  Scenario: Spacebar drag pans viewport
    Given I open the app
    And I select the Selection tool
    When I hold spacebar and drag from (100, 100) by (60, 40)
    Then the viewport is panned by (60, 40)

  Scenario: Releasing spacebar returns to previous tool
    Given I open the app
    And I select the Rectangle tool
    When I hold spacebar
    And I release spacebar
    Then the Rectangle tool shows as active

  # Pan Behavior
  Scenario: Grid shifts with pan offset
    Given I open the app
    When I pan the viewport by (100, 100)
    Then the origin crosshair is offset by (100, 100) from center

  Scenario: Shapes shift visually with pan offset
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    When I pan the viewport by (60, 40)
    Then the rectangle appears at visual position (160, 140)
    But the rectangle is at position (100, 100)

  Scenario: Pan has no boundaries
    Given I open the app
    When I pan the viewport by (10000, 10000)
    Then the viewport is panned by (10000, 10000)

  # Reset View
  Scenario: Cmd+0 resets pan to origin
    Given I open the app
    And the viewport has pan offset (200, 150)
    When I press Cmd+0
    Then the viewport is panned by (0, 0)

  Scenario: Ctrl+0 resets pan to origin on non-Mac
    Given I open the app
    And the viewport has pan offset (200, 150)
    When I press Ctrl+0
    Then the viewport is panned by (0, 0)

  # Pan Tool Interaction
  Scenario: Pan tool does not select shapes
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And I select the Pan tool
    When I click at (150, 150)
    Then no shapes are selected

  Scenario: Pan does not affect shape coordinates
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And I select the Pan tool
    When I drag from (100, 100) by (500, 500)
    Then the rectangle is at position (100, 100)
