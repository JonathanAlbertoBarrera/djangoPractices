from django.http import JsonResponse
from django.shortcuts import render

from error_reports.forms import ErrorForm
from error_reports.models import ErrorReport


def reporte_error_view(request):
	if request.method == "POST":
		form = ErrorForm(request.POST)
		if form.is_valid():
			form.save()
			return JsonResponse({
				"status": "ok",
				"mensaje": "registro exitoso",
			})
		return JsonResponse({
			"status": "error",
			"mensaje": "algo salio mal",
			"errors": form.errors,
		}, status=400)

	form = ErrorForm()
	return render(request, "error_reports/reporte_error.html", {"form": form})


def obtener_reportes_view(request):
	reportes = list(
		ErrorReport.objects.all().values(
			"id",
			"titulo",
			"descripcion",
			"tipo_error",
			"url",
			"metodo_http",
			"ip_cliente",
			"fecha_reporte",
		)
	)
	return JsonResponse(reportes, safe=False)
