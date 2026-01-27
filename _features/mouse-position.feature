Feature: Mouse Position Display

  Scenario: Coordinates update as mouse moves
    Given I open the app
    When I move the mouse to canvas position (0, 0)
    Then the status bar shows coordinates "0, 0"
    When I move the mouse to canvas position (-120, 80)
    Then the status bar shows coordinates "-120, 80"

  Scenario: Status bar shows placeholder when mouse leaves canvas
    Given I open the app
    When I move the mouse to canvas position (100, 50)
    Then the status bar shows coordinates "100, 50"
    When I move the mouse outside the canvas
    Then the status bar shows coordinates "—, —"

  # Coordinates with zoom
  Scenario: Coordinates reflect world position when zoomed in
    Given I open the app
    And the zoom is at 200%
    When I move the mouse to the viewport center
    Then the status bar shows coordinates "0, 0"

  Scenario: Coordinates reflect world position when zoomed out
    Given I open the app
    And the zoom is at 50%
    When I move the mouse to the viewport center
    Then the status bar shows coordinates "0, 0"
