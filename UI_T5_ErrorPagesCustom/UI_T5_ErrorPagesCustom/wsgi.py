"""
WSGI config for UI_T5_ErrorPagesCustom project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'UI_T5_ErrorPagesCustom.settings')

application = get_wsgi_application()
