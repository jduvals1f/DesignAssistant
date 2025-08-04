# Free Shadcn Blocks Collection

This folder contains a collection of free, reusable Shadcn UI blocks that you can use in your React projects. All blocks are built using Shadcn UI components and follow modern design patterns.

## 📦 Available Blocks

### 1. Hero Section (`hero-section.tsx`)
A modern hero section with a compelling headline, description, and call-to-action buttons.

**Features:**
- Responsive design
- Dark mode support
- Call-to-action buttons
- Clean typography

### 2. Feature Section (`feature-section.tsx`)
A feature showcase section with cards displaying key product features.

**Features:**
- Grid layout
- Icon support
- Card-based design
- Responsive grid

### 3. Pricing Section (`pricing-section.tsx`)
A pricing table with multiple plans and feature comparisons.

**Features:**
- Multiple pricing tiers
- Popular plan highlighting
- Feature lists
- Responsive design

### 4. Testimonial Section (`testimonial-section.tsx`)
A customer testimonial section with avatar support.

**Features:**
- Customer testimonials
- Avatar components
- Card layout
- Professional styling

### 5. Contact Section (`contact-section.tsx`)
A contact form section with proper form controls.

**Features:**
- Contact form
- Form validation ready
- Responsive layout
- Professional styling

### 6. Footer Section (`footer-section.tsx`)
A comprehensive footer with navigation links and social media.

**Features:**
- Multi-column layout
- Social media links
- Navigation sections
- Copyright information

## 🚀 Usage

1. **Install Dependencies**
   Make sure you have Shadcn UI components installed in your project:
   ```bash
   npx shadcn@latest add button card badge input label textarea avatar
   ```

2. **Import and Use**
   ```tsx
   import { HeroSection } from './shadcn-blocks/hero-section';
   import { FeatureSection } from './shadcn-blocks/feature-section';
   import { PricingSection } from './shadcn-blocks/pricing-section';
   import { TestimonialSection } from './shadcn-blocks/testimonial-section';
   import { ContactSection } from './shadcn-blocks/contact-section';
   import { FooterSection } from './shadcn-blocks/footer-section';

   function App() {
     return (
       <div>
         <HeroSection />
         <FeatureSection />
         <PricingSection />
         <TestimonialSection />
         <ContactSection />
         <FooterSection />
       </div>
     );
   }
   ```

## 🎨 Customization

All blocks are fully customizable:

- **Colors**: Modify the Tailwind CSS classes to match your brand colors
- **Content**: Update the text content and data arrays
- **Layout**: Adjust spacing, padding, and grid layouts
- **Components**: Replace or modify Shadcn UI components as needed

## 📱 Responsive Design

All blocks are built with responsive design in mind:
- Mobile-first approach
- Responsive breakpoints (sm, md, lg, xl)
- Flexible grid layouts
- Adaptive typography

## 🌙 Dark Mode Support

All blocks include dark mode support through Tailwind CSS classes:
- `dark:` prefixed classes for dark mode styles
- Automatic theme switching
- Consistent color schemes

## 🔧 Requirements

- React 18+
- Tailwind CSS
- Shadcn UI components
- TypeScript (recommended)

## 📄 License

These blocks are free to use in any project, commercial or personal.

## 🤝 Contributing

Feel free to modify these blocks or create new ones! Share your improvements with the community.

---

**Note**: These blocks were created as free alternatives to premium Shadcn blocks. They provide the same functionality and design quality without any cost. 