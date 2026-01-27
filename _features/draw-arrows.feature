Feature: Draw Arrows

  Scenario: Select Arrow tool
    Given I open the app
    When I select the Arrow tool
    Then the Arrow tool shows as active

  Scenario: Select Arrow tool with keyboard shortcut
    Given I open the app
    When I press A
    Then the Arrow tool shows as active

  Scenario: Draw an arrow
    Given I open the app
    And I select the Arrow tool
    When I draw a line from (40, 40) to (140, 140)
    Then a line exists from (40, 40) to (140, 140)
    And the line has an arrowhead at the end

  Scenario: Arrow has open chevron arrowhead
    Given I open the app
    And I select the Arrow tool
    When I draw a line from (40, 40) to (140, 40)
    Then the arrowhead is an open chevron
