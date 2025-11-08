# Meraki

A custom Shopify theme for Meraki espresso machines, featuring responsive design and unified carousel components.

## Project Overview

Meraki is a production-ready Shopify theme designed for showcasing premium espresso machines and accessories. The theme emphasizes visual appeal, smooth animations, and seamless responsive behavior across all devices.

## Key Features

### Responsive Design System
- Dynamic scaling based on viewport width (990px - 1920px)
- Unified scale factors for desktop and mobile layouts
- CSS variables for consistent sizing across components

### Custom Sections
- **Move Effect**: Animated homepage banner with parallax effects
- **Sell Points**: Product highlights carousel with video support
- **Video**: YouTube integration with custom player and carousel
- **PRs**: Press releases carousel with stack-fade animation
- **Accessory**: Product accessories showcase with dual-track carousel
- **News**: Latest updates and articles carousel
- **Exhibition Cards**: Event and exhibition display
- **Awards**: Recognition and achievements showcase
- **Subscribe**: Newsletter subscription with feature highlights
- **Support**: Customer support information
- **Footer**: Multi-column footer with navigation links

### Unified Carousel Component
The `MerakiCarousel` JavaScript component provides four animation modes:
- **Slide**: Standard horizontal sliding
- **Stack-Fade**: Card stacking with fade transitions
- **Slide-Fade**: Combined sliding with opacity changes
- **Scale-Slide**: Scaling center items with sliding

Features:
- Touch gesture support for mobile devices
- Responsive reinitialization on window resize
- Configurable item width, gap, and initial offset
- Customizable transition duration and easing
- Desktop-only mode option

## Technical Stack

### Frontend
- Liquid (Shopify templating language)
- Vanilla JavaScript (ES6+)
- CSS3 with CSS Variables
- HTML5

### Key Libraries
- `lite-youtube.js`: Lightweight YouTube embed with lazy loading

### Architecture
- Component-based CSS organization
- Modular JavaScript with IIFE pattern
- Shared styles via `meraki-common.css`
- Global scaling system via `meraki-global-scale.js`

## File Structure

```
meraki/
├── assets/
│   ├── meraki-carousel.js          # Unified carousel component
│   ├── meraki-global-scale.js      # Responsive scaling system
│   ├── meraki-common.css           # Shared styles
│   ├── meraki-*.css                # Section-specific styles
│   ├── lite-youtube.js             # YouTube player
│   └── ...
├── sections/
│   ├── meraki-move-effect.liquid   # Banner section
│   ├── meraki-video.liquid         # Video carousel
│   ├── meraki-prs.liquid           # Press releases
│   ├── meraki-sell-points.liquid   # Product highlights
│   ├── meraki-accessory.liquid     # Accessories showcase
│   ├── meraki-news.liquid          # News carousel
│   └── ...
├── layout/
│   └── theme.liquid                # Main layout template
├── config/
│   └── settings_schema.json        # Theme settings
├── templates/
│   └── index.json                  # Homepage template
└── snippets/
    └── ...
```

## Development Setup

### Prerequisites
- Shopify CLI
- Node.js (for local development tools)
- Git

### Local Development
```bash
# Start local development server
shopify theme dev

# Access local preview
# http://127.0.0.1:9292
```

### Deployment
```bash
# Push to Shopify theme
shopify theme push

# Or push to specific theme
shopify theme push --theme-id YOUR_THEME_ID
```

## Responsive Breakpoints

- Mobile: < 990px
- Desktop: >= 990px
- Desktop scaling: 990px - 1920px (dynamic)
- Desktop max: >= 1920px (scale factor = 1)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS 12+)
- Chrome Mobile (Android 8+)

## Performance Optimizations

- Lazy loading for images and videos
- CSS containment for carousel items
- Transform-based animations (GPU-accelerated)
- Debounced resize handlers
- Minimal JavaScript bundle size

## Code Quality

- Consistent naming conventions (BEM-style CSS)
- Modular component architecture
- Comprehensive inline documentation
- Accessibility-aware focus management
- Cross-browser compatibility

