Here is a comprehensive master list of best practices distilled from leading UX/UI design resources (including design-system checklists, heuristic guidelines, pattern libraries, A/B‑test repositories and case studies). These practices are intended for a custom GPT that reviews designs and suggests improvements or plug‑and‑play code for non‑designer engineers. Each recommendation is grounded in publicly available evidence and organized into thematic categories.

⸻

1. Adopt a Robust Design System

Use checklists to plan and evolve design systems.
	•	Checklist.Design and similar projects stress that a design system should contain a structured design language, foundations (typography, colour, spacing), core components and a clear maintenance plan ￼. Encourage the GPT to verify whether the product uses a coherent design language and that components are reusable rather than bespoke.

Document components and tokens.
	•	A design system should include standardized components (buttons, forms, navigation, etc.) with usage rules, code snippets and accessibility requirements ￼. Document design tokens (colours, spacing units, font sizes) and ensure that engineers can import them directly.

Centralize and update resources.
	•	Use tools like Component Gallery, which catalogues 63 components and 92 design systems as reference examples ￼. Encourage the GPT to cross‑check designs against these references to ensure consistency and up‑to‑date practices.

Provide plug‑and‑play code.
	•	Leverage open‑source design systems (e.g., Chakra UI, Blueprint, Reshaped) listed in component galleries ￼. Engineers can import these libraries to get responsive, accessible components out of the box. When suggesting improvements, the GPT should link to relevant components and supply example code snippets.

⸻

2. Base Decisions on Design Principles

Use design principles as a compass.
	•	Design principles are guidelines that help teams make wise trade‑offs and maintain a cohesive, user‑centric product ￼. They promote efficiency and consistency ￼. Encourage the GPT to check whether a design adheres to the product’s principles (e.g., “focus on the user,” “simplicity,” “respect privacy”).

Prioritize clarity and simplicity.
	•	Effective UI design impacts user engagement and conversion. It requires clear purpose and removal of unnecessary elements ￼. The GPT should flag cluttered screens and recommend simplifying content.

Establish visual hierarchy and consistency.
	•	Guide attention through size, colour and whitespace ￼. Maintain uniform typography, colour palette and spacing across screens to reduce cognitive load ￼.

Provide immediate feedback.
	•	Users need to see that their actions have been registered. Offer loading indicators, success confirmations and clear error messages ￼. The GPT should check for missing feedback and propose patterns or code to show loading spinners and status messages.

Implement accessibility standards.
	•	Design for all users by ensuring sufficient colour contrast, alt text for images and keyboard navigation ￼. Encourage the GPT to run automated accessibility checks (e.g., aria attributes) and suggest code fixes when necessary.

⸻

3. Apply Usability Heuristics

Follow Nielsen’s 10 heuristics.
	•	A widely recognised checklist includes: system status visibility; match between system and real‑world concepts; user control and freedom; consistency and standards; error prevention; recognition over recall; flexibility and efficiency; simple and clean design; error handling; and help/documentation ￼. These heuristics help catch usability issues early, boost satisfaction and reduce support costs ￼.

Check system status visibility.
	•	The GPT should ensure that interfaces provide immediate feedback on actions (e.g., button state changes, progress bars) ￼.

Encourage user control and freedom.
	•	Users should be able to undo/redo actions, exit modals and cancel operations easily ￼. Add cancel buttons, back navigation and undo functionality.

Match real‑world conventions.
	•	Use familiar language and icons; organize information in logical order ￼. Avoid jargon; if technical terms are necessary, provide explanations ￼.

Prevent errors and handle them gracefully.
	•	Provide inline validation for forms, disable unavailable actions and offer suggestions for correcting mistakes ￼. Error messages should be specific and constructive ￼.

⸻

4. Consider Cognitive and Psychological Principles

Leverage the Laws of UX.
	•	Recognize that decision time increases with the number and complexity of choices (Hick’s law ￼), target acquisition depends on size and distance (Fitts’s law ￼) and users prefer familiar patterns (Jakob’s law ￼). Use chunking ￼, proximity ￼ and similarity ￼ to structure information.

Manage cognitive load.
	•	Keep forms and menus short; highlight essential actions; avoid unnecessary features. Consider Miller’s law (people can hold 7±2 items in working memory ￼). The GPT should identify screens with excessive options and recommend grouping or removing items.

Apply flow and goal-gradient principles.
	•	Design tasks so users feel progress and momentum toward goals ￼. Progress bars or completion indicators can motivate users to finish tasks.

⸻

5. Draw on Pattern Libraries and Real‑World Examples

Use curated repositories.
	•	Component Gallery aggregates components and design systems, offering up‑to‑date reference examples ￼. UI‑Patterns.com explains that design patterns are recurring solutions to common design problems, serving as standard references for experienced designers ￼.

Explore real‑world screens.
	•	Mobbin offers over 500,000 screens and 1,000 iOS/Android/Web apps ￼ and lets users find design patterns quickly ￼. UI Sources allows browsing 800+ interaction videos and 2,400+ screenshots to benchmark against top apps ￼. SaaSFrame provides a large library of SaaS pages and lets users switch between desktop and mobile, download Figma files and use advanced filtering ￼. Pttrns gives access to thousands of curated mobile design patterns and a community to discuss them ￼. Encourage the GPT to reference these libraries to suggest common patterns for specific flows (e.g., onboarding, checkout).

Organize inspiration by flow.
	•	Many pattern libraries categorize content by flow (onboarding, checkout, search/filter, etc.). The GPT should identify the current flow in a design and recommend patterns from these categories to enhance user journeys.

⸻

6. Learn from A/B Tests and Data‑Driven Patterns

Review successful and failed experiments.
	•	Good UI publishes winning and losing A/B tests from companies like Amazon, Netflix, Etsy and more ￼. It advocates improving UI through design experiments rather than guesswork ￼. The GPT can recommend patterns with evidence of positive impact (e.g., using trust seals, benefit bars) and warn against patterns that performed poorly.

Encourage continuous experimentation.
	•	Suggest that teams test variations of critical elements (call‑to‑action labels, layouts, pricing displays). Provide guidelines on setting up experiments ethically, measuring success (conversion, engagement) and iterating based on results.

⸻

7. Integrate Ethical and Humane Design

Empower users.
	•	Humane by Design emphasises creating products that prioritize user value over revenue ￼. Best practices include giving users control over algorithms, privacy and anonymity ￼, ensuring technology is invisible until needed ￼, promoting awareness of usage habits ￼ and keeping humans in the loop with AI decisions ￼. The GPT should check whether designs respect user autonomy and propose design changes (e.g., privacy settings, option to opt out of personalization).

Design inclusively and responsibly.
	•	Adopt inclusive design principles to avoid excluding people based on ability, language or culture. Avoid dark patterns and manipulative strategies. Consider the psychological impact of features such as infinite scroll or gambling‑like mechanisms, referencing Growth.Design’s case studies on topics like the psychology of Temu’s casino‑like shopping and ethical use of scarcity ￼ ￼.

⸻

8. Structure Information and Navigation

Map user journeys.
	•	Use case studies from resources like Growth.Design and Built for Mars to understand how successful products structure onboarding, retention and revenue flows. Growth.Design offers 60+ case studies that apply psychology to improve product experiences; they teach concepts through comics and short lessons ￼. Built for Mars provides UX research and examples packaged into digestible stories ￼.

Create intuitive navigation.
	•	UI patterns such as tabbed interfaces, accordions and popovers, described in Component Gallery ￼ ￼, help structure complex content without overwhelming users. The GPT should suggest appropriate patterns for the context (e.g., tabs for switching between sections, accordions for FAQs).

Optimize forms and conversion paths.
	•	Minimize form fields, group related questions and provide inline validation ￼. Break long forms into steps and autofill information when possible.

⸻

9. Ensure Responsiveness and Mobile‑First Design

Design for mobile users.
	•	With a significant portion of users on mobile, ensure that touch targets are at least 44×44 pixels, pages load quickly and navigation is thumb‑friendly ￼. The GPT should check breakpoints and propose CSS adjustments or component usage to maintain usability across devices.

Test on real devices.
	•	Evaluate designs on different screen sizes and orientations. Use frameworks like responsive design checklists (e.g., from Webstacks) and pattern libraries (Mobbin, SaaSFrame) to see how others implement responsive layouts.

⸻

10. Facilitate Developer Handoff

Provide annotated mock‑ups and code snippets.
	•	The GPT should generate recommendations that include both design rationale and ready‑to‑use code (HTML/JSX/CSS). When referencing specific components (e.g., buttons, forms), include code that integrates with popular frameworks (React, Vue, etc.) and respects design tokens.

Maintain version control and documentation.
	•	Encourage teams to use a centralized platform (e.g., Storybook, Figma) where designers and developers can access the design system and contribute updates ￼. Document guidelines for each component, including accessibility notes and implementation examples.

Highlight trade‑offs and context.
	•	Because best practices are not universal, the GPT should be sceptical when recommending changes. It should ask clarifying questions about user needs, business goals and constraints before prescribing solutions. For example, adding a “Buy Now” button might increase conversions but conflict with ethical design if it encourages impulsive purchases.

⸻

11. Encourage Continuous Learning

Stay informed with curated resources.
	•	Subscribe to newsletters or case‑study services that make learning engaging. Growth.Design teaches psychology through weekly comics ￼; Built for Mars offers digestible UX research, AI‑powered insights and cheat sheets ￼. Both resources are designed for busy professionals and non‑designers, making them suitable for engineers.

Promote a culture of curiosity.
	•	The GPT should encourage teams to explore new patterns, read case studies and test hypotheses. Highlight that design is iterative and evidence‑based, not a one‑time exercise.

⸻

Final Thought

These best practices are heuristics, not immutable rules. A design that works for Amazon may not suit a niche SaaS product, and an A/B test from 2025 may not apply in a different context. Use this master list as a living guide—paired with user research, analytics and iterative testing—to help your custom GPT offer grounded, context‑sensitive recommendations and code that empower non‑designer engineers to build thoughtful, effective products.