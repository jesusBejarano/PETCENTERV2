(function () {
    angular.module ( 'api' )
        .controller('BuscarMantenimientoController',
            ['$scope', '$http', '$routeParams', '$timeout', 'Enum', 'ParseHtml', '$rootScope', 'Helpers', 'ServiciosConector', '$compile',
                function ($scope, $http, $routeParams, $timeout, Enum, ParseHtml, $rootScope, Helpers, ServiciosConector, $compile) {
                    
                    $timeout(function () {
                        ponerFechas();
                        PonerFocoInicio();
                        if ($rootScope.DatosFormulario == undefined)
                            $rootScope.DatosFormulario = {};
                        if ($rootScope.DatosFormulario.DatosMantenimiento == undefined)
                            $rootScope.DatosFormulario.DatosMantenimiento = {};

                        $rootScope.DatosFormulario.DatosMantenimiento = {};
                    } );

                    function obtenerUltimoCodigo() {
                        var codigo = "";
                        var lstMantenimiento = $('#listaMantenimientos').jqGrid('getGridParam', 'data');
                        if (lstMantenimiento.length > 0) {
                            var mantenimiento = lstMantenimiento[lstMantenimiento.length - 1];
                            codigo = parseInt(mantenimiento.Codigo) + 1;
                        } else {
                            codigo = "1";
                        }
                        return codigo;
                    }

                    $scope.Buscar_Click = function () {
                        //  $scope.compilarGrilla("#consultaSolicitudes");

                        if ($rootScope.EsEnter) {
                            return false;
                        }

                        if (validateForm("#BuscarSolicitudMantenimientoFrm") == false) {
                            return false;
                        }
                        var trf = $("#listaSolicitudMantenimiento tbody:first tr:first")[0];
                        $("#listaSolicitudMantenimiento tbody:first").empty().append(trf);

                        var temFechaInicio = $rootScope.DatosFormulario.FiltrosBusquedaFicha.FechaInicio;
                        var temFechaFin = $rootScope.DatosFormulario.FiltrosBusquedaFicha.FechaFin;

                        var fechaInicio = temFechaInicio.split(" ")[0].split("/");
                        var fechaFin = temFechaFin.split(" ")[0].split("/");


                        var fechaInicioFinal = fechaInicio[2] + '-' + fechaInicio[1] + '-' + fechaInicio[0] + ' 23:59:45';
                        var fechaFinFinal = fechaFin[2] + '-' + fechaFin[1] + '-' + fechaFin[0] + ' 23:59:45';

                        //fechaFinFinal = '2016-11-29 17:15:45';

                        var request = $rootScope.DatosFormulario.FiltrosBusquedaFicha;
                        request.FechaInicioFinal = fechaInicioFinal;
                        request.FechaFinFinal = fechaFinFinal;
                        //var request = { "request": objRequest };
                        $.ajax({
                            url: "ObtenerMantenimientos",
                            type: "POST",
                            headers: { __RequestVerificationToken: $('input[name=__RequestVerificationToken]').val() },
                            data: request,
                            dataType: "json",
                            cache: true,
                            async: false,
                            success: function (data) {
                                if (data) {
                                    for (i = 0; i < data.ListaFicha.length; i++) {
                                        jQuery("#consultaFichas").jqGrid('addRowData', i + 1, data.ListaFicha[i]);
                                    }
                                }
                            }
                        });

                        return false;
                    };

                    $scope.Guardar_Click = function () {
                        var validacion = validacionesCamposGuardar();
                        if (validacion === false) {
                            return false;
                        }
                        var objMantenimiento = {};
                        objMantenimiento.Codigo = obtenerUltimoCodigo();
                        objMantenimiento.Nombre = $rootScope.DatosFormulario.DatosMantenimiento.Nombre;
                        objMantenimiento.FechaMantenimiento = $rootScope.DatosFormulario.DatosMantenimiento.FechaMantenimiento;
                        objMantenimiento.Descripcion = $rootScope.DatosFormulario.DatosMantenimiento.Descripcion;

                        jQuery("#listaMantenimientos").jqGrid('addRowData', i + 1, objMantenimiento);
                        $scope.$parent.SalirPopup_Click();
                    };
                    function validacionesCamposGuardar() {
                        limpiarControlesValidacionEspeciales();
                        var salida = true;

                        if (validateForm("#AgregarMantenimientoFrm") == false) {
                            salida = false;
                        }
                        if (!$rootScope.DatosFormulario.DatosMantenimiento.FechaMantenimiento) {
                            $(".caja11.msgerror.FechaMantenimiento").html("Fecha Mantenimiento es requerido");
                            salida = false;
                        }
                        if (!$rootScope.DatosFormulario.DatosMantenimiento.Descripcion) {
                            $(".caja11.msgerror.Descripcion").html("Descripcion es requerido");
                            salida = false;
                        }
                        return salida;
                    }
                    function limpiarControlesValidacionEspeciales() {
                        $(".caja11.msgerror.FechaMantenimiento").html("");
                        $(".caja11.msgerror.Descripcion").html("");
                    }

                    $scope.Salir_Click = function () {
                        $scope.$parent.SalirPopup_Click();
                    };
                    
                    function Eliminar(codigoMantenimiento) {
                        alert("eliminar");
                    }
                }] );
}) ();