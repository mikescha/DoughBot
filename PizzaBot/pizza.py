"""description of the pizza class"""

class Pizza(object):
    NEOPOLITAN = "NE"
    NEWYORK = "NY"
    DEEPDISH = "DD"
    PIZZA_TYPE_CHOICES = [
        (NEOPOLITAN, "Neopolitan thin crust"),
        (NEWYORK, "New York thin crust"),
        (DEEPDISH, "Chicago-style deep dish"),
    ]
    initial = NEWYORK
