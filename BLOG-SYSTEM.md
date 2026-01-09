# Blog Article Generation System

This document explains the automated blog article generation system for AC & Co. projects.

## System Overview

For every project in this repository, the system automatically generates a high-quality blog article that captures:
- The real-world insight that triggered the project
- The problem pattern observed
- Why existing solutions were insufficient
- How this project approaches it differently
- Lessons learned & future extensions

## System Rules

1. **Scan Projects:** System scans project folders and infers intent from:
   - README files
   - Code comments
   - UI copy
   - Configuration files
   - HTML content

2. **Generate Articles:** For each project, generate one markdown article in `/blog/` with:
   - Title (problem-first, long-tail SEO)
   - Insight Origin (what triggered this idea)
   - Problem Breakdown (non-generic, experiential)
   - Build Philosophy (why this approach)
   - Key Learnings (bulleted, practical)
   - Who This Is For
   - Internal links to related projects

3. **Tone:** Builder's journal, honest, non-marketing, insight-driven

4. **SEO:**
   - Use long-tail keywords
   - Natural headings (H2/H3)
   - No fluff, no AI-sounding phrases

5. **Updates:** When a new project is added or updated, suggest a new article or update

## File Naming Convention

Articles are named: `insight-<project-name>.md`

Examples:
- `insight-change-consulting.md`
- `insight-thinkgym.md`
- `insight-automate-your-business.md`

## Article Structure Template

```markdown
# [Problem-First, Long-Tail SEO Title]

[Opening paragraph that hooks with the core insight]

## Insight Origin

[What triggered this idea - real-world observation]

## Problem Breakdown

[Non-generic, experiential problem description]

## Why Existing Solutions Were Insufficient

[What's missing in current approaches]

## Build Philosophy

[Why this approach works differently]

## Key Learnings

- [Practical, bulleted learnings]
- [Based on real experience]

## Who This Is For

[Clear audience definition]

## Related Projects

- [Internal links to related projects]

## Future Extensions

[What's next, how this might evolve]
```

## Current Projects & Articles

✅ **Change Consulting** → `insight-change-consulting.md`
✅ **ThinkGym** → `insight-thinkgym.md`
✅ **Automate Your Business** → `insight-automate-your-business.md`
✅ **ThinkingFit** → `insight-thinkingfit.md`
✅ **ClearPath** → `insight-clearpath.md`

## Adding New Projects

When a new project is added:

1. Analyze the project's:
   - HTML content and copy
   - Problem statements
   - Solution approach
   - Target audience

2. Generate article following the template

3. Include internal links to related projects

4. Update `/blog/README.md` with new article

5. Commit with descriptive message

## SEO Best Practices

- **Titles:** Problem-first, include long-tail keywords
- **Headings:** Use H2/H3 naturally, not for keyword stuffing
- **Content:** No fluff, no AI-sounding phrases, honest builder's voice
- **Links:** Internal links to related projects for SEO value
- **Keywords:** Use naturally, focus on search intent

## Maintenance

- Review articles when projects are significantly updated
- Update "Future Extensions" sections as projects evolve
- Ensure internal links remain accurate
- Keep tone consistent across all articles
