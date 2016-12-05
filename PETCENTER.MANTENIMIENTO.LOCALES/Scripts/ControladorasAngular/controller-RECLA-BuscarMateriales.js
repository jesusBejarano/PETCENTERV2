(function () {
    angular.module ( 'api' )
        .controller('BuscarMaterialesFichaController',
            ['$scope', '$http', '$routeParams', '$timeout', 'Enum', 'ParseHtml', '$rootScope', 'Helpers', 'ServiciosConector', '$compile',
                function ($scope, $http, $routeParams, $timeout, Enum, ParseHtml, $rootScope, Helpers, ServiciosConector, $compile) {
                    
                    $timeout(function () {
                        ponerFechas();
                        PonerFocoInicio();
                        if ($rootScope.DatosFormulario == undefined)
                            $rootScope.DatosFormulario = {};
                        if ($rootScope.DatosFormulario.DatosMateriales == undefined)
                            $rootScope.DatosFormulario.DatosMateriales = {};
                        if ($rootScope.DatosFormulario.DatosFicha == undefined)
                            $rootScope.DatosFormulario.DatosFicha = {};

                        $rootScope.DatosFormulario.DatosMateriales = {};
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
                        //var objSolicitudMantenimiento = {};
                        //objSolicitudMantenimiento.NumeroSolicitud = "43";
                        //objSolicitudMantenimiento.Descripcion = "Prueba";
                        //objSolicitudMantenimiento.Fecha = "10/11/2017";
                        //objSolicitudMantenimiento.Sede = "San Miguel";
                        //objSolicitudMantenimiento.Area = "Limpieza";
                        //objSolicitudMantenimiento.Solicitante = "Jesus";

                        //jQuery("#listaSolicitudMantenimiento").jqGrid('addRowData', i + 1, objSolicitudMantenimiento);
                        if ($rootScope.EsEnter) {
                            return false;
                        }

                        if (validateForm("#BuscarMaterialesMantenimientoFrm") == false) {
                            return false;
                        }
                        var trf = $("#listaMaterialesMantenimiento tbody:first tr:first")[0];
                        $("#listaMaterialesMantenimiento tbody:first").empty().append(trf);

                        var request = $rootScope.DatosFormulario.DatosMateriales;
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
                    //$scope.Seleccionar_Click = function () {
                       
                    //    var myGrid = $('#listaSolicitudMantenimiento'),
                    //    selRowId = myGrid.jqGrid('getGridParam', 'selrow'),
                    //    celValue = myGrid.jqGrid('getCell', selRowId, 'NumeroSolicitud');
                    //    $rootScope.DatosFormulario.DatosFicha.NumeroSolicitud = celValue;
                    //    $scope.$parent.SalirPopup_Click();

                    //};
                    $scope.Seleccionar_Click = function () {

                        var myGrid = $('#listaMaterialesMantenimiento'),
                     selRowId = myGrid.jqGrid('getGridParam', 'selrow'),
                     celValue_Codigo = myGrid.jqGrid('getCell', selRowId, 'Codigo'),
                        celValue_Descripcion = myGrid.jqGrid('getCell', selRowId, 'Descripcion');
                        celValue_Cantidad = 1;


                        var objMaterial = {};
                        objActividad.Codigo = celValue_Codigo;
                        objActividad.Descripcion = celValue_Descripcion;
                        objActividad.Cantidad = celValue_Cantidad;

                        jQuery("#listaMateriales").jqGrid('addRowData', i + 1, objMaterial);

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

                    jQuery("#listaMaterialesMantenimiento").jqGrid({

                        datatype: "local",
                        colNames: ['Codigo', 'Descripción'],
                        colModel: [
                            { name: 'Codigo', index: 'Codigo', width: 80, align: "center" },
                         { name: 'Descripcion', index: 'Descripcion', width: 120, align: "center" }
                        ],
                        shrinkToFit: false,
                        autowidth: true
                    });
                }] );
}) ();