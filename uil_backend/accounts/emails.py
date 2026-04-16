from django.template.loader import render_to_string
from django.conf import settings
from .tasks import send_activation_email
from djoser.email import ConfirmationEmail, PasswordResetEmail, ActivationEmail
from django.contrib.auth import get_user_model


class AdminActivationEmail:
    template_name = "email/activation.html"

    def __init__(self, user, protocol, domain, uid, token):
        self.user = user
        self.protocol = protocol
        self.domain = domain
        self.uid = uid
        self.token = token

    def get_context_data(self):
        context = {
            "user": self.user,
            "user_full_name": f"{self.user.first_name} {self.user.father_name}",
            "uid": self.uid,
            "token": self.token,
            "protocol": self.protocol,
            "domain": self.domain,
            "frontend_url": settings.FRONTEND_URL,
        }
        return context

    def send(self):
        subject = "Activate user's account"
        from_email = settings.DEFAULT_FROM_EMAIL
        User = get_user_model()
        recipient_list = list(
            User.objects.filter(is_superuser=True)
            .values_list('email', flat=True)
            .exclude(email__isnull=True)
            .exclude(email__exact='')
        )

        if not recipient_list:
            recipient_list = ['samsonmamuye34@gmail.com']

        context = self.get_context_data()
        html_message = render_to_string(self.template_name, context)
        send_activation_email.delay(
            subject=subject,
            message="Please activate the user account by clicking the link below.",
            from_email=from_email,
            recipient_list=recipient_list,
            html_message=html_message
        )


class CustomConfirmationEmail(ConfirmationEmail):
    template_name = "email/confirmation.html"

    def get_context_data(self):
        context = super().get_context_data()
        user = context.get("user")
        context["user_full_name"] = f"{user.first_name} {user.father_name}"
        context["message"] = "Your account has been approved and is now active. You can now log in with your credentials."
        context['login_url'] = settings.FRONTEND_URL
        return context

    def send(self, to):
        context = self.get_context_data()
        subject = "Your Account Has Been Approved"
        message = render_to_string(self.template_name, context)
        context = self.get_context_data()
        html_message = render_to_string(self.template_name, context)

        send_activation_email.delay(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=to,
            html_message=html_message,
        )


class CustomRejectionEmail(ConfirmationEmail):
    template_name = "email/rejection.html"

    def get_context_data(self):
        context = super().get_context_data()
        user = context.get("user")
        context["user_full_name"] = f"{user.first_name} {user.father_name}"
        context["message"] = "Your account has been rejected  try with correct credentail or contact admin"
        context['login_url'] = settings.FRONTEND_URL
        return context

    def send(self, to):
        context = self.get_context_data()
        subject = "Your Account Has Been Rejected"
        message = render_to_string(self.template_name, context)
        context = self.get_context_data()
        html_message = render_to_string(self.template_name, context)

        send_activation_email.delay(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=to,
            html_message=html_message,
        )


class CustomPasswordResetEmail(PasswordResetEmail):
    template_name = "email/password_reset.html"

    def get_context_data(self):
        context = super().get_context_data()

        context["domain"] = settings.FRONTEND_URL.replace(
            "http://", "").replace("https://", "")

        context["url"] = f"auth/reset_password/confirm/{context['uid']}/{context['token']}"

        return context


class CustomOneTimePasswordEmail:
    template_name = "email/welcome_email.html"

    def __init__(self, user, otp_password):
        """
        :param user: User instance
        :param otp_password: One-time password for first login
        """
        self.user = user
        self.otp_password = otp_password

    def get_context_data(self):
        """
        Prepares the context for rendering the email template.
        """
        context = []
        context.append(
            ("user_full_name", f"{self.user.first_name} {self.user.father_name}"))
        context.append(("username", self.user.username))
        context.append(("otp_password", self.otp_password))
        context.append(
            ("login_url", f"{settings.FRONTEND_URL}/auth?mode=login"))
        return dict(context)

    def send(self, to):
        """
        Sends the email asynchronously using Celery.
        """
        # Prepare email content
        context = self.get_context_data()
        subject = "Welcome to BDU RPMS - Your Login Details"
        html_message = render_to_string(self.template_name, context)

        # Call the Celery task without plain text message
        send_activation_email.delay(
            subject=subject,
            message=None,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[self.user.email],
            html_message=html_message
        )


class ReminderEmail:
    template_name = "email/reminder-email.html"

    def __init__(self, user):
        """
        :param user: User instance
        """
        self.user = user

    def get_context_data(self):
        context = {}
        context["user_full_name"] = f"{self.user['first_name']} {self.user['father_name']}"
        context["email"] = self.user['email']
        context["login_url"] = f"{settings.FRONTEND_URL}/auth?mode=login"

        # add more keys if needed
        return context

    def send(self, to):
        """
        Sends the email asynchronously using Celery.
        """
        # Prepare email content
        context = self.get_context_data()
        subject = "Reminder!! Welcome to BDU RPMS - Your Login Details"
        html_message = render_to_string(self.template_name, context)

        # Call the Celery task without plain text message
        send_activation_email.delay(
            subject=subject,
            message=None,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[self.user['email']],
            html_message=html_message
        )
