(function () {
    angular.module ( 'api' )
        .controller('BuscarMantenimientoSolicitudController',
            ['$scope', '$http', '$routeParams', '$timeout', 'Enum', 'ParseHtml', '$rootScope', 'Helpers', 'ServiciosConector', '$compile',
                function ($scope, $http, $routeParams, $timeout, Enum, ParseHtml, $rootScope, Helpers, ServiciosConector, $compile) {
                    
                    $timeout(function () {
                        ponerFechas();
                        PonerFocoInicio();
                        if ($rootScope.DatosFormulario == undefined)
                            $rootScope.DatosFormulario = {};
                        if ($rootScope.DatosFormulario.DatosMantenimiento == undefined)
                            $rootScope.DatosFormulario.DatosMantenimiento = {};
                        if ($rootScope.DatosFormulario.DatosFicha == undefined)
                            $rootScope.DatosFormulario.DatosFicha = {};

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
                        var objSolicitudMantenimiento = {};
                        objSolicitudMantenimiento.NumeroSolicitud = "43";
                        objSolicitudMantenimiento.Descripcion = "Prueba";
                        objSolicitudMantenimiento.Fecha = "10/11/2017";
                        objSolicitudMantenimiento.Sede = "San Miguel";
                        objSolicitudMantenimiento.Area = "Limpieza";
                        objSolicitudMantenimiento.Solicitante = "Jesus";

                        jQuery("#listaSolicitudMantenimiento").jqGrid('addRowData', i + 1, objSolicitudMantenimiento);
                     
                    };
                    $scope.Seleccionar_Click = function () {
                       
                        var myGrid = $('#listaSolicitudMantenimiento'),
                        selRowId = myGrid.jqGrid('getGridParam', 'selrow'),
                        celValue = myGrid.jqGrid('getCell', selRowId, 'NumeroSolicitud');
                        $rootScope.DatosFormulario.DatosFicha.NumeroSolicitud = celValue;
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

                    jQuery("#listaSolicitudMantenimiento").jqGrid({

                        datatype: "local",
                        colNames: ['Nro Solicitud', 'Descripción', 'Fecha', 'Sede', 'Area', 'Solicitante'],
                        colModel: [
                            { name: 'NumeroSolicitud', index: 'NumeroSolicitud', width: 80, align: "center" },
                         { name: 'Descripcion', index: 'Descripcion', width: 120, align: "center" },
                            { name: 'Fecha', index: 'Fecha', width: 120, align: "center" },
                              { name: 'Sede', index: 'Sede', width: 120, align: "center" },
                              { name: 'Area', index: 'Area', width: 120, align: "center" },
                              { name: 'Solicitante', index: 'Solicitante', width: 120, align: "Solicitante" }
                        ],
                        shrinkToFit: false,
                        autowidth: true
                    });
                }] );
}) ();