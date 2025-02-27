# Simple Paint App

A beautiful, interactive canvas-based paint application built with vanilla JavaScript, HTML5, and CSS. Create colorful circular artwork with an intuitive drag-to-draw interface.

![Flow](https://github.com/user-attachments/assets/a5c96fe9-2205-4be4-9a3f-4b8416158ca3)

## Features

- **Intuitive Circle Drawing**: Click and drag to create circles of various sizes
- **Color Selection**: Choose from a curated palette of beautiful colors or use random colors
- **Interactive Feedback**: Toast notifications provide feedback on your actions
- **Hit/Miss Detection**: Click on the canvas to detect if you've hit a circle or missed
- **Circle Management**: Double-click to delete circles, track circle count
- **Keyboard Shortcuts**: Convenient shortcuts for common actions
- **Save Functionality**: Export your artwork as PNG images
- **Responsive Design**: Works on various screen sizes
- **Grid Background**: Subtle grid for better spatial awareness

## Installation

### Prerequisites
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Setup Instructions

1. Clone the repository:
   ```bash
   git@github.com:18-RAJAT/Paint-App-Sales.git
   cd Paint-App-Sales
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the URL shown in your terminal (typically http://localhost:5173)

## Usage Guide

### Drawing Circles
- **Click and drag** on the canvas to create a circle
- The size of the circle depends on how far you drag
- Release to place the circle

### Color Selection
- Click on a color in the palette to select it
- Click "Random Colors" to enable automatic random coloring

### Canvas Interaction
- Click on the canvas to test if you hit a circle (shows "Hit") or missed (shows "Miss")
- Double-click on a circle to delete it
- Use the "Reset Canvas" button to clear all circles

### Keyboard Shortcuts
- `Ctrl + Z`: Undo last circle
- `R`: Toggle random colors
- `C`: Clear canvas
- `S`: Save image

### Saving Your Work
- Click the "Save Image" button to download your creation as a PNG file
- Files are named with the current date for easy organization

## Technologies Used

- **HTML5 Canvas**: For drawing and rendering graphics
- **Vanilla JavaScript**: For all functionality and interactions
- **CSS3**: For styling and animations
- **Vite**: For fast development and building
- **Toastify-js**: For toast notifications

## Project Structure

```
Paint-App-Sales/
├── index.html          # Main HTML file
├── main.js             # Main JavaScript file with app logic
├── style.css           # CSS styles
├── counter.js          # Counter utility (not used in main app)
├── package.json        # Project dependencies and scripts
└── README.md           # Project documentation
```

## Customization

You can easily customize the app by:

1. Adding new colors to the palette:
   - Edit the color array in the `getRandomColor()` function
   - Add new color options to the HTML structure

2. Changing canvas size:
   - Modify the width and height attributes of the canvas element

3. Adding new features:
   - The modular code structure makes it easy to extend functionality

## Acknowledgments

- Color palettes inspired by [Coolors](https://coolors.co/)
- Toast notifications powered by [Toastify-js](https://github.com/apvarun/toastify-js)
