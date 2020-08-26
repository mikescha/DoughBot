"""
Definition of views.
"""

from datetime import datetime
from django.shortcuts import render
from django.http import HttpRequest
from django.http import JsonResponse
import json

from .pizza import Pizza
from .forms import PizzaForm

#Render unto Caesar the Pizza Page!!
def pizza_view(request):
    assert isinstance(request, HttpRequest)

    if request.method == "POST":
        # Get the form contents 
        form = PizzaForm(request.POST)

        if form.is_valid():
            # process the data in form.cleaned_data as required
            style = form.cleaned_data["pizza_style"]
            dough_balls = form.cleaned_data["dough_balls"]
            size = form.cleaned_data["size"]
            the_pizza = Pizza(style, dough_balls, size)

            # If we are POSTing, then return the response to the JQuery code so it can draw it on the page without refresh
            serialized_data = json.dumps(the_pizza.__dict__)
            return JsonResponse(serialized_data, status=200, safe=False)
        else:
            #TODO Form is not valid for some reason, put in error handling
            assert False
    
    # if a GET (or any other method) we'll create a blank form
    else:
        form = PizzaForm()

        return render(request, "app/pizza.html",
            {
                "title":"PizzaBot",
                "message":"The PizzaBot helps you make the correct amount of pizza dough every time!",
                "form":form,
                "year":datetime.now().year,
            }
        )

def bread(request):
    assert isinstance(request, HttpRequest)
    return render(
        request,
        'app/index.html',
        {
            'title':'BreadBot',
            'message':'The BreadBot helps you make the correct amount of bread dough every time!',
            'year':datetime.now().year,
        }
    )

def pie(request):
    assert isinstance(request, HttpRequest)
    return render(
        request,
        'app/index.html',
        {
            'title':'PieBot',
            'message':'The PieBot helps you to make the correct amount of pie dough every time!',
            'year':datetime.now().year,
        }
    )

def about(request):
    """Renders the about page."""
    assert isinstance(request, HttpRequest)
    return render(
        request,
        'app/about.html',
        {
            'title':'About the Bots',
            'message':'Have you ever wanted to make some dough, but your pan was a different size from the recipe? Or you wanted enough dough for four servings, but the recipe made a certain diameter or length of bread? Our family of bots helps you to make the right amount of dough every time!',
            'year':datetime.now().year,
        }
    )
