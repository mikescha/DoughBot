"""description of the pizza class"""

neo_pizza_recipe = {
    "flour" : 100.0,
    "water" : 65.0,
    "yeast" : 7.5,
    "salt"  : 10.0, 
    "sugar" : 0.0,
    "oil"   : 0.0}

ny_pizza_recipe = {
    "flour" : 100.0,
    "water" : 60.0,
    "yeast" : 10.0,
    "salt"  : 10.0, 
    "sugar" : 5.0,
    "oil"   : 12.0}

dd_pizza_recipe = {
    "flour" : 100.0,
    "water" : 55.0,
    "yeast" : 10.5,
    "salt"  : 10.0, 
    "sugar" : 2.0,
    "oil"   : 15.0}

NEOPOLITAN = "NE"
NEWYORK = "NY"
DEEPDISH = "DD"

pizza_descriptions = [
        (NEOPOLITAN, "Neopolitan thin crust"),
        (NEWYORK, "New York thin crust"),
        (DEEPDISH, "Chicago-style deep dish"),
    ]

pizza_recipes = {
        NEOPOLITAN : neo_pizza_recipe,
        NEWYORK : ny_pizza_recipe,
        DEEPDISH : dd_pizza_recipe,
    }

class Pizza(object):
    PIZZA_STYLE_CHOICES = pizza_descriptions

    initial_style = NEOPOLITAN
    inital_doughballs = 2

    def __init__(self, pizza_style, ball_count):
        self.style_choice = ""
        self.style_name = ""
        self.dough_balls = 0
        self.ingredients = {}
        for p in pizza_descriptions:
            if p[0] == pizza_style:
                self.style_choice = p[0]
                self.style_name = p[1]
                self.dough_balls = ball_count
                
                for ingredient in pizza_recipes[pizza_style]:
                    self.ingredients[ingredient] = pizza_recipes[pizza_style][ingredient] * ball_count
                
                break


