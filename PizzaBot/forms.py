"""
Definition of forms.
"""

from django import forms
from django.contrib.auth.forms import AuthenticationForm
from django.utils.translation import ugettext_lazy as _
from PizzaBot.pizza import Pizza

class PizzaForm(forms.Form):
    
    pizza_style = forms.ChoiceField(
        label = "Pizza Style",
        choices = Pizza.PIZZA_STYLE_CHOICES,
        initial= Pizza.initial_style,
        )

    dough_balls = forms.IntegerField(
        label = "Number of Dough Balls",
        initial = Pizza.inital_doughballs,
        )

    size = forms.IntegerField(
        label = "Diameter of Pizza (cm)",
        initial = Pizza.initial_size,
        )



class BootstrapAuthenticationForm(AuthenticationForm):
    """Authentication form which uses boostrap CSS."""
    username = forms.CharField(max_length=254,
                               widget=forms.TextInput({
                                   'class': 'form-control',
                                   'placeholder': 'User name'}))
    password = forms.CharField(label=_("Password"),
                               widget=forms.PasswordInput({
                                   'class': 'form-control',
                                   'placeholder':'Password'}))
