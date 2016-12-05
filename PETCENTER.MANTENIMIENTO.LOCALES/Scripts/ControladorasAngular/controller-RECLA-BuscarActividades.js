(function () {
    angular.module ( 'api' )
        .controller('BuscarActividadesFichaController',
            ['$scope', '$http', '$routeParams', '$timeout', 'Enum', 'ParseHtml', '$rootScope', 'Helpers', 'ServiciosConector', '$compile',
                function ($scope, $http, $routeParams, $timeout, Enum, ParseHtml, $rootScope, Helpers, ServiciosConector, $compile) {
                    
                    $timeout(function () {
                        ponerFechas();
                        PonerFocoInicio();
                        if ($rootScope.DatosFormulario == undefined)
                            $rootScope.DatosFormulario = {};
                        if ($rootScope.DatosFormulario.DatosMantenimiento == undefined)
                            $rootScope.DatosFormulario.DatosMantenimiento = {};
                        if ($rootScope.DatosFormulario.DatosActividad == undefined)
                            $rootScope.DatosFormulario.DatosActividad = {};

                        $rootScope.DatosFormulario.DatosActividad = {};
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

                        if (validateForm("#BuscarActividadMantenimientoFrm") == false) {
                            return false;
                        }
                        var trf = $("#listaActividadMantenimiento tbody:first tr:first")[0];
                        $("#listaActividadMantenimiento tbody:first").empty().append(trf);

                        var request = $rootScope.DatosFormulario.DatosActividad;
                        $.ajax({
                            url: "ObtenerActividades",
                            type: "POST",
                            headers: { __RequestVerificationToken: $('input[name=__RequestVerificationToken]').val() },
                            data: request,
                            dataType: "json",
                            cache: true,
                            async: false,
                            success: function (data) {
                                if (data) {
                                    for (i = 0; i < data.ListaActividad.length; i++) {
                                        jQuery("#listaActividadMantenimiento").jqGrid('addRowData', i + 1, data.ListaActividad[i]);
                                    }
                                }
                            }
                        });

                        return false;
                    };
                    //$scope.Buscar_Click = function () {
                    //    var objSolicitudMantenimiento = {};
                    //    objSolicitudMantenimiento.NumeroSolicitud = "43";
                    //    objSolicitudMantenimiento.Descripcion = "Prueba";
                    //    objSolicitudMantenimiento.Fecha = "10/11/2017";
                    //    objSolicitudMantenimiento.Sede = "San Miguel";
                    //    objSolicitudMantenimiento.Area = "Limpieza";
                    //    objSolicitudMantenimiento.Solicitante = "Jesus";

                    //    jQuery("#listaSolicitudMantenimiento").jqGrid('addRowData', i + 1, objSolicitudMantenimiento);
                     
                    //};


                    $scope.Seleccionar_Click = function () {

                        //var validacion = validacionesCamposGuardar();
                        //if (validacion === false) {
                        //    return false;
                        //}
                        //pasando de del fomulario al objeto
                        var myGrid = $('#listaActividadMantenimiento'),
                     selRowId = myGrid.jqGrid('getGridParam', 'selrow'),
                     celValue_Codigo = myGrid.jqGrid('getCell', selRowId, 'Codigo'),
                        celValue_Descripcion = myGrid.jqGrid('getCell', selRowId, 'Descripcion');


                        var objActividad = {};
                        objActividad.Codigo = celValue_Codigo;
                        objActividad.Descripcion = celValue_Descripcion;

                        jQuery("#listaActividades").jqGrid('addRowData', i + 1, objActividad);

                        $scope.$parent.SalirPopup_Click();


                       
                        //var myGrid = $('#listaSolicitudMantenimiento'),
                        //selRowId = myGrid.jqGrid('getGridParam', 'selrow'),
                        //celValue = myGrid.jqGrid('getCell', selRowId, 'NumeroSolicitud');
                        //$rootScope.DatosFormulario.DatosFicha.NumeroSolicitud = celValue;
                        //$scope.$parent.SalirPopup_Click();

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

                    jQuery("#listaActividadMantenimiento").jqGrid({

                        datatype: "local",
                        colNames: ['Código', 'Descripción'],
                        colModel: [
                            { name: 'Codigo', index: 'Codigo', width: 80, align: "center" },
                         { name: 'Descripcion', index: 'Descripcion', width: 120, align: "center" }
                        ],
                        shrinkToFit: false,
                        autowidth: true
                    });
                }] );
}) ();