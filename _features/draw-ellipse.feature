Feature: Draw Ellipse

  Scenario: Select Ellipse tool
    Given I open the app
    When I select the Ellipse tool
    Then the Ellipse tool shows as active

  Scenario: Select Ellipse tool with keyboard shortcut
    Given I open the app
    When I press E
    Then the Ellipse tool shows as active

  Scenario: Draw an ellipse
    Given I open the app
    And I select the Ellipse tool
    When I draw an ellipse from (40, 40) to (140, 140)
    Then an ellipse exists at grid position (40, 40) with size (100, 100)

  Scenario: Drawing direction is normalized
    Given I open the app
    And I select the Ellipse tool
    When I draw an ellipse from (140, 140) to (40, 40)
    Then an ellipse exists at grid position (40, 40) with size (100, 100)

  Scenario: Ellipse snaps to grid
    Given I open the app
    And I select the Ellipse tool
    When I draw an ellipse from (45, 47) to (138, 139)
    Then an ellipse exists at grid position (40, 40) with size (100, 100)

  Scenario: Preview shown while drawing
    Given I open the app
    And I select the Ellipse tool
    When I start drawing from (40, 40)
    And I drag to (140, 140)
    Then a preview ellipse is visible
    When I release the mouse
    Then no preview ellipse is visible

  Scenario: Ellipse has fill and stroke
    Given I open the app
    And I select the Ellipse tool
    When I draw an ellipse from (40, 40) to (140, 140)
    Then the ellipse has visible fill
    And the ellipse has visible stroke

  Scenario: Multiple ellipses persist
    Given I open the app
    And I select the Ellipse tool
    When I draw an ellipse from (40, 40) to (140, 140)
    And I draw an ellipse from (-200, -100) to (-100, 0)
    Then 2 ellipses exist on the canvas

  Scenario: Select ellipse with Selection tool
    Given I open the app
    And I select the Ellipse tool
    And I draw an ellipse from (100, 100) to (200, 200)
    When I select the Selection tool
    And I click at (150, 150)
    Then 1 shape is selected
    And 8 resize handles are visible

  Scenario: Move ellipse
    Given I open the app
    And an ellipse exists at (100, 100) with size (100, 100)
    And the ellipse is selected
    When I drag the shape from (150, 150) by (60, 40)
    Then the ellipse is at position (160, 140)

  Scenario: Resize ellipse
    Given I open the app
    And an ellipse exists at (100, 100) with size (100, 100)
    And the ellipse is selected
    When I drag the bottom-right handle by (40, 60)
    Then the ellipse has size (140, 160)
