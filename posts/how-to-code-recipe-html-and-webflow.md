---
tags: post
emoji: 🍝
title: How to code a recipe in HTML and on Webflow
description: How to use the Recipe schema in plain html or on Webflow to have the correct metadata for your recipe - so it can be imported to recipe apps, etc.
techStack:
  - name: HTML
    version: null
    url: null
  - name: Webflow
    version: null
    url: https://www.webflow.com
  - name: JSON
    version: null
    url: https://schema.org/Recipe
---

## The Problem

I wanted to figure out how to code a recipe so that it can be imported into a recipe app like [Plan to Eat](https://www.plantoeat.com/welcome/) or show up nicely in Google search results or on my Google Home.

## Solution Summary

Add your recipe info as a json block in a `<script type="application/ld+json">` tag, following the [Recipe JSON Schema](https://schema.org/Recipe) from [schema.org](https://schema.org). See the [Google developer docs](https://developers.google.com/search/docs/appearance/structured-data/recipe) for more.

## The Explanation

In order for Google to know which parts of your page are recipe instructions - ingredients, steps, time to cook, etc - versus other kinds of content - like the long, winding story you'll probably tell before your recipe - you need to put the recipe instructions in a JSON block on the page as well. So your recipe content will be duplicated in two forms - as html on the page for users to read, and as JSON in a script tag for computers to read.

You'll need to follow the [Recipe](https://schema.org/Recipe) schema from [schema.org](https://schema.org/) when creating your JSON block, because that's the common standard. For example, if you wanted to add your recipe's list of ingredients, that would look like:

```json
{
  "recipeIngredient": [
    "0.5 teaspoon olive oil",
    "2 tablespoons grated Parmigiano-Reggiano cheese for topping",
    "1 cup marinara sauce, heated, or more as needed",
    "1 tablespoon chopped fresh flat-leaf parsley"
  ]
}
```

### Basic HTML example

You'll put the JSON schema content in a `script` block with a `type` of `"application/ld+json"`, either in your `head` tag or at the end of your `body` tag. You can also test your code with Google via their [Rich Results Test](https://search.google.com/test/rich-results) to see what it looks like and if it's valid. See the simple example below from [Google developer docs](https://developers.google.com/search/docs/appearance/structured-data/recipe).

```html
<html>
  <head>
    <title>Non-Alcoholic Piña Colada</title>
    <script type="application/ld+json">
      {
        "@context": "https://schema.org/",
        "@type": "Recipe",
        "name": "Non-Alcoholic Piña Colada",
        "image": ["https://example.com/photos/1x1/photo.jpg"],
        "author": {
          "@type": "Person",
          "name": "Mary Stone"
        },
        "datePublished": "2024-03-10",
        "description": "This non-alcoholic pina colada is everyone's favorite!",
        "recipeCuisine": "American",
        "prepTime": "PT1M",
        "cookTime": "PT2M",
        "totalTime": "PT3M",
        "keywords": "non-alcoholic",
        "recipeYield": "4 servings",
        "recipeCategory": "Drink",
        "nutrition": {
          "@type": "NutritionInformation",
          "calories": "120 calories"
        },
        "recipeIngredient": [
          "400ml of pineapple juice",
          "100ml cream of coconut",
          "ice"
        ],
        "recipeInstructions": [
          {
            "@type": "HowToStep",
            "name": "Blend",
            "text": "Blend 400ml of pineapple juice and 100ml cream of coconut until smooth.",
            "url": "https://example.com/non-alcoholic-pina-colada#step1",
            "image": "https://example.com/photos/non-alcoholic-pina-colada/step1.jpg"
          },
          {
            "@type": "HowToStep",
            "name": "Fill",
            "text": "Fill a glass with ice.",
            "url": "https://example.com/non-alcoholic-pina-colada#step2",
            "image": "https://example.com/photos/non-alcoholic-pina-colada/step2.jpg"
          },
          {
            "@type": "HowToStep",
            "name": "Pour",
            "text": "Pour the pineapple juice and coconut mixture over ice.",
            "url": "https://example.com/non-alcoholic-pina-colada#step3",
            "image": "https://example.com/photos/non-alcoholic-pina-colada/step3.jpg"
          }
        ]
      }
    </script>
  </head>
  <body>
    ... your recipe page content goes here
  </body>
</html>
```

### In Webflow

If you're using [Webflow](https://webflow.com/) to create your site, and you have your Recipes as a [CMS Collection](https://university.webflow.com/lesson/intro-to-webflow-cms?topics=cms-dynamic-content), you can use the custom code section of the CMS collection template settings to dynamically insert this schema per recipe.

1. Go to edit your website in the Designer
2. Scroll down to on your CMS Collection template page in the pages navigation
3. Hover over the page
4. Click on the settings/cog icon
5. Scroll down to the Custom Code section
6. Add your `<script type="application/ld+json">` tag with your JSON inside
7. Use the `+ Add Field` button to dynamically put in things like the recipe name, prepTime, ingredients, etc. for each collection item.

#### Example images

Where to find custom code:
![Recipe Example #1](/images/how-to-code-recipe-html-and-webflow/recipe1.png)

How to add dynamic fields from the CMS collection item:
![Recipe Example #2](/images/how-to-code-recipe-html-and-webflow/recipe2.png)

### Bonus Points: Full HTML example

If you [inspect the code](https://developer.chrome.com/docs/devtools/open) of this [AllRecipes.com Chicken Parmesan recipe](https://www.allrecipes.com/recipe/246867/new-improved-chicken-parmesan/), you can see the following script tag, which includes a very fleshed out example of the Recipe schema. You can try this on any recipe site you like to see how they use the schema.

```json
<script id="allrecipes-schema_1-0" type="application/ld+json">
[
  {
    "@context": "http://schema.org",
    "@type": ["Recipe", "NewsArticle"],
    "headline": "New &amp; Improved Chicken Parmesan",
    "datePublished": "2016-04-06T16:20:09.000-04:00",
    "dateModified": "2023-09-28T16:02:25.056-04:00",
    "author": [
      {
        "@type": "Person",
        "name": "John Mitzewich",
        "url": "https://www.allrecipes.com/author/chef-john/"
      }
    ],
    "description": "Instead of mozzarella, Chef John uses a creamy mixture of ricotta and Cheddar cheeses to top this chicken parmesan. Serve with your favorite marinara sauce.",
    "image": {
      "@type": "ImageObject",
      "url": "https://www.allrecipes.com/thmb/iruu0skIC8CRlohnlauBqUPUW38=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/3489929-new-improved-chicken-parmesan-Chef-John-1x1-1-64fa52a81482484ab91eb6d315e1d119.jpg",
      "height": 900,
      "width": 900
    },
    "video": {
      "@type": "VideoObject",
      "contentUrl": "https://content.jwplatform.com/videos/K7nUr4Co-K3AjnAEN.mp4",
      "description": "Make the classic even better with a simple switch-out of the cheese! First take your flattened chicken breast and flour it, egg it and roll it in bread crumbs. Crisp it up nicely and top with ricotta mixed with cheddar, seasonings and of course Parmesan. The result is a flavorful and supremely melty top to your crisped chicken breast that avoids the often un-fresh mozzarella top one encounters at restaurants. Don’t forget to finish with a nice marinara! ",
      "duration": "PT7M47S",
      "name": "New Improved Chicken Parmesan",
      "thumbnailUrl": "https://cdn.jwplayer.com/v2/media/K7nUr4Co/poster.jpg?width=720",
      "uploadDate": "2023-02-03T15:38:34.128-05:00"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Allrecipes",
      "url": "https://www.allrecipes.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.allrecipes.com/thmb/Z9lwz1y0B5aX-cemPiTgpn5YB0k=/112x112/filters:no_upscale():max_bytes(150000):strip_icc()/allrecipes_logo_schema-867c69d2999b439a9eba923a445ccfe3.png",
        "width": 112,
        "height": 112
      },
      "brand": "Allrecipes",
      "publishingPrinciples": "https://www.allrecipes.com/about-us-6648102#toc-editorial-guidelines",
      "sameAs": [
        "https://www.facebook.com/allrecipes",
        "https://www.instagram.com/allrecipes/",
        "https://www.pinterest.com/allrecipes/",
        "https://www.tiktok.com/@allrecipes",
        "https://www.youtube.com/user/allrecipes/videos",
        "https://twitter.com/Allrecipes",
        "https://flipboard.com/@Allrecipes",
        "https://en.wikipedia.org/wiki/Allrecipes.com",
        "http://linkedin.com/company/allrecipes.com"
      ]
    },
    "name": "New &amp; Improved Chicken Parmesan",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.7",
      "ratingCount": "80"
    },
    "cookTime": "PT14M",
    "nutrition": {
      "@type": "NutritionInformation",
      "calories": "1010 kcal",
      "carbohydrateContent": "85 g",
      "cholesterolContent": "259 mg",
      "fiberContent": "7 g",
      "proteinContent": "61 g",
      "saturatedFatContent": "15 g",
      "sodiumContent": "2073 mg",
      "sugarContent": "14 g",
      "fatContent": "46 g",
      "unsaturatedFatContent": "0 g"
    },
    "prepTime": "PT20M",
    "recipeCategory": ["Dinner"],
    "recipeCuisine": ["Italian"],
    "recipeIngredient": [
      "2 large skinless, boneless chicken breast halves",
      "0.5 teaspoon kosher salt",
      "1 pinch ground black pepper",
      "0.5 cup flour",
      "1 egg, beaten",
      "0.75 cup dry bread crumbs",
      "0.5 cup light olive oil for frying, or as needed",
      "0.5 cup ricotta cheese",
      "0.5 cup shredded sharp white Cheddar cheese",
      "salt and freshly ground black pepper to taste",
      "0.5 teaspoon olive oil",
      "2 tablespoons grated Parmigiano-Reggiano cheese for topping",
      "1 cup marinara sauce, heated, or more as needed",
      "1 tablespoon chopped fresh flat-leaf parsley"
    ],
    "recipeInstructions": [
      {
        "@type": "HowToStep",
        "text": "Preheat oven to 500 degrees F (260 degrees C). Line a rimmed baking sheet with aluminum foil."
      },
      {
        "@type": "HowToStep",
        "text": "Gently pound chicken breasts between 2 layers of plastic until each breast is evenly thick. Place breasts on a plate and season 1 side with kosher salt and black pepper. Sprinkle with flour; press flour to coat the entire surface and help it adhere. Turn and repeat on second side with salt, pepper, and flour."
      },
      {
        "@type": "HowToStep",
        "text": "Brush excess flour from plate; place the chicken breasts back on the plate. Pour beaten egg over the breasts and coat each side. Cover bottom of a second plate with half the bread crumbs. Transfer chicken to the bread crumbs. Push crumbs up sides of chicken. Sprinkle on the remaining crumbs and thoroughly coat each side."
      },
      {
        "@type": "HowToStep",
        "text": "Heat 1/2 inch olive oil in a skillet over medium-high heat. Cook chicken until crispy and golden, 2 to 3 minutes per side. Transfer to prepared baking sheet."
      },
      {
        "@type": "HowToStep",
        "text": "Mix ricotta and Cheddar cheese together in a bowl. Stir in salt, black pepper, cayenne, and olive oil. Spread half the cheese mixture on each breast without extending all the way to the edges. Dust with Parmigiano-Reggiano cheese and drizzle with olive oil."
      },
      {
        "@type": "HowToStep",
        "text": "Bake on center rack of preheated oven until cheese is melted and chicken is no longer pink in the center and the juices run clear, 10 to 12 minutes. An instant-read thermometer inserted into the center should read at least 165 degrees F (74 degrees C)."
      },
      {
        "@type": "HowToStep",
        "image": [
          {
            "@type": "ImageObject",
            "url": "https://www.allrecipes.com/thmb/iruu0skIC8CRlohnlauBqUPUW38=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/3489929-new-improved-chicken-parmesan-Chef-John-1x1-1-64fa52a81482484ab91eb6d315e1d119.jpg"
          }
        ],
        "text": "To serve, ladle the heated marinara sauce in a wide circle on warm plates. Place chicken in center and sprinkle with chopped parsley."
      }
    ],
    "recipeYield": ["2"],
    "totalTime": "PT34M",
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Elizabeth Garza"
        },
        "reviewBody": "lots of work, lots of mess, I took out the cheyenne pepper and added garlic powder\n\nIt tasted amazing! SOOOOO worth the work!"
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Allrecipes Member"
        },
        "reviewBody": "Can someone recommend a side dish please?",
        "datePublished": "2024-10-03T13:53:22.878Z"
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Zach"
        },
        "reviewBody": "",
        "datePublished": "2024-10-02T19:26:48.632Z"
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Jan"
        },
        "reviewBody": "",
        "datePublished": "2024-07-16T02:32:38.136Z"
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Allrecipes Member"
        },
        "reviewBody": "I just made your original recipe for the fourth time tonight. It was amazing! I can't wait to try your new and improved recipe! I didn't see it until I came here to leave my review. I learn so much from you. Thank you!",
        "datePublished": "2024-06-05T02:26:49.378Z"
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "author": {
          "@type": "Person",
          "name": "D Sullivan"
        },
        "reviewBody": "Wow! I wouldn't have ever thought to use ricotta &amp; cheddar cheese! So good! Thank you for sharing!",
        "datePublished": "2024-05-02T21:59:14.591Z"
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Jennifer Kasick"
        },
        "reviewBody": "This was the best chicken parm I have ever made. I have noticed that chicken can have a rubbery texture, especially lately, so I marinated in buttermilk about 4 hours prior to prep.",
        "datePublished": "2024-01-09T18:43:36.427Z"
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Robin Sherman"
        },
        "reviewBody": "Super delicious! Next time I'll be a bit lighter on the flour and bread crumbs. I added some Italian seasoning to Panko bread crumbs. This will be my go to recipe!",
        "datePublished": "2023-11-23T15:18:08.434Z"
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Russian Julie "
        },
        "reviewBody": "this was my first chicken parm ever and now I can see the appeal",
        "datePublished": "2023-10-27T08:54:25.174Z"
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "author": {
          "@type": "Person",
          "name": "obiwanstewie79"
        },
        "reviewBody": "Solid recipe.",
        "datePublished": "2023-07-23T11:45:43.755Z"
      }
    ],
    "mainEntityOfPage": {
      "@type": ["WebPage"],
      "@id": "https://www.allrecipes.com/recipe/246867/new-improved-chicken-parmesan/",
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "item": {
              "@id": "https://www.allrecipes.com/recipes/",
              "name": "Recipes"
            }
          },
          {
            "@type": "ListItem",
            "position": 2,
            "item": {
              "@id": "https://www.allrecipes.com/recipes/80/main-dish/",
              "name": "Main Dishes"
            }
          },
          {
            "@type": "ListItem",
            "position": 3,
            "item": {
              "@id": "https://www.allrecipes.com/recipes/16954/main-dish/chicken/",
              "name": "Chicken"
            }
          },
          {
            "@type": "ListItem",
            "position": 4,
            "item": {
              "@id": "https://www.allrecipes.com/recipes/16383/main-dish/chicken/chicken-parmesan/",
              "name": "Parmesan"
            }
          }
        ]
      }
    }
  }
]
</script>

```
