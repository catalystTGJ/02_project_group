from django.shortcuts import HttpResponse, render, redirect
from django.contrib import messages

#needed for use of built-in django auth
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login

# from .models import SampleTable1, SampleTable2, SampleTable3

# Index
def index(request):
    return redirect('/signin')

# Create
def create(request):
    return HttpResponse('Things are working!')

# Read
def signin(request):
    context = {}
    if request.method == 'POST':
        user = authenticate(username=request.POST['username'], password=request.POST['password'])
        if user is not None:
            login(request, user)
            return redirect('/tanks')
    return render(request, 'signin.html', context)

# Read
@login_required(login_url='/signin')
def tanks(request):
    return render(request, "tanks.html")

def signoff(request):
    request.session.flush()
    return redirect('/')

# Update
def update(request):
    return HttpResponse('Things are working!')

# Delete
def delete(request):
    return HttpResponse('Things are working!')