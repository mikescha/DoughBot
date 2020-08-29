"""description of the pizza class"""
import math

flour = "flour"
water = "water"
yeast = "yeast"
salt = "salt"
sugar = "sugar"
oil = "olive oil"

dry_ingredients = (flour, yeast, salt, sugar)
wet_ingredients = (water, oil)

neo_pizza_recipe = {
    flour : 100.0,
    water : 65.0,
    yeast : 7.5,
    salt  : 10.0, 
    sugar : 0.0,
    oil   : 0.0}

ny_pizza_recipe = {
    flour : 100.0,
    water : 60.0,
    yeast : 10.0,
    salt  : 10.0, 
    sugar : 5.0,
    oil   : 12.0}

dd_pizza_recipe = {
    flour : 100.0,
    water : 55.0,
    yeast : 10.5,
    salt  : 10.0, 
    sugar : 2.0,
    oil   : 15.0}

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

    def __init__(self, pizza_style, ball_count, size):
        self.style_choice = ""
        self.style_name = ""
        self.dough_balls = 0
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
                
                break


