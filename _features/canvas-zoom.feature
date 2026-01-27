Feature: Canvas Zoom

  # Zoom Display
  Scenario: Status bar shows zoom level
    Given I open the app
    Then the status bar shows zoom "100%"

  Scenario: Status bar updates when zooming
    Given I open the app
    When I zoom in
    Then the status bar shows zoom greater than "100%"

  # Keyboard Zoom
  Scenario: Cmd+Plus zooms in
    Given I open the app
    When I press Cmd+Plus
    Then the zoom level increases

  Scenario: Cmd+Minus zooms out
    Given I open the app
    When I press Cmd+Minus
    Then the zoom level decreases

  Scenario: Ctrl+Plus zooms in on non-Mac
    Given I open the app
    When I press Ctrl+Plus
    Then the zoom level increases

  Scenario: Ctrl+Minus zooms out on non-Mac
    Given I open the app
    When I press Ctrl+Minus
    Then the zoom level decreases

  # Scroll Zoom
  Scenario: Cmd+scroll up zooms in
    Given I open the app
    When I Cmd+scroll up at (400, 300)
    Then the zoom level increases

  Scenario: Cmd+scroll down zooms out
    Given I open the app
    When I Cmd+scroll down at (400, 300)
    Then the zoom level decreases

  Scenario: Scroll without Cmd does not zoom
    Given I open the app
    When I scroll up at (400, 300)
    Then the status bar shows zoom "100%"

  # Zoom Centering
  Scenario: Scroll zoom centers on mouse position
    Given I open the app
    And a rectangle exists at (0, 0) with size (100, 100)
    When I Cmd+scroll up at the rectangle center
    Then the rectangle center stays at the same screen position

  # Zoom Limits
  Scenario: Zoom does not exceed maximum
    Given I open the app
    And the zoom is at 800%
    When I press Cmd+Plus
    Then the status bar shows zoom "800%"

  Scenario: Zoom does not go below minimum
    Given I open the app
    And the zoom is at 25%
    When I press Cmd+Minus
    Then the status bar shows zoom "25%"

  # Reset View
  Scenario: Cmd+0 resets zoom to 100%
    Given I open the app
    And the zoom is at 200%
    When I press Cmd+0
    Then the status bar shows zoom "100%"

  Scenario: Cmd+0 resets both pan and zoom
    Given I open the app
    And the viewport has pan offset (200, 150)
    And the zoom is at 200%
    When I press Cmd+0
    Then the viewport is panned by (0, 0)
    And the status bar shows zoom "100%"

  # UI Fixed Size
  Scenario: Resize handles stay fixed screen size when zoomed
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I zoom in to 200%
    Then the resize handles have the same screen size as at 100% zoom

  Scenario: Selection border stays fixed screen size when zoomed
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I zoom in to 200%
    Then the selection border has the same screen thickness as at 100% zoom

  # Interaction at Zoom
  Scenario: Shape selection works at zoomed levels
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the zoom is at 200%
    When I click at the rectangle's visual center
    Then 1 shape is selected

  Scenario: Shape drawing works at zoomed levels
    Given I open the app
    And the zoom is at 50%
    And I select the Rectangle tool
    When I draw a rectangle from screen (200, 200) to screen (400, 400)
    Then 1 rectangles exist on the canvas
    And the rectangle has size (400, 400)
