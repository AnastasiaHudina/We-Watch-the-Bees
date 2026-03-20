from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver

from apiary.models import Apiary


User = get_user_model()


@receiver(post_save, sender=User)
def create_apiary_for_new_user(sender, instance, created: bool, **kwargs) -> None:
    if not created:
        return
    Apiary.objects.create(user=instance, name=f"Пасека {instance.username}")

