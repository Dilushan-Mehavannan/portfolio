from django.shortcuts import render, get_object_or_404
from .models import Project

def home(request):
    featured = Project.objects.all()[:3]
    return render(request, "core/home.html", {"featured": featured})

def project_list(request):
    projects = Project.objects.all()
    return render(request, "core/project.html", {"projects": projects})

def project_detail(request, slug):
    project = get_object_or_404(Project, slug=slug)
    return render(request, "core/project_detrail.html", {"project": project})