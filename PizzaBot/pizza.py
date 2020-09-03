"""description of the pizza class"""
import math

flour = "flour"
water = "water"
yeast = "yeast"
salt = "salt"
sugar = "sugar"
oil = "olive oil"
calories = "calories"
servings = "servings"

calories_per_unit = {
    flour : 3.64,
    sugar : 3.865,
    oil   : 8.048
    }

dry_ingredients = (flour, yeast, salt, sugar)
wet_ingredients = (water, oil)

#All numbers below are metric, in grams for dry ingredients and ml for wet.
#Each recipe is for a 12"/30cm pizza
neo_pizza_recipe = {
    flour    : 160.0,
    water    : 106.0,
    yeast    : 3.0,
    salt     : 3.0, 
    sugar    : 0.0,
    oil      : 0.0}

ny_pizza_recipe = {
    flour    : 157.5,
    water    : 105.0,
    yeast    : 2.5,
    salt     : 2.5, 
    sugar    : 4.0,
    oil      : 8.0}

dd_pizza_recipe = {
    flour    : 250.0,
    water    : 173.5,
    yeast    : 2.5,
    salt     : 5.0, 
    sugar    : 0.0,
    oil      : 15.0}

NEAPOLITAN = "NE"
NEWYORK = "NY"
DEEPDISH = "DD"

pizza_descriptions = [ #note this is an array because that's what the drop-down list wants
        (NEAPOLITAN, "Neapolitan thin crust"),
        (NEWYORK, "New York thin crust"),
        (DEEPDISH, "Chicago-style deep dish"),
    ]

pizza_recipes = {
        NEAPOLITAN : neo_pizza_recipe,
        NEWYORK : ny_pizza_recipe,
        DEEPDISH : dd_pizza_recipe,
    }

def scale_circle(d1, d2):
    area1 = math.pi * pow((d1/2), 2)    
    area2 = math.pi * pow((d2/2), 2)
    return area1/area2

class Pizza(object):
    PIZZA_STYLE_CHOICES = pizza_descriptions

    initial_style = NEAPOLITAN
    inital_doughballs = 2
    initial_size = 30 #cm
    calories_per_serving = 350

    def __init__(self, pizza_style, ball_count, size):
        self.style_choice = ""
        self.style_name = ""
        self.dough_balls = 0
        self.dough_grams_per_pizza = 275
        self.size = size
        self.metric_ingredients = {}
        self.imp_ingredients = {}

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
                                                           * scale_circle(size, self.initial_size))

                    self.imp_ingredients[ingredient] =  (self.metric_ingredients[ingredient] * 
                                                         unit_conversion)
                    
                self.calories = 0                    
                for ingredient in self.metric_ingredients:
                    if ingredient in calories_per_unit:
                        self.calories += calories_per_unit[ingredient] * self.metric_ingredients[ingredient] / ball_count

                #initial size is for 1 person, so however we scale the dough ball is the number of servings
                self.servings = self.calories / self.calories_per_serving

                break


