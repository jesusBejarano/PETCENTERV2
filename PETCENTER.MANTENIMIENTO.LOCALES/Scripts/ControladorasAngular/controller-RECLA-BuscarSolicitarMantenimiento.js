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

                        if ($rootScope.DatosFormulario.FiltrosBusquedaMantenimiento == undefined) {
                            $rootScope.DatosFormulario.FiltrosBusquedaMantenimiento = {};
                        }

                        if ($rootScope.DatosFormulario.FiltrosBusquedaMantenimientoCargaInicial == undefined) {
                            $rootScope.DatosFormulario.FiltrosBusquedaMantenimientoCargaInicial = {};
                        }
                        
                        $scope.CargaInicialBusquedaMantenimiento();

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

                    $scope.CargaInicialBusquedaMantenimiento= function () {
                        $.ajax({
                            url: "Index",
                            type: "POST",
                            headers: { __RequestVerificationToken: $('input[name=__RequestVerificationToken]').val() },
                            data: "",
                            dataType: "json",
                            cache: true,
                            async: false,
                            success: function (data) {
                                if (data) {
                                    FechaInicioDefault = data.FechaInicio;
                                    FechaFinDefault = data.FechaFin;
                                    $rootScope.DatosFormulario.FiltrosBusquedaMantenimiento.FechaInicio = FechaInicioDefault;
                                    $rootScope.DatosFormulario.FiltrosBusquedaMantenimiento.FechaFin = FechaFinDefault;
                                    $rootScope.DatosFormulario.FiltrosBusquedaMantenimientoCargaInicial.Estado = data.Estado;
                                    $rootScope.DatosFormulario.FiltrosBusquedaMantenimientoCargaInicial.TipoMantenimiento = data.TipoMantenimiento;
                                    $rootScope.DatosFormulario.FiltrosBusquedaMantenimientoCargaInicial.Sede = data.Sede;
                                    $rootScope.DatosFormulario.FiltrosBusquedaMantenimientoCargaInicial.Area = data.Area;
                                }
                            }
                        });
                    };

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

                        var temFechaInicio = $rootScope.DatosFormulario.FiltrosBusquedaMantenimiento .FechaInicio;
                        var temFechaFin = $rootScope.DatosFormulario.FiltrosBusquedaMantenimiento.FechaFin;

                        var fechaInicio = temFechaInicio.split(" ")[0].split("/");
                        var fechaFin = temFechaFin.split(" ")[0].split("/");


                        var fechaInicioFinal = fechaInicio[2] + '-' + fechaInicio[1] + '-' + fechaInicio[0] + ' 23:59:45';
                        var fechaFinFinal = fechaFin[2] + '-' + fechaFin[1] + '-' + fechaFin[0] + ' 23:59:45';

                        //fechaFinFinal = '2016-11-29 17:15:45';

                        var request = $rootScope.DatosFormulario.FiltrosBusquedaMantenimiento;
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
                                    for (i = 0; i < data.ListaMantenimiento.length; i++) {
                                        jQuery("#listaSolicitudMantenimiento").jqGrid('addRowData', i + 1, data.ListaMantenimiento[i]);
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
                       
                        var myGrid = $('#listaSolicitudMantenimiento'),
                        selRowId = myGrid.jqGrid('getGridParam', 'selrow'),
                        celValuec = myGrid.jqGrid('getCell', selRowId, 'Codigo'),
                        celValueDescripcion = myGrid.jqGrid('getCell', selRowId, 'Descripcion'),
                        celValueFechaHoraCreacion = myGrid.jqGrid('getCell', selRowId, 'FechaHoraCreacion'),
                        celValueTipoMantenimiento = myGrid.jqGrid('getCell', selRowId, 'TipoMantenimiento'),
                        celValueSede = myGrid.jqGrid('getCell', selRowId, 'Sede')
                        celValueArea = myGrid.jqGrid('getCell', selRowId, 'Area') ;
                        //celValueDescripcion = myGrid.jqGrid('getCell', selRowId, 'Descripcion'),
                        //celValueFechaHoraCreacion = myGrid.jqGrid('getCell', selRowId, 'FechaHoraCreacion'),
                        //celValueTipoMantenimiento = myGrid.jqGrid('getCell', selRowId, 'TipoMantenimiento'),
                        //celValueSede = myGrid.jqGrid('getCell', selRowId, 'Sede'),
                        //celValueArea = myGrid.jqGrid('getCell', selRowId, 'Area');
                        $rootScope.DatosFormulario.DatosFicha.NumeroMantenimiento = celValuec;
                        $rootScope.DatosFormulario.DatosFicha.DescripcionSoliciud = celValueDescripcion;
                        $rootScope.DatosFormulario.DatosFicha.DescripcionMantenimiento = celValueFechaHoraCreacion;
                        $rootScope.DatosFormulario.DatosFicha.TipoMantenimiento = celValueTipoMantenimiento;
                        $rootScope.DatosFormulario.DatosFicha.Sede = celValueSede;
                        $rootScope.DatosFormulario.DatosFicha.Area = celValueArea;

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
                        //url: 'ObtenerSolicitudes',
                        datatype: "local",
                        colNames: ['Código', 'Descripción', 'Fecha Creación', 'Tipo Mantenimiento', 'Sede', 'Área'],
                        colModel: [
                            { name: 'Codigo', index: 'Codigo', width: 220, align: "center", sortable: false },
                            { name: 'Descripcion', index: 'Descripcion', width: 220, align: "center", sortable: false },
                            { name: 'FechaHoraCreacion', index: 'FechaHoraCreacion', width: 220, align: "center", sortable: false },
                            { name: 'TipoMantenimiento', index: 'TipoMantenimiento', width: 220, align: "center", sortable: false },
                            { name: 'Sede', index: 'Sede', width: 220, align: "center", sortable: false },
                            { name: 'Area', index: 'Area', width: 220, sortable: false, align: "center", }

                        ],
                        rowNum: 10,
                        rowList: [10, 20, 30],
                        pager: '#pagerlistaSolicitudMantenimiento',
                        //sortname: 'Codigo',
                        shrinkToFit: false,
                        autowidth: true,

                        viewrecords: true//,
                        //sortorder: "desc"
                    });
                    jQuery("#listaSolicitudMantenimiento").jqGrid('navGrid', '#pagerlistaSolicitudMantenimiento', { edit: false, add: false, del: false });


                }] );
}) ();