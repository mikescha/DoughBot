"""description of the pizza class"""
import math

flour = "flour, preferably bread or 00"
ap_flour = "all-purpose flour"
semolina = "semolina flour"
water = "luke-warm water"
yeast = "yeast"
salt = "kosher salt"
sugar = "sugar"
oil = "extra virgin olive oil"
calories = "calories"
servings = "servings"

calories_per_gram = {
    flour : 3.64, #TODO This is a placeholder, look up real value
    ap_flour: 3.64, #TODO This is a placeholder, look up real value
    semolina: 3.6, #TODO This is a placeholder, look up real value
    sugar : 3.865,
    oil   : 8.048
    }

dry_ingredients = (flour, yeast, salt, sugar, semolina, ap_flour)
wet_ingredients = (water, oil)

#All numbers below are metric, in grams for dry ingredients and ml for wet.
#Each recipe is for a 12"/30cm pizza
nea_pizza_recipe = {
    flour    : 160.0,
    water    : 106.0,
    yeast    : 3.0,
    salt     : 3.0, 
    sugar    : 0.0,
    oil      : 0.0}

nea_pizza_directions = """
<li>If using active dry yeast, combine it with the lukewarm water and let stand for five minute before adding it to the dough; instant yeast can be added directly into the flour. </li>
<li>Add all ingredients to a large bowl or the bowl of your stand mixer, and mix until thoroughly combined. Let rest for about 5 minutes.</li>
<li>If kneading by hand, turn out onto a lightly floured work surface and knead until the dough is soft and supple, at least 10-15 minutes. If using a stand mixer, use the dough hook and knead until the dough is soft and supple, at least 3-4 minutes.</li>
<li>Divide the dough into equal size balls and lightly oil the surface of each ball. Place into individual plastic bags or place multiple balls into a plastic box with a lid, and then seal the container. Let rest in the refrigerator at least 6 hours, or up to three days.</li>
<li>About two hours before cooking, remove as many balls as you need from the refrigerator and allow to warm at room temperature.</li>
<li>Shape, top, and bake as you prefer!</li>
"""

nea_pizza_references = """
<li><a href="https://www.fornobravo.com/pizzaquest/recipe-neapolitan-pizza-dough/">Peter Reinhart's Neapolitan Pizza Dough</a><br></li>
<li><a href="https://www.seriouseats.com/recipes/2012/07/basic-neapolitan-pizza-dough-recipe.html">Serious Eats' Neapolitan Pizza Dough</a><br></li>
"""

ny_pizza_recipe = {
    flour    : 157.5,
    water    : 105.0,
    yeast    : 2.5,
    salt     : 2.5, 
    sugar    : 4.0,
    oil      : 8.0}

ny_pizza_directions = """
<li>If using active dry yeast, combine it with the lukewarm water and let stand for five minute before adding it to the dough; instant yeast can be added directly into the flour. </li>
<li>Add all ingredients to a large bowl or the bowl of your stand mixer, and mix until thoroughly combined. Let rest for about 5 minutes.</li>
<li>If kneading by hand, turn out onto a lightly floured work surface and knead until the dough is soft and supple, at least 10-15 minutes. If using a stand mixer, use the dough hook and knead until the dough is soft and supple, at least 3-4 minutes.</li>
<li>Divide the dough into equal size balls and lightly oil the surface of each ball. Place into individual plastic bags or place multiple balls into a plastic box with a lid, and then seal the container. Let rest in the refrigerator at least 6 hours, or up to three days.</li>
<li>About two hours before cooking, remove as many balls as you need from the refrigerator and allow to warm at room temperature.</li>
<li>Shape, top, and bake as you prefer!</li>
"""

ny_pizza_references = """
<li><a href="https://www.fornobravo.com/pizzaquest/ny-style-pizza-dough/">Peter Reinhart's NY Style Recipe</a></li>
"""

dd_pizza_recipe = {
    ap_flour : 250.0,
    semolina : 25.0,
    water    : 173.5,
    yeast    : 2.5,
    salt     : 10.0, 
    sugar    : 0.0,
    oil      : 15.0}

dd_pizza_directions = """
<li>In a large bowl, combine the water, yeast, and sugar and stir to combine. Let sit until the mixture is foamy, about 5 minutes.</li>
<li>Add about half the flour and all the semolina, oil, and salt, mixing by hand until it is all incorporated and the mixture is smooth. Continue adding the flour, 1/4 cup/100g at a time, working the dough after each addition, until all the flour is incorporated but the dough is still slightly sticky.</li>
<li>Turn the dough out onto a lightly floured surface and knead until smooth but still slightly tacky, 3 to 5 minutes.</li>
<li>Oil a large mixing bowl, place the dough in the bowl, and turn to oil all sides. Cover the bowl with plastic wrap and let sit in a warm place until doubled, about 1-1.5 hours.</li>
<li>When ready to bake, press the dough into your pan so that it spreads across the entire bottom of the pan and also up the sides by about 1.5"/4cm. Top as desired, and then bake at 475F/250c for 30 minutes.</li>
"""

dd_pizza_references = """
<li><a href="https://www.foodnetwork.com/recipes/chicago-style-deep-dish-pizzas-3645832">Food Network's Chicago-style Deep Dish Pizza</a></li>
<li><a href="https://www.foodnetwork.com/recipes/jeff-mauro/true-chicago-style-deep-dish-pizza-5612273">Jeff Mauro's True Chicago-Style Deep-Dish Pizza</a></li>
"""

NEAPOLITAN = "NE"
NEWYORK = "NY"
DEEPDISH = "DD"

XS = "XS"
SM = "SM"
MD = "MD"
LG = "LG"
XL = "XL"

pizza_size_choices = [
    (XS, "20"),
    (SM, "25"),
    (MD, "30"),
    (LG, "35"),
    (XL, "40")
    ]

pizza_sizes = {
    XS : 20,
    SM : 25,
    MD : 30,
    LG : 35,
    XL : 40
    }

pizza_descriptions = [ #note this is an array because that's what the drop-down list wants
        (NEAPOLITAN, "Neapolitan Thin Crust"),
        (NEWYORK, "New York Thin Crust"),
        (DEEPDISH, "Chicago-style Deep Dish"),
    ]

pizza_recipes = {
        NEAPOLITAN : nea_pizza_recipe,
        NEWYORK : ny_pizza_recipe,
        DEEPDISH : dd_pizza_recipe,
    }

pizza_directions = {
        NEAPOLITAN : nea_pizza_directions,
        NEWYORK : ny_pizza_directions,
        DEEPDISH : dd_pizza_directions,
    }

pizza_references = {
        NEAPOLITAN : nea_pizza_references,
        NEWYORK : ny_pizza_references,
        DEEPDISH : dd_pizza_references,
    }

def scale_circle(d1, d2):
    area1 = math.pi * pow((d1/2), 2)    
    area2 = math.pi * pow((d2/2), 2)
    return area1/area2

class Pizza(object):
    PIZZA_STYLE_CHOICES = pizza_descriptions
    PIZZA_SIZE_CHOICES = pizza_size_choices 
    initial_style = NEAPOLITAN
    inital_doughballs = 2
    initial_size = MD #cm
    calories_per_serving = 350

    def __init__(self, pizza_style, ball_count, size):
        self.style_choice = ""
        self.style_name = ""
        self.dough_balls = 0
        self.dough_grams_per_pizza = 275
        self.size = pizza_sizes[size]
        self.metric_ingredients = {}
        self.imp_ingredients = {}
        self.directions = pizza_directions[pizza_style]
        self.references = pizza_references[pizza_style]

        for p in pizza_descriptions:
            if p[0] == pizza_style:
                self.style_choice = p[0]
                self.style_name = p[1]
                self.dough_balls = ball_count
                
                for ingredient in pizza_recipes[pizza_style]:
                    if ingredient in dry_ingredients:
                        #amount will be in grams, so convert to oz
                        unit_conversion = 0.035274
                    else:
                        #amount will be in ml, so convert to oz
                        unit_conversion = 0.033814

                    self.metric_ingredients[ingredient] = (pizza_recipes[pizza_style][ingredient] 
                                                           * ball_count 
                                                           * scale_circle(pizza_sizes[size], pizza_sizes[self.initial_size]))

                    self.imp_ingredients[ingredient] =  (self.metric_ingredients[ingredient] 
                                                         * unit_conversion)
                    
                self.calories = 0                    
                for ingredient in self.metric_ingredients:
                    if ingredient in calories_per_gram:
                        self.calories += calories_per_gram[ingredient] * self.metric_ingredients[ingredient] / ball_count

                #calories_per_serving is what I think a reasonable amount of dough is for a single person
                self.servings = self.calories / self.calories_per_serving

                break


