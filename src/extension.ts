import * as vscode from 'vscode';

// Utility functions for case conversions
function splitWords(text: string): string[] {
	// Split by common delimiters and preserve word boundaries
	return text
		.replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase/PascalCase
		.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2') // Handle acronyms
		.split(/[\s_\-/.]+/) // Split by space, underscore, dash, dot, slash
		.filter(word => word.length > 0);
}

function toCamelCase(text: string): string {
	const words = splitWords(text);
	if (words.length === 0) return text;
	return words[0].toLowerCase() + words.slice(1).map(word => 
		word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
	).join('');
}

function toSnakeCase(text: string): string {
	return splitWords(text).map(word => word.toLowerCase()).join('_');
}

function toPascalCase(text: string): string {
	return splitWords(text).map(word => 
		word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
	).join('');
}

function toScreamingSnakeCase(text: string): string {
	return splitWords(text).map(word => word.toUpperCase()).join('_');
}

function toKebabCase(text: string): string {
	return splitWords(text).map(word => word.toLowerCase()).join('-');
}

function toTitleCase(text: string): string {
	return splitWords(text).map(word => 
		word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
	).join(' ');
}

function toSentenceCase(text: string): string {
	const words = splitWords(text);
	if (words.length === 0) return text;
	return words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase() + 
		(words.length > 1 ? ' ' + words.slice(1).map(w => w.toLowerCase()).join(' ') : '');
}

function toDotCase(text: string): string {
	return splitWords(text).map(word => word.toLowerCase()).join('.');
}

function toPathCase(text: string): string {
	return splitWords(text).map(word => word.toLowerCase()).join('/');
}

// Convert JSON object keys
function convertJsonKeys(jsonText: string, converter: (text: string) => string): string {
	try {
		const obj = JSON.parse(jsonText);
		const converted = convertObjectKeys(obj, converter);
		return JSON.stringify(converted, null, 2);
	} catch {
		return jsonText;
	}
}

function convertObjectKeys(obj: any, converter: (text: string) => string): any {
	if (Array.isArray(obj)) {
		return obj.map(item => convertObjectKeys(item, converter));
	} else if (obj !== null && typeof obj === 'object') {
		const result: any = {};
		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {
				const newKey = converter(key);
				result[newKey] = convertObjectKeys(obj[key], converter);
			}
		}
		return result;
	}
	return obj;
}

// Get the converter function by case type
function getConverter(caseType: string): (text: string) => string {
	switch (caseType) {
		case 'camelCase': return toCamelCase;
		case 'snake_case': return toSnakeCase;
		case 'PascalCase': return toPascalCase;
		case 'SCREAMING_SNAKE_CASE': return toScreamingSnakeCase;
		case 'kebab-case': return toKebabCase;
		case 'Title Case': return toTitleCase;
		case 'Sentence case': return toSentenceCase;
		case 'dot.case': return toDotCase;
		case 'path/case': return toPathCase;
		default: return (text: string) => text;
	}
}

// Create webview panel for UI
function createCaseConverterPanel(context: vscode.ExtensionContext) {
	const panel = vscode.window.createWebviewPanel(
		'caseConverterUI',
		'Case Converter',
		vscode.ViewColumn.One,
		{
			enableScripts: true
		}
	);

	panel.webview.html = getWebviewContent();

	// Handle messages from the webview
// ...existing code...
    // Handle messages from the webview
    panel.webview.onDidReceiveMessage(
        message => {
            switch (message.command) {
                case 'convert':
                    const converter = getConverter(message.caseType);
                    const input = message.text;
                    let result: string;

                    // Check if input looks like JSON (starts with { or [)
                    const looksLikeJson = input.trim().startsWith('{') || input.trim().startsWith('[');

                    // Try to parse as JSON first
                    try {
                        JSON.parse(input);
                        result = convertJsonKeys(input, converter);
                    } catch {
                        // If it looks like JSON but failed to parse, show error
                        if (looksLikeJson) {
                            panel.webview.postMessage({ 
                                command: 'error', 
                                message: 'Invalid JSON format. Please check your input.' 
                            });
                            return;
                        }

                        // If not JSON, check if it's multi-line
                        const lines = input.split('\n');
                        if (lines.length > 1) {
                            result = lines.map((line: string) => line.trim() ? converter(line.trim()) : line).join('\n');
                        } else {
                            result = converter(input);
                        }
                    }

                    panel.webview.postMessage({ command: 'result', text: result });
                    break;
            }
        },
        undefined,
        context.subscriptions
    );
}

function getWebviewContent(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Case Converter</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding: 20px;
            background-color: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        h1 {
            margin-bottom: 24px;
            color: var(--vscode-titleBar-activeForeground);
        }
        .controls {
            display: flex;
            gap: 12px;
            margin-bottom: 20px;
            align-items: center;
        }
        select {
            flex: 0 1 300px;
            max-width: 300px;
            padding: 8px 12px;
            background-color: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border: 1px solid var(--vscode-input-border);
            border-radius: 4px;
            font-size: 14px;
            cursor: pointer;
        }
        select:focus {
            outline: 1px solid var(--vscode-focusBorder);
        }
        select option[disabled] {
            display: none;
        }
        button {
            padding: 8px 24px;
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            border-radius: 4px;
            font-size: 14px;
            cursor: pointer;
            font-weight: 500;
            transition: background-color 0.2s;
        }
        button:hover:not(:disabled) {
            background-color: var(--vscode-button-hoverBackground);
        }
        button:active:not(:disabled) {
            transform: translateY(1px);
        }
        button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        .boxes {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
        }
        .box {
            display: flex;
            flex-direction: column;
        }
        .box-label {
            font-weight: 600;
            margin-bottom: 8px;
            color: var(--vscode-foreground);
            font-size: 14px;
        }
        .textarea-wrapper {
            position: relative;
        }
        .textarea-actions {
            position: absolute;
            top: 8px;
            right: 8px;
            display: flex;
            gap: 4px;
            z-index: 10;
        }
        .icon-btn {
            background-color: var(--vscode-button-background);
            border: none;
            padding: 6px 10px;
            cursor: pointer;
            font-size: 14px;
            opacity: 0.8;
            transition: opacity 0.2s, transform 0.1s;
            color: var(--vscode-button-foreground);
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .icon-btn:hover {
            opacity: 1;
            background-color: var(--vscode-button-hoverBackground);
        }
        .icon-btn:active {
            transform: scale(0.95);
        }
        textarea {
            width: 100%;
            min-height: 400px;
            padding: 12px;
            background-color: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border: 1px solid var(--vscode-input-border);
            border-radius: 4px;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 13px;
            line-height: 1.5;
            resize: vertical;
        }
        textarea:focus {
            outline: 1px solid var(--vscode-focusBorder);
        }
        textarea:read-only {
            background-color: var(--vscode-editor-inactiveSelectionBackground);
        }
        .error-message {
            display: none;
            padding: 12px;
            margin-bottom: 20px;
            background-color: var(--vscode-inputValidation-errorBackground);
            border: 1px solid var(--vscode-inputValidation-errorBorder);
            border-radius: 4px;
            color: var(--vscode-errorForeground);
            font-size: 14px;
        }
        .error-message.show {
            display: block;
        }
        .info {
            margin-top: 12px;
            padding: 12px;
            background-color: var(--vscode-textBlockQuote-background);
            border-left: 4px solid var(--vscode-textBlockQuote-border);
            border-radius: 4px;
            font-size: 13px;
            line-height: 1.6;
        }
        .info strong {
            color: var(--vscode-textPreformat-foreground);
        }
        @media (max-width: 768px) {
            .boxes {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔄 Case Converter</h1>
        
        <div class="controls">
            <select id="caseType">
                <option value="" disabled selected>Select case to convert</option>
                <option value="camelCase">camelCase</option>
                <option value="snake_case">snake_case</option>
                <option value="PascalCase">PascalCase</option>
                <option value="SCREAMING_SNAKE_CASE">SCREAMING_SNAKE_CASE</option>
                <option value="kebab-case">kebab-case</option>
                <option value="Title Case">Title Case</option>
                <option value="Sentence case">Sentence case</option>
                <option value="dot.case">dot.case</option>
                <option value="path/case">path/case</option>
            </select>
            <button id="convertBtn" disabled>Convert</button>
        </div>

        <div id="errorMessage" class="error-message">
            ⚠️ <span id="errorText"></span>
        </div>

        <div class="boxes">
            <div class="box">
                <div class="box-label">📝 Input</div>
                <textarea id="input" placeholder="Enter text, multiple lines, or JSON object here..."></textarea>
            </div>
            <div class="box">
                <div class="box-label">✨ Output</div>
                <div class="textarea-wrapper">
                    <div class="textarea-actions">
                        <button class="icon-btn" id="copyBtn" title="Copy to clipboard">📋</button>
                        <button class="icon-btn" id="clearBtn" title="Clear output">✖️</button>
                    </div>
                    <textarea id="output" readonly placeholder="Converted text will appear here..."></textarea>
                </div>
            </div>
        </div>

        <div class="info">
            <strong>💡 Tip:</strong> You can convert single string, multiple line string (each line converted separately), 
            or JSON object (all keys will be converted in selected case type and its values preserved).
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        const convertBtn = document.getElementById('convertBtn');
        const input = document.getElementById('input');
        const output = document.getElementById('output');
        const caseType = document.getElementById('caseType');
        const errorMessage = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        const copyBtn = document.getElementById('copyBtn');
        const clearBtn = document.getElementById('clearBtn');

        function showError(message) {
            errorText.textContent = message;
            errorMessage.classList.add('show');
            setTimeout(() => {
                errorMessage.classList.remove('show');
            }, 5000); // Hide after 5 seconds
        }

        function hideError() {
            errorMessage.classList.remove('show');
        }

        // Enable/disable convert button based on dropdown selection
        caseType.addEventListener('change', () => {
            convertBtn.disabled = caseType.value === '';
        });

        convertBtn.addEventListener('click', () => {
            const text = input.value.trim();
            if (!text || caseType.value === '') {
                output.value = '';
                return;
            }
            
            hideError();
            
            vscode.postMessage({
                command: 'convert',
                text: text,
                caseType: caseType.value
            });
        });

        // Also convert on Enter key (Ctrl/Cmd + Enter)
        input.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !convertBtn.disabled) {
                convertBtn.click();
            }
        });

        // Copy output to clipboard
        copyBtn.addEventListener('click', () => {
            if (output.value) {
                navigator.clipboard.writeText(output.value).then(() => {
                    // Visual feedback
                    const originalText = copyBtn.textContent;
                    copyBtn.textContent = '✓';
                    setTimeout(() => {
                        copyBtn.textContent = originalText;
                    }, 1000);
                }).catch(err => {
                    showError('Failed to copy to clipboard');
                });
            }
        });

        // Clear output textarea
        clearBtn.addEventListener('click', () => {
            output.value = '';
        });

        // Handle messages from the extension
        window.addEventListener('message', event => {
            const message = event.data;
            switch (message.command) {
                case 'result':
                    output.value = message.text;
                    hideError();
                    break;
                case 'error':
                    showError(message.message);
                    output.value = '';
                    break;
            }
        });
    </script>
</body>
</html>`;
}
// ...existing code...

export function activate(context: vscode.ExtensionContext) {
	console.log('Case Converter extension is now active!');

	// Create status bar button at the bottom bar
	const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	statusBarItem.text = "🔄 Case Converter";
	statusBarItem.tooltip = "Open Case Converter";
	statusBarItem.command = 'case-converter';
	statusBarItem.show();
	context.subscriptions.push(statusBarItem);

	// Also show a notification that extension is active
	//vscode.window.showInformationMessage('Case Converter is ready! Click "🔄 Case" in the bottom bar.');

	// Register UI command
	const openUICommand = vscode.commands.registerCommand('case-converter', () => {
		createCaseConverterPanel(context);
	});
	context.subscriptions.push(openUICommand);
}

export function deactivate() {}
