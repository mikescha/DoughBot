"""
Definition of views.
"""

from datetime import datetime
from django.shortcuts import render
from django.http import HttpRequest

def pizza(request):
    """Renders the pizza page."""
    assert isinstance(request, HttpRequest)
    return render(
        request,
        'app/index.html',
        {
            'title':'PizzaBot',
            'message':'The PizzaBot helps you make the correct amount of pizza dough every time!',
            'year':datetime.now().year,
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
