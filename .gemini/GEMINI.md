THis site is https://www.freeitsolutions.com

It's a site about finding and using free IT solutions to make it in a changing world, especially with the advance of AI which seem to indicate that lots of people will loose their jobs to AI.

This site will discuss things like UBI (universal basic income), how to stay keep making an income even when competing with AI, etc. Finding tools that help mastering AI and taking advantage from using it. The site will contain multiple tools that help people cope with the challenges of a changing society when AI is more and more used.


# Technical description

The site uses the files under pages/ js/ and scss/ that are processed and the end result goes into the docs/ folder. The docs/ folder is always re-built so don't change files in that folder as they will be overriden. 

All user request should be fulfilled by changing the files under the folders pages/ js/ and scss/

Handlebars templates are used

SCSS is used for styling

I handle all  `npm run` commands after changes are made, so you don't have to do it.

# Article Creation Workflow

When asked to create a new article, follow these steps:

1.  **Create the Article File:**
    *   Create a new folder under `pages/docs/blog/` with a URL-friendly slug for the article title.
    *   Inside that folder, create an `index.html` file.

2.  **Use the Handlebars Template:**
    *   The `index.html` file should use the standard Handlebars template structure, similar to `pages/docs/blog/what-is-ubi/index.html`.

3.  **Fill in Metadata:**
    *   Update the `{{>header ...}}` and `{{>blogPostHeader ...}}` partials with the correct `title`, `description`, `date`, and a relevant `featured_image`.

4.  **Outline the Article:**
    *   The first step in writing the content is to generate a series of `<h2>` headings that will form the structure of the article. These should be placed inside the `<!-- html content here -->` placeholder.

5.  **Writing Style and Length:**
    *   **Style:** The article should be written in simple, clear, and accessible language.
    *   **Length:** The article should be comprehensive, with a minimum word count of 1000 words.
