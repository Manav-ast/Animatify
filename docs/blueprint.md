# **App Name**: Animatify

## Core Features:

- Code Generation: Translate natural language prompts into Python code using Manim to generate 2D animations. The tool uses an LLM to conditionally add comments to the code, only when they help readability.
- Code Display: Display the generated Manim code in a well-formatted code editor with syntax highlighting.
- Animation Preview: Execute the generated Manim code to render a preview of the animation.
- Video Export: Provide a download link for the generated animation in a common video format (e.g., MP4).
- Parameter Configuration: Implement a simple UI to configure animation parameters (e.g., duration, resolution, background color).

## Style Guidelines:

- Primary color: HSL(210, 65%, 50%) -> Hex: #3293F6 for a professional and engaging look.
- Background color: HSL(210, 20%, 95%) -> Hex: #F0F4F8 for a clean and modern backdrop.
- Accent color: HSL(240, 70%, 60%) -> Hex: #6754F0 for highlighting interactive elements.
- Body: 'Inter', sans-serif
- Headings: 'Space Grotesk', sans-serif; alternative is to use it also for the body.
- Code font: 'Source Code Pro', monospace; use for the display of generated Python code.
- Use a split-screen layout, with the code editor on one side and the animation preview on the other.
- Use a set of simple, modern icons for common actions (e.g., play, pause, download).
- Use subtle transitions and animations to provide feedback to the user.