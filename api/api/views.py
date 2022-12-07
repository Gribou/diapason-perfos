from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from app.email import mail_admins


class HealthCheckView(APIView):
    '''
    Vérification que le serveur web est en route
    A utiliser avec Docker-compose pour établir l'état de santé du container
    (healthcheck)
    '''

    def get(self, request, format=None):
        return Response(status=status.HTTP_204_NO_CONTENT)


class ContactFormView(APIView):
    '''
    Formulaire de contact envoyant un email à l'administrateur
    '''

    def post(self, request, format=None):
        message = request.data.get("message", None)
        if not message:
            return Response({"message": "Ce champ est obligatoire."}, status=status.HTTP_400_BAD_REQUEST)
        related_type = request.data.get("related_type", None)
        redactor = request.data.get("redactor", None)
        complete_message = ""
        if related_type:
            complete_message += "Type d'aéronef concerné : {}\n\n".format(
                related_type)
        complete_message += message
        if redactor:
            complete_message += "\n\nRédacteur : {}".format(redactor)
        mail_admins("Formulaire de signalement",
                    complete_message)
        return Response(status=status.HTTP_204_NO_CONTENT)


class ConfigView(APIView):
    """
    Fournit les éléments de configuration du site.
    Ces éléments sont uniquement modifiables par l'administrateur
    Ex : fonctionnalités actives ou non, remplissage des listes de sélection, ... 
    """

    def get(self, request, format=None):
        result = {}
        try:
            from app.version import __version__
            result['version'] = __version__
        except:
            pass
        return Response(result)
