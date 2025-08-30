
Built by https://www.blackbox.ai

---

# Keita Yamada - Portfolio

## Project Overview

This project is a personal portfolio website for Keita Yamada, showcasing various web design experiments and creative projects. The site features an interactive background effect using WebGL, built with the three.js library, and offers a clean, modern design aesthetic to highlight the showcased works.

## Installation

To run the portfolio locally, simply clone the repository and open `index.html` in a web browser. 

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd <project-directory>
   ```
3. Open `index.html` in your preferred web browser.

## Usage

The portfolio allows users to navigate through different sections including projects, social media links, and FAQs. Users can toggle between light, dark, and monospaced themes using the provided buttons. 

### Browsing Projects

- Click on a project title to open the live project in a new tab.
- Users can scroll through the projects listed and view additional information such as project dates and contributors.

### The Background Effect

The website employs a WebGL animated background effect. Make sure your browser supports WebGL for optimal experience.

## Features

- Interactive theme toggling (Light, Dark, Monospaced)
- Smooth navigation experience through the use of anchors.
- Live links to projects and external social media for easy access.
- Integrated FAQ section addressing common inquiries about the portfolio and its development.

## Dependencies

This project utilizes the following libraries:

- **three.js** : A JavaScript library that makes creating 3D graphics in the web easier.
- **GSAP**: For creating smooth animations.
- **Tweakpane**: For UI controls to adjust parameters dynamically.
- **Alpine.js**: A minimal framework for composing JavaScript behavior in your HTML.

To include these libraries, the necessary `<script>` tags are included in `index.html`.

## Project Structure

The project structure is organized as follows:

```
/portfolio
│
├── index.html       # The main HTML file for the portfolio
├── css/
│   └── styles.css   # CSS file for styling the portfolio
├── js/
│   ├── main.js      # Main JavaScript file for interactive functionalities
│   └── shaders.js    # GLSL shader programs for WebGL effects
```

### Key Files Explained

- **index.html**: The principal document that defines the structure of the portfolio.
- **css/styles.css**: Contains styles for layout and design elements.
- **js/main.js**: Handles all interactive JavaScript behaviors, such as theme toggling and WebGL effects.
- **js/shaders.js**: Contains WebGL shaders used to create the background animations.

## Contribution

For issues, suggestions, or contributions, please reach out through my contact link in the portfolio or via social media.

## License

This project is not open source, and the code cannot be reused without permission. For inquiries, please contact Keita Yamada.

---

Thank you for visiting my portfolio! I hope you enjoy exploring my work and the experiments that illustrate my belief in diverse and inspiring web design.