Feature: Inspector Panel

  Scenario: Inspector hidden when nothing selected
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    Then the Inspector panel is hidden

  Scenario: Inspector shows properties for selected shape
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    When I click at (150, 150)
    Then the Inspector panel is visible
    And the Inspector title is "Rectangle"
    And the Inspector shows X as 100
    And the Inspector shows Y as 100
    And the Inspector shows W as 100
    And the Inspector shows H as 100
    And the Inspector shows fill color
    And the Inspector shows stroke color

  Scenario: Inspector shows count for multi-selection
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And a rectangle exists at (300, 100) with size (100, 100)
    When I drag a marquee from (50, 50) to (450, 250)
    Then the Inspector title is "Selection"
    And the Inspector shows "2 shapes selected"

  Scenario: New rectangles have default colors
    Given I open the app
    And I select the Rectangle tool
    When I draw a rectangle from (40, 40) to (140, 140)
    And I select the Selection tool
    And I click at (90, 90)
    Then the Inspector shows fill as "#3b82f6"
    And the Inspector shows stroke as "#60a5fa"

  # Editable Fields
  Scenario: Edit position X via Inspector
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I set Inspector X to "200"
    Then the Inspector shows X as 200
    And the rectangle is at position (200, 100)

  Scenario: Edit position Y via Inspector
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I set Inspector Y to "60"
    Then the Inspector shows Y as 60
    And the rectangle is at position (100, 60)

  Scenario: Edit width via Inspector
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I set Inspector W to "200"
    Then the Inspector shows W as 200
    And the rectangle has size (200, 100)

  Scenario: Edit height via Inspector
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I set Inspector H to "60"
    Then the Inspector shows H as 60
    And the rectangle has size (100, 60)

  Scenario: Position values snap to grid
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I set Inspector X to "115"
    Then the Inspector shows X as 120
    And the rectangle is at position (120, 100)

  Scenario: Size values snap to grid
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I set Inspector W to "73"
    Then the Inspector shows W as 80
    And the rectangle has size (80, 100)

  Scenario: Size enforces minimum of one grid unit
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I set Inspector W to "5"
    Then the Inspector shows W as 20
    And the rectangle has size (20, 100)

  Scenario: Position allows negative values
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I set Inspector X to "-60"
    Then the Inspector shows X as -60
    And the rectangle is at position (-60, 100)

  Scenario: Edit fill color via Inspector
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I set Inspector fill to "#ff0000"
    Then the Inspector shows fill as "#ff0000"
    And the rectangle has fill color "#ff0000"

  Scenario: Edit stroke color via Inspector
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I set Inspector stroke to "#00ff00"
    Then the Inspector shows stroke as "#00ff00"
    And the rectangle has stroke color "#00ff00"

  Scenario: Invalid color reverts to previous value
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I set Inspector fill to "notacolor"
    Then the Inspector shows fill as "#3b82f6"

  Scenario: Changes apply on Enter key
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I type "200" in Inspector X and press Enter
    Then the Inspector shows X as 200
    And the rectangle is at position (200, 100)

  Scenario: Tab navigates between Inspector fields
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I focus Inspector X field
    And I press Tab
    Then Inspector Y field is focused

  Scenario: Backspace in Inspector field does not delete shape
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    And the rectangle is selected
    When I type "200" in Inspector X and press Backspace
    Then the rectangle still exists
    And the Inspector shows X as 20

  Scenario: Copy and paste text within Inspector fields
    Given I open the app
    And an ellipse exists at (100, 100) with size (80, 120)
    And the ellipse is selected
    When I copy Inspector W value and paste into Inspector H
    Then the Inspector shows H as 80
    And the ellipse has size (80, 80)

  # Line Arrowhead Toggles
  Scenario: Line shows arrowhead toggles in Inspector
    Given I open the app
    And a line exists from (100, 100) to (200, 200)
    And the line is selected
    Then the Inspector shows start arrowhead toggle
    And the Inspector shows end arrowhead toggle
    And the start arrowhead toggle is off
    And the end arrowhead toggle is off

  Scenario Outline: Toggle arrowhead on
    Given I open the app
    And a line exists from (100, 100) to (200, 200)
    And the line is selected
    When I toggle the <end> arrowhead on
    Then the line has an arrowhead at the <end>

    Examples:
      | end   |
      | start |
      | end   |

  Scenario: Toggle arrowhead off
    Given I open the app
    And I select the Arrow tool
    And I draw a line from (100, 100) to (200, 200)
    And the line is selected
    When I toggle the end arrowhead off
    Then the line has no arrowhead at the end

  # Text Inspector
  Scenario: Text shows text-specific properties in Inspector
    Given I open the app
    And a text box exists at (100, 100) with size (160, 60) containing "Hello"
    When I click at (150, 130)
    Then the Inspector panel is visible
    And the Inspector title is "Text"
    And the Inspector shows X as 100
    And the Inspector shows Y as 100
    And the Inspector shows W as 160
    And the Inspector shows H as 60
    And the Inspector shows font family selector
    And the Inspector shows alignment buttons
    And the Inspector shows fill color
    And the Inspector does not show stroke color

  Scenario: Text has default Sans font
    Given I open the app
    And a text box exists at (100, 100) with size (160, 60) containing "Hello"
    When I click at (150, 130)
    Then the Inspector shows font family as "Sans"

  Scenario Outline: Change font family
    Given I open the app
    And a text box exists at (100, 100) with size (160, 60) containing "Hello"
    And the text box is selected
    When I set Inspector font family to "<font>"
    Then the Inspector shows font family as "<font>"
    And the text box uses font "<font>"

    Examples:
      | font  |
      | Serif |
      | Sans  |
      | Mono  |

  Scenario: Text has default Left alignment
    Given I open the app
    And a text box exists at (100, 100) with size (160, 60) containing "Hello"
    When I click at (150, 130)
    Then the Inspector shows alignment as "Left"

  Scenario Outline: Change text alignment
    Given I open the app
    And a text box exists at (100, 100) with size (160, 60) containing "Hello"
    And the text box is selected
    When I set Inspector alignment to "<alignment>"
    Then the Inspector shows alignment as "<alignment>"
    And the text box has alignment "<alignment>"

    Examples:
      | alignment |
      | Left      |
      | Center    |
      | Right     |

  # Shape Text Alignment
  Scenario: Rectangle with text shows alignment controls
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100) with text "Label"
    When I click at (150, 150)
    Then the Inspector shows horizontal alignment buttons
    And the Inspector shows vertical alignment buttons

  Scenario: Rectangle without text hides alignment controls
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100)
    When I click at (150, 150)
    Then the Inspector does not show horizontal alignment buttons
    And the Inspector does not show vertical alignment buttons

  Scenario Outline: Change rectangle text horizontal alignment
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100) with text "Label"
    And the rectangle is selected
    When I set Inspector horizontal alignment to "<alignment>"
    Then the rectangle text is aligned "<alignment>" horizontally

    Examples:
      | alignment |
      | Left      |
      | Center    |
      | Right     |

  Scenario Outline: Change rectangle text vertical alignment
    Given I open the app
    And a rectangle exists at (100, 100) with size (100, 100) with text "Label"
    And the rectangle is selected
    When I set Inspector vertical alignment to "<alignment>"
    Then the rectangle text is aligned "<alignment>" vertically

    Examples:
      | alignment |
      | Top       |
      | Middle    |
      | Bottom    |
