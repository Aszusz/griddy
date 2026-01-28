Feature: Theme Support

  # Theme switching
  Scenario: User can switch to dark theme
    Given I open the app
    When I set the theme to "Dark"
    Then the app displays in dark mode

  # System preference
  Scenario: System mode follows OS dark preference
    Given the OS prefers dark mode
    And I open the app
    When I set the theme to "System"
    Then the app displays in dark mode

  Scenario: System mode follows OS light preference
    Given the OS prefers light mode
    And I open the app
    When I set the theme to "System"
    Then the app displays in light mode

  # Persistence
  Scenario: Theme choice persists across sessions
    Given I open the app
    And I set the theme to "Light"
    When I reload the app
    Then the app displays in light mode

  Scenario: Default to system preference on first visit
    Given localStorage is empty
    And the OS prefers dark mode
    When I open the app
    Then the app displays in dark mode
