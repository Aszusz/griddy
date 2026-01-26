Feature: Viewport Grid

  Scenario: Grid covers entire viewport
    Given I open the app
    Then grid dots fill the entire viewport

  Scenario: Canvas resizes with viewport
    Given I open the app
    When the viewport is resized
    Then grid dots fill the entire viewport

  Scenario: Origin stays centered after resize
    Given I open the app
    When the viewport is resized
    Then the origin crosshair is at viewport center

  Scenario: Grid dots maintain 20px intervals from origin
    Given I open the app
    Then grid dots are spaced 20 pixels apart from origin
