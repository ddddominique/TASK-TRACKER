from django.db import models

# Create your models here.
class Task(models.Model):
    # title, description, completed, timestamp
    title = models.CharField(max_length=64) # title of the test
    description = models.TextField(blank=True, null=True) #Optional
    completed = models.BooleanField(default=False) #completion status
    timestamp = models.DateTimeField(auto_now_add=True)  # This will automatically set the timestamp when a task is created
 #set the time

    def __str__(self):
        return self.title