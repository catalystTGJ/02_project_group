from django.urls import include, path
from . import views

urlpatterns = [
    # Create
    path('create', views.create),
    # Read
    path('', views.index),
    # Read
    path('signin', views.signin),
    # Read
    path('signoff', views.signoff),
    # Read
    path('tanks', views.tanks),
    # Update
    path('sample_level_1/<int:sample_id>', views.update),
    # Delete
    path('sample_level_1/delete/<int:sample_id>', views.delete),

    # Sample for string usage in route.
    # path('sample_level_1/<str:sample_string>', views.string_sample),

    # Update
    # Sample for string usage in route.
    # path('sample_level_1/<str:sample_string>', views.string_sample),
]
