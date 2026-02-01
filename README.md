# Case Converter UI

A Visual Studio Code extension that converts text between different case formats with an simple interface.

## Features

Convert strings, multiple lines, or JSON keys between 9 different case formats:

- **camelCase** - `myVariableName`
- **snake_case** - `my_variable_name`
- **PascalCase** - `MyVariableName`
- **SCREAMING_SNAKE_CASE** - `MY_VARIABLE_NAME`
- **kebab-case** - `my-variable-name`
- **Title Case** - `My Variable Name`
- **Sentence case** - `My variable name`
- **dot.case** - `my.variable.name`
- **path/case** - `my/variable/name`

### 🎯 Three Ways to Open

1. **Status Bar Button**: Click the "🔄 Case Converter" button at the bottom-right of VS Code
2. **Command Palette**: Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac) and type "Case Converter"
3. **Automatic**: The extension activates on VS Code startup

### 💡 How It Works

#### Single String Conversion
Convert any text string to your desired case format:

**Input:**
```
hello_world
```

**Output (camelCase):**
```
helloWorld
```

#### Multi-line String Conversion
Each line is converted independently:

**Input:**
```
first_name
last_name
email_address
```

**Output (camelCase):**
```
firstName
lastName
emailAddress
```

#### JSON Object Key Conversion
Convert all JSON keys while preserving values:

**Input:**
```json
{
  "name": "Ajit",
  "email_address": "test@example.com",
  "temporary_address":"hyderabad, India",
  "permanent_address": "Maharashtra, India",
  "user_settings": {
    "theme_color": "light",
    "font_size": 14
  }
}
```

**Output (camelCase):**
```json
{
  "name": "Ajit",
  "emailAddress": "test@example.com",
  "temporaryAddress":"hyderabad, India",
  "permanentAddress": "Maharashtra, India",
  "userSettings": {
    "themeColor": "light",
    "fontSize": 14
  }
}
```

**Note:** Only the keys are converted; all values (strings, numbers, booleans, nested objects) remain unchanged.

### ⚠️ Error Handling

If you enter invalid JSON (e.g., missing brackets or quotes), the extension will display a warning:

```
⚠️ Invalid JSON format. Please check your input.
```

The error message automatically disappears after 5 seconds.

## Usage

1. Click the **🔄 Case Converter** button in the status bar (bottom-right corner)
2. Enter your text in the **Input** box:
   - Single string (e.g., `user_name`)
   - Multiple lines (each line on a new line)
   - Valid JSON object
3. Select the desired case format from the **dropdown menu**
4. Click the **Convert** button
5. The converted result appears in the **Output** box


## Requirements

- Visual Studio Code version 1.107.0 or higher

## Extension Settings

This extension does not add any VS Code settings. It works out of the box with no configuration needed.

## Known Issues

If you encounter any issues or any imporvement, feedback, please report them on the [GitHub repository](https://github.com/230350320006-Ajit/case_converter.git).

## Release Notes

### 0.0.1

Initial release of Case Converter UI:
- 9 case conversion formats
- Intuitive UI with input/output boxes
- Support for single strings, multi-line text, and JSON
- Status bar button for quick access [at bottom right corner]
- Error handling for invalid JSON
---

## Tips

- **JSON Conversion**: Make sure your JSON is valid before converting (proper brackets, quotes, commas)
- **Multi-line**: Each line is treated as a separate string to convert
- **Values Preserved**: When converting JSON, only keys are changed - all values stay the same

**Enjoy converting your cases! 🚀**