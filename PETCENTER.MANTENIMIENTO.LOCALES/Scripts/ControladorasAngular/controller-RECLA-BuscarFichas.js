(function () {
    angular.module('api')
        .controller('BuscarFichasController',
            ['$scope', '$http', '$routeParams', '$timeout', 'Enum', 'ParseHtml', '$rootScope', 'Helpers', 'ServiciosConector', '$compile',
                function ($scope, $http, $routeParams, $timeout, Enum, ParseHtml, $rootScope, Helpers, ServiciosConector, $compile) {
                    $timeout(function () {
                        ponerFechas();
                        PonerFocoInicio();
                        if ($rootScope.DatosFormulario == undefined) {
                            $rootScope.DatosFormulario = {};
                        }
                        if ($rootScope.DatosFormulario.DatosFicha == undefined)
                            $rootScope.DatosFormulario.DatosFicha = {};

                        if ($rootScope.DatosFormulario.FiltrosBusquedaFicha == undefined) {
                            $rootScope.DatosFormulario.FiltrosBusquedaFicha = {};
                        }
                        if ($rootScope.DatosFormulario.FiltrosBusquedaFichaCargaInicial == undefined) {
                            $rootScope.DatosFormulario.FiltrosBusquedaFichaCargaInicial = {};
                        }


                        $rootScope.DatosFormulario.FiltrosBusquedaFicha = {};

                        $scope.CargaInicialBusquedaFicha();
                        $scope.FlagMostrarBotonNuevo = true;
                    });

                    var FechaInicioDefault;
                    var FechaFinDefault;

                    $scope.MiBoton = function (idgrilla, tipoboton, cellvalue, options, rowObject) {
                        var eventoclick = "";
                        switch (idgrilla) {
                            case "grillaReclamosBusquedaReclamos": {
                                switch (tipoboton) {
                                    case "Editar":
                                        eventoclick = "$parent.EditarReclamo('" + rowObject.NumeroReclamo + "'" + ",'" + rowObject.CodigoEstadoGeneral + "'" + ");";
                                        break;
                                }
                                /*
                                switch (tipoboton) {
                                    case "Quitar":
                                        eventoclick = "$parent.QuitarReclamo('" + rowObject.NumeroReclamo + "');";
                                        break;
                                }
                                */
                            }
                                break;
                        }
                        var html = "";
                        if (tipoboton == "Editar") {
                            html = HtmlCrearBoton("Modificar", eventoclick, "");
                        }
                        /*
                        if (tipoboton == "Quitar") {
                            html = HtmlCrearBoton("Eliminar", eventoclick, "");
                        }
                        */
                        return html;
                    };
                    $scope.EditarSolicitud = function (codigoSolicitud) {
                        $rootScope.DatosFormulario.DatosFicha.SolicitudFlagEditar = true;
                        window.location.href = '/Ficha/RegistroFicha?codigoSolicitud' + codigoSolicitud;
                    };
                    $rootScope.QuitarReclamo = function (numeroReclamo) {
                        MiConfirm("¿Está seguro de eliminar la Ficha?.", function () {
                            var listaGrillaReclamo = $rootScope.DatosFormulario.grillaReclamosBusquedaReclamos;

                            $rootScope.DatosFormulario.RegistroACEscalonado.ListaRate = listaGrillaRA;
                            $rootScope.DatosFormulario.RegistroACEscalonado.grillaListaRAMemoriaList = listaBaseRA;
                            $scope.gridapigrillaAceListaRate.refresh(listaGrillaRA);
                            $rootScope.$apply();
                            if ($rootScope.DatosFormulario.RegistroACEscalonado.DatosRegistroACE.CodigoAcuerdoComercialEscalonado > 0) {
                                $rootScope.HabilitarCampoRate();
                            }
                        });
                    }
                    $scope.CargaInicialBusquedaFicha = function () {
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
                                    $rootScope.DatosFormulario.FiltrosBusquedaFicha.FechaInicio = FechaInicioDefault;
                                    $rootScope.DatosFormulario.FiltrosBusquedaFicha.FechaFin = FechaFinDefault;
                                    $rootScope.DatosFormulario.FiltrosBusquedaFichaCargaInicial.Estado = data.Estado;
                                    $rootScope.DatosFormulario.FiltrosBusquedaFichaCargaInicial.TipoMantenimiento = data.TipoMantenimiento;
                                    $rootScope.DatosFormulario.FiltrosBusquedaFichaCargaInicial.Sede = data.Sede;
                                    $rootScope.DatosFormulario.FiltrosBusquedaFichaCargaInicial.Area = data.Area;
                                }
                            }
                        });
                    };
                    $scope.Buscar_Click = function () {
                        //  $scope.compilarGrilla("#consultaSolicitudes");

                        if ($rootScope.EsEnter) {
                            return false;
                        }

                        if (validateForm("#BusquedaFichaFrm") == false) {
                            return false;
                        }
                        var trf = $("#consultaFichas tbody:first tr:first")[0];
                        $("#consultaFichas tbody:first").empty().append(trf);

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
                            url: "ObtenerFichas",
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
                    $scope.Nuevo_Click = function () {
                        $rootScope.DatosFormulario.DatosFicha.SolicitudFlagEditar = false;
                        window.location.href = '/Ficha/RegistroFicha';
                    };
                    $scope.Salir_Click = function () {
                        window.location.href = 'http://' + window.location.host;
                    }
                    $scope.Limpiar_Click = function () {
                        $rootScope.DatosFormulario.FiltrosBusquedaFicha.CodigoSolicitud = null;
                        $rootScope.DatosFormulario.FiltrosBusquedaFicha.CodigoTipoMantenimiento = null;
                        $rootScope.DatosFormulario.FiltrosBusquedaFicha.Estado = null;
                        $rootScope.DatosFormulario.FiltrosBusquedaFicha.CodigoSede = null;
                        $rootScope.DatosFormulario.FiltrosBusquedaFicha.CodigoArea = null;
                        $rootScope.DatosFormulario.FiltrosBusquedaFicha.FechaInicio = FechaInicioDefault;
                        $rootScope.DatosFormulario.FiltrosBusquedaFicha.FechaFin = FechaFinDefault;
                    };

                    $scope.ListarSedeByNegocio = function () {
                        var param = $rootScope.DatosFormulario.FiltrosBusquedaFicha.CodigoNegocio;
                        $.ajax({
                            url: "/Reclamos/ListarSedeByNegocio",
                            type: "POST",
                            headers: { __RequestVerificationToken: $('input[name=__RequestVerificationToken]').val() },
                            data: "codigoNegocio=" + param,
                            dataType: "json",
                            cache: true,
                            async: false,
                            success: function (data) {
                                $rootScope.DatosFormulario.FiltrosBusquedaReclamosCargaInicial.HabilitadoSede = 'True';
                                $rootScope.DatosFormulario.FiltrosBusquedaReclamosCargaInicial.Sede = data.Sede;
                                if (data.Sede.length > 0) {
                                    $rootScope.DatosFormulario.FiltrosBusquedaFicha.CodigoSede = $rootScope.DatosFormulario.FiltrosBusquedaReclamosCargaInicial.Sede[0].CodigoSede
                                    if (data.Sede.length == 1) {
                                        $rootScope.DatosFormulario.FiltrosBusquedaReclamosCargaInicial.HabilitadoSede = 'False';
                                        $(".caja11.msgerror.CodigoSede").html("");
                                        $scope.ListarTipoReclamosByNegocioSede();
                                    }
                                }
                            }
                        });
                    };

                    $scope.ListarTipoReclamosByNegocioSede = function () {
                        var param = $rootScope.DatosFormulario.FiltrosBusquedaFicha.CodigoNegocio;
                        var param2 = $rootScope.DatosFormulario.FiltrosBusquedaFicha.CodigoSede;
                        $.ajax({
                            url: "/Reclamos/ListarTipoReclamosByNegocioSede",
                            type: "POST",
                            headers: { __RequestVerificationToken: $('input[name=__RequestVerificationToken]').val() },
                            data: "codigoNegocio=" + param + "&codigoSede=" + param2,
                            dataType: "json",
                            cache: true,
                            async: false,
                            success: function (data) {
                                $rootScope.DatosFormulario.FiltrosBusquedaReclamosCargaInicial.TipoReclamo = data.TipoReclamo;
                            }
                        });
                    };

                    $scope.BuscarCliente_Click = function () {
                        $rootScope.FlagCallClientes = "ConsultaReclamos";
                        $rootScope.FlagTipoCliente = "ConsultaReclamos";
                        var altura = 800;
                        getPopupResponsive({
                            formURL: "es-PE/sistema/busqueda/buscar-cliente/",
                            title: "Buscar Cliente",
                            nombreDiv: "divPopupBuscarCliente",
                            nombreGrid: "",
                            width: "1200px",
                            height: altura,
                            params: {},
                            HideSelection: true,
                            multiSelect: false,
                            select: function (row) {
                                return true;
                            },
                            beforeShow: function (obj) {
                                $rootScope.hashPopup = $(obj).attr("mapurl");
                                $compile($("#divPopupBuscarCliente"))($scope);
                            }
                        });
                    };

                    $scope.Enter = function () {
                        $rootScope.EsEnter = true;
                        return false;
                    };

                    $("input").focusout(function () {
                        $rootScope.EsEnter = false;
                    });



                    jQuery("#consultaFichas").jqGrid({
                        //url: 'ObtenerSolicitudes',
                        datatype: "local",
                        colNames: ['Código', 'Descripción','Estado', 'Fecha Creación', 'Tipo Mantenimiento', 'Sede', 'Área', 'Editar'],
                        colModel: [
                            { name: 'Codigo', index: 'Codigo', width: 220, align: "center", sortable: false },
                            { name: 'Descripcion', index: 'Descripcion', width: 220, align: "center", sortable: false },
                            { name: 'Estado', index: 'Estado', width: 220, align: "center", sortable: false },
                            { name: 'FechaHoraCreacion', index: 'FechaHoraCreacion', width: 220, align: "center", sortable: false },
                            { name: 'TipoMantenimiento', index: 'TipoMantenimiento', width: 220, align: "center", sortable: false },
                            { name: 'Sede', index: 'Sede', width: 220, align: "center", sortable: false },
                            { name: 'Area', index: 'Area', width: 220, sortable: false, align: "center", },
                           {
                               name: 'Editar',
                               align: 'center',
                               sortable: false,
                               width: 230,
                               formatter: function (cellvalue, options, rowObject) {
                                   return "<div style='width:100%;padding-left:10px'>" +
                                     "<a style='cursor:pointer;width:100%'>" +
                                     "<button title='Imprimir' onclick='Editar(" + rowObject.Codigo + ")'  class='boton1Style botonpequenio'>" +
                                     "<img width='16' height='16' src='/Images/editar.png'></button></a></div>";
                               }
                           }
                        ],
                        rowNum: 10,
                        rowList: [10, 20, 30],
                        pager: '#pagerconsultaFichas',
                        //sortname: 'Codigo',
                        shrinkToFit: false,
                        autowidth: true,

                        viewrecords: true//,
                        //sortorder: "desc"
                    });
                    jQuery("#consultaFichas").jqGrid('navGrid', '#pagerconsultaFichas', { edit: false, add: false, del: false });


                    //$scope.compilarGrilla = function(Id) {
                    //    $(Id).find('td[role=gridcell]').each(function (x) {
                    //                $compile($(this))($scope);
                    //    });
                    //};
                }]);
})();