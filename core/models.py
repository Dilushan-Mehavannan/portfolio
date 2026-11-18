from django.db import models

class Project(models.Model):
    title = models.CharField(max_length=120)
    slug = models.SlugField(unique=True)
    summary = models.CharField(max_length=200)
    description = models.TextField()
    tech_stack = models.CharField(max_length=200, help_text="e.g. Django, PostgreSQL, Bootstrap")
    github_url = models.URLField(blank=True)
    live_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title

# Create your models here.
